import asyncio
import io
import json
import logging
from typing import List, Optional, Dict
import uuid

from fastapi import Request, UploadFile, Form, File
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.constants import Permission
from src.api.admin.auth.utils import permission
from src.api.admin.dashboard.constants import UsqtyType, CRUDType
from src.api.admin.dashboard.repository import usage_repository
from src.api.admin.dashboard.schemas import CreateUsageQuantitySchema
from src.api.admin.manual.exception import (
    NotFoundManualException,
    ManualException,
    DuplicateManualException,
)
from src.api.admin.manual.request import ManualSearchParam, CreatePreprocessRequest
from src.api.admin.manual.response import (
    ManualResponse,
    ManualDetailResponse,
    PreprocessDetailResponse,
)
from src.api.chatbot.repository import chatbot_repository
from src.api.chatbot.schemas import UpdateChatbotSchema
from src.api.preprocessing.constants import Pattern
from src.api.preprocessing.repository import preprocessing_repository
from src.api.preprocessing.schemas import CreatePreprocessingSchema, Preprocessing
from src.api.preprocessing.utils import DataPreprocess, manual_pattern_changer
from src.api.vectordb import utils
from src.api.vectordb.repository import vector_db_repository
from src.api.vectordb.schemas import (
    VectorDB,
    CreateVectorDBSchema,
    UpdateVectorDBSchema,
)
from src.api.vectordb.utils import VectorDBEmbeddings
from src.core.config import config
from src.core.constants import OrderBy
from src.core.database import transactional
from src.core.exception import OpenAIRateLimitError, ApiBaseException
from src.core.ncp_client import ncp_client

vectordb = VectorDBEmbeddings()


@transactional
@permission(Permission.MANUAL.value)
async def get_all(
    db: AsyncSession, request: Request, request_body: ManualSearchParam
) -> List[ManualResponse]:
    manuals = await vector_db_repository.get_all_manuals(
        db, pageable=request_body
    )
    return [ManualResponse.of(manual) for manual in manuals]


@transactional
@permission(Permission.MANUAL.value)
async def get_one_manual(
    db: AsyncSession, request: Request, manual_id: int
) -> ManualDetailResponse:
    # id로 manual 한 페이지 가져와 manual_name 얻어냄
    manual_page = await vector_db_repository.get_by_id(db, id=manual_id)
    if not manual_page:
        raise NotFoundManualException()
    # manual_name으로 1개의 매뉴얼 가져오기
    manual = await vector_db_repository.get_one_manual(
        db, manual_name=manual_page.manual_name
    )
    return ManualDetailResponse.of(manual)


@transactional
@permission(Permission.MANUAL.value)
async def get_one_preprocess(
    db: AsyncSession, request: Request, set_id: int
) -> PreprocessDetailResponse:
    # vectordb 테이블에서는 manual_name으로 구분할 수 있지만
    # preprocessing 테이블에서는 구분을 못해서 set_id로 구분 (등록 하다 취소 한 경우 중복 발생)
    manual_set = await preprocessing_repository.get_one_manual_by_set_id(
        db, set_id=set_id
    )
    if not manual_set:
        raise NotFoundManualException()
    return PreprocessDetailResponse.of(manual_set)


@transactional
@permission(Permission.MANUAL.value)
async def create_preprocessing(
    db: AsyncSession,
    request: Request,
    pattern: str = Form(...),
    manual_file: UploadFile = File(...),
) -> int:
    # 이미 등록된 매뉴얼인지 확인
    manual_name = manual_file.filename
    manual = await vector_db_repository.is_exist_by_manual_name(
        db, manual_name=manual_name
    )
    if manual:
        raise DuplicateManualException()

    current_user_id = request.session.get("current_user")
    preprocessing_rows, usage_quantity_rows, upload_file_list = [], [], []

    manual_directory = ncp_client.path_maker(
        prefix_url=config.TMP_DIR, manual_name=manual_name
    )
    upload_file_list.append((manual_file.file, manual_directory))

    # Form 데이터 validation 용
    pattern_data = CreatePreprocessRequest.model_validate(json.loads(pattern))
    # 딕셔너리로 변경
    pattern_dict = manual_pattern_changer(pattern_data.model_dump())

    # 매뉴얼 파일 bytes로 변환하여 데이터 전처리
    manual_content = await manual_file.read()
    data_preprocess = DataPreprocess(
        manual_file=manual_content, pattern_dict=pattern_dict
    )
    data_preprocess.extract()
    preprocessed_dict, token_dict = await asyncio.to_thread(
        data_preprocess.preprocess_txt
    )

    # preprocessing 테이블에서 마지막 set_id 가져옴
    # set_id 조회 시 sqlalchemy의 with_for_update문을 사용,
    # 이는 select ... for update문(특정 )과 동일한 작용을 함
    # 가장 큰 set_id의 row를 lock 하여 다른 트랜잭션에서 이 row를 읽는 것을 방지
    last_set_id = await preprocessing_repository.get_last_set_id(db)
    current_set_id = last_set_id + 1 if last_set_id else 1

    for key, value in preprocessed_dict.items():
        image_path = ncp_client.path_maker(
            prefix_url=config.TMP_DIR, manual_name=manual_name, file_name=f"{key}.png"
        )
        upload_file_list.append((value["images"], image_path))

        preprocessing_rows.append(
            CreatePreprocessingSchema.of(
                value, current_set_id, image_path, manual_name, current_user_id
            )
        )
    preprocesses = await preprocessing_repository.bulk_create(
        db, objs_in=preprocessing_rows
    )

    for preprocess, (key, value) in zip(preprocesses, token_dict.items()):
        usage_quantity_rows.append(
            CreateUsageQuantitySchema.of_preprocessing(
                value,
                preprocess,
                UsqtyType.PREPROCESSING.value,
                CRUDType.INSERT.value,
                current_user_id,
            )
        )
    await usage_repository.bulk_create(db, objs_in=usage_quantity_rows)

    for key, value in pattern_dict.items():
        if value == Pattern.EXCLUDE.value:
            continue
        if preprocessed_dict.get(key) is None:
            raise OpenAIRateLimitError()

    for upload_file in upload_file_list:
        await ncp_client.upload_file(upload_file[0], upload_file[1])

    return current_set_id


@transactional
@permission(Permission.MANUAL.value)
async def create_collection(
    db: AsyncSession,
    request: Request,
    set_id: int,
    updated_pages: Optional[str] = Form(None),
    added_pages: Optional[str] = Form(None),
    image_files: List[UploadFile] = File([]),
):
    vectordb_rows, usage_quantity_rows = [], []
    upload_file_list, change_file_list = [], []
    embedding_data_dict = dict()
    hash_id_list = []

    try:
        # set_id로 전처리 된 매뉴얼 가져오기
        preprocesses = await preprocessing_repository.get_one_manual_by_set_id(
            db, set_id=set_id
        )
        manual_name = preprocesses[0].manual_name

        # 작업 종료 후 파일 업로드 시 매뉴얼이 저장 될 위치
        manual_path = ncp_client.path_maker(
            prefix_url=config.SAVE_DIR, manual_name=manual_name
        )
        before_manual_path = ncp_client.prefix_changer(manual_path)
        change_file_list.append((before_manual_path, manual_path))

        # 매뉴얼 중복 방지
        manual = await vector_db_repository.is_exist_by_manual_name(
            db, manual_name=manual_name
        )
        if manual:
            raise DuplicateManualException()

        current_user_id = request.session.get("current_user")

        # 추가/수정 된 페이지의 데이터를 json 형태로 바꿔, 그 페이지들을 list 형대로 가져 옴.
        # updated_page_dict, added_page_dict는 {id: {페이지 정보}, id: {페이지 정보}, ...} 과 같은 형태
        updated_page_dict = utils.modify_and_validate_page_data(
            updated_pages, "updated_pages"
        )
        added_page_dict = utils.modify_and_validate_page_data(
            added_pages, "added_pages"
        )

        # 전처리된 매뉴얼 set 리스트를 id를 키로 하는 딕셔너리로 변경
        preprocessed_list = [
            Preprocessing.model_validate(preprocess).model_dump()
            for preprocess in preprocesses
        ]
        preprocessed_dict = {
            preprocess["id"]: preprocess for preprocess in preprocessed_list
        }

        if updated_pages:
            # 변경된 페이지 정보를 preprocessed_dict에 덮어 씌우기
            for updated_page_id, updated_page in updated_page_dict.items():
                if updated_page_id in preprocessed_dict:
                    target_preprocess = preprocessed_dict[updated_page_id]
                    target_preprocess.update(
                        {
                            "screen_id": updated_page.get(
                                "source", target_preprocess["screen_id"]
                            ),
                            "subject": updated_page.get(
                                "subject", target_preprocess["subject"]
                            ),
                            "content": updated_page.get(
                                "content", target_preprocess["content"]
                            ),
                        }
                    )

        last_vector_id = await vector_db_repository.get_last_id(db)
        next_vector_id = last_vector_id + 1 if last_vector_id is not None else 1

        for preprocess_id, preprocess in preprocessed_dict.items():
            hash_id = uuid.uuid4()
            hash_id_list.append(hash_id)
            embedding_data_dict[hash_id] = {
                "preprocess_id": preprocess_id,
                "source": preprocess.get("screen_id"),
                "subject": preprocess.get("subject"),
                "content": preprocess["content"],
                "manual_name": preprocess["manual_name"],
                "image_path": preprocess.get("image_path"),
            }

        # 페이지 추가인 경우 vectordb row 추가
        if added_page_dict:
            for added_page_id, added_page in added_page_dict.items():
                hash_id = uuid.uuid4()
                hash_id_list.append(hash_id)
                embedding_data_dict[hash_id] = {
                    "added_page_id": added_page_id,
                    "source": added_page.get("source"),
                    "subject": added_page.get("subject"),
                    "content": added_page["content"],
                }

        # ChromaDB에 임베딩 후 임베딩에 사용된 토큰 반환
        vectordb.make_document(embedding_data_dict)
        token_dict = vectordb.embedding()

        added_image_dict, updated_image_dict = utils.image_list_to_dict(image_files)
        for hash_id, embedding_data in embedding_data_dict.items():
            # 실제 임베딩 된 결과 값 인지 확인 후 다음 로직 수행
            if token_dict.get(hash_id) is None:
                continue
            image_path = None
            if embedding_data.get("preprocess_id") is not None:
                preprocess_id = embedding_data["preprocess_id"]
                # preprocess 테이블에 있던 경우, 파일 위치 tmp -> upload로 이동
                if embedding_data.get("image_path"):
                    image_path = ncp_client.path_maker(
                        prefix_url=config.SAVE_DIR,
                        manual_name=manual_name,
                        file_name=f"{next_vector_id}.png",
                    )
                    change_file_list.append((embedding_data["image_path"], image_path))

                # 기존에는 없었던 파일 추가
                if updated_image_dict.get(preprocess_id):
                    image_data = updated_image_dict[preprocess_id]
                    image_path = ncp_client.path_maker(
                        prefix_url=config.SAVE_DIR,
                        manual_name=manual_name,
                        file_name=image_data["name"],
                    )
                    file_content = await image_data["file"].read()
                    image_bytes = io.BytesIO(file_content)
                    image_bytes.seek(0)
                    upload_file_list.append((image_bytes, image_path))

                vectordb_rows.append(
                    CreateVectorDBSchema.of(
                        id=next_vector_id,
                        preprocessed_dict=embedding_data,
                        hash_id=hash_id,
                        manual_path=manual_path,
                        image_path=image_path,
                        user_id=current_user_id,
                    )
                )
                if token_dict.get(hash_id) is not None:
                    usage_quantity_rows.append(
                        CreateUsageQuantitySchema.of_vector(
                            token_dict[hash_id],
                            next_vector_id,
                            UsqtyType.EMBEDDING.value,
                            CRUDType.INSERT.value,
                            current_user_id,
                        )
                    )

            if embedding_data.get("added_page_id") is not None:
                added_page_id = embedding_data["added_page_id"]
                # 추가 페이지 중 이미지 추가가 있는 경우
                if added_image_dict.get(added_page_id) is not None:
                    image_data = added_image_dict[added_page_id]
                    image_path = ncp_client.path_maker(
                        prefix_url=config.SAVE_DIR,
                        manual_name=manual_name,
                        file_name=str(next_vector_id) + image_data["name"],
                    )
                    file_content = await image_data["file"].read()
                    image_bytes = io.BytesIO(file_content)
                    image_bytes.seek(0)
                    upload_file_list.append((image_bytes, image_path))

                embedding_data.update(
                    {"id": next_vector_id, "manual_name": manual_name}
                )
                vectordb_rows.append(
                    CreateVectorDBSchema.of_add(
                        new_page=embedding_data,
                        hash_id=hash_id,
                        manual_path=manual_path,
                        image_path=image_path,
                        user_id=current_user_id,
                    )
                )
                if token_dict.get(hash_id) is not None:
                    usage_quantity_rows.append(
                        CreateUsageQuantitySchema.of_vector(
                            token_dict[hash_id],
                            next_vector_id,
                            UsqtyType.EMBEDDING.value,
                            CRUDType.INSERT.value,
                            current_user_id,
                        )
                    )

            next_vector_id = next_vector_id + 1

        if len(token_dict) != len(embedding_data_dict):
            raise OpenAIRateLimitError()

        if usage_quantity_rows:
            await usage_repository.bulk_create(db, objs_in=usage_quantity_rows)
        if vectordb_rows:
            await vector_db_repository.bulk_create(db, objs_in=vectordb_rows)

        for change_file in change_file_list:
            ncp_client.move_file_path(change_file[0], change_file[1])
        for upload_file in upload_file_list:
            await ncp_client.upload_file(upload_file[0], upload_file[1])

    except Exception as e:
        message = ApiBaseException.message
        if hash_id_list:
            vectordb.delete_from_collection(hash_id_list)
        if type(e).__name__ == "OpenAIRateLimitError":
            message = OpenAIRateLimitError.message
        raise ApiBaseException(message=message)


@transactional
@permission(Permission.MANUAL.value)
async def update_manual(
    db: AsyncSession,
    request: Request,
    manual_id: int,
    updated_pages: Optional[str] = Form(None),
    added_pages: Optional[str] = Form(None),
    image_files: List[UploadFile] = File([]),
):
    create_vectordb_rows, update_vectordb_rows, usage_quantity_rows = [], [], []
    upload_file_list, change_file_list = [], []
    base_vector_dict, embedding_data_dict = dict(), dict()
    updated_models = []
    updated_hash_id_dict, added_hash_id_list = dict(), []
    current_user_id = request.session.get("current_user")

    try:
        vector = await vector_db_repository.get_by_id(db, id=manual_id)
        updated_page_dict = utils.modify_and_validate_page_data(
            updated_pages, "updated_pages"
        )
        added_page_dict = utils.modify_and_validate_page_data(
            added_pages, "added_pages"
        )

        manual_name = vector.manual_name
        manual_path = ncp_client.path_maker(
            prefix_url=config.SAVE_DIR, manual_name=manual_name
        )

        vectors = await vector_db_repository.get_one_manual(db, manual_name=manual_name)
        vector_list = [
            VectorDB.model_validate(vector).model_dump() for vector in vectors
        ]
        vector_dict = {vector["id"]: vector for vector in vector_list}
        model_dict = {vector.hash_id: vector for vector in vectors}
        added_image_dict, updated_image_dict = utils.image_list_to_dict(image_files)

        for vector_id, vector in vector_dict.items():
            # 내용 변경이 있는 경우
            if updated_page_dict and updated_page_dict.get(vector_id):
                hash_id = vector["hash_id"]
                updated_hash_id_dict = {vector_id: hash_id}
                updated_page = updated_page_dict[vector_id]
                embedding_data_dict[hash_id] = {
                    "source": updated_page.get("source", vector["screen_id"]),
                    "subject": updated_page.get("subject", vector["subject"]),
                    "content": updated_page.get("content", vector["content"]),
                }
                base_vector_dict[hash_id] = {
                    "source": vector["screen_id"],
                    "subject": vector["subject"],
                    "content": vector["content"],
                }
                vector.update(
                    {
                        "screen_id": updated_page.get("source", vector["screen_id"]),
                        "subject": updated_page.get("subject", vector["subject"]),
                        "content": updated_page.get("content", vector["content"]),
                    }
                )

        last_vector_id = await vector_db_repository.get_last_id(db)
        next_vector_id = last_vector_id + 1 if last_vector_id is not None else 1

        if added_page_dict:
            for added_page_id, added_page in added_page_dict.items():
                hash_id = uuid.uuid4()
                added_hash_id_list.append(hash_id)
                embedding_data_dict[hash_id] = {
                    "added_page_id": added_page_id,
                    "source": added_page.get("source"),
                    "subject": added_page.get("subject"),
                    "content": added_page.get("content"),
                }

        vectordb.make_document(embedding_data_dict)
        token_dict = vectordb.upsert_collection()
        for vector_id, vector in vector_dict.items():
            hash_id = vector["hash_id"]

            # 실제 임베딩 된 결과 값 인지 확인 후 다음 로직 수행
            if token_dict != {} and token_dict.get(hash_id) is None:
                continue

            # 기존 매뉴얼에서 변경이 있는 경우
            if (
                updated_page_dict.get(vector_id) is not None
                or updated_image_dict.get(vector_id) is not None
            ):
                # 이미지 변경이 있던 경우
                if updated_image_dict.get(vector_id) is not None:
                    image_data = updated_image_dict[vector_id]
                    image_path = ncp_client.path_maker(
                        prefix_url=config.SAVE_DIR,
                        manual_name=manual_name,
                        file_name=image_data["name"],
                    )
                    vector["image_path"] = image_path
                    file_content = await image_data["file"].read()
                    image_bytes = io.BytesIO(file_content)
                    image_bytes.seek(0)
                    updated_models.append(model_dict[hash_id])
                    upload_file_list.append((image_bytes, image_path))

                # 내용 변경이 있던 경우
                if (
                    token_dict.get(hash_id) is not None
                    and updated_page_dict.get(vector_id) is not None
                ):
                    updated_models.append(model_dict[hash_id])
                    usage_quantity_rows.append(
                        CreateUsageQuantitySchema.of_vector(
                            token_dict[hash_id],
                            vector_id,
                            UsqtyType.EMBEDDING.value,
                            CRUDType.UPDATE.value,
                            current_user_id,
                        )
                    )

                update_vectordb_rows.append(
                    UpdateVectorDBSchema.of(vector, "Y", current_user_id)
                )

        # 추가 페이지
        for hash_id, embedding_data in embedding_data_dict.items():
            image_path = None
            added_page_id = embedding_data.get("added_page_id")
            # 추가가 아닌 경우
            if added_page_id is None:
                continue

            # 이미지 변경이 있던 경우
            if added_image_dict.get(added_page_id) is not None:
                image_data = added_image_dict[added_page_id]
                image_path = ncp_client.path_maker(
                    prefix_url=config.SAVE_DIR,
                    manual_name=manual_name,
                    file_name=str(next_vector_id) + image_data["name"],
                )
                file_content = await image_data["file"].read()
                image_bytes = io.BytesIO(file_content)
                image_bytes.seek(0)
                upload_file_list.append((image_bytes, image_path))

            embedding_data.update({"id": next_vector_id, "manual_name": manual_name})
            create_vectordb_rows.append(
                CreateVectorDBSchema.of_add(
                    new_page=embedding_data,
                    hash_id=hash_id,
                    manual_path=manual_path,
                    image_path=image_path,
                    user_id=current_user_id,
                )
            )
            if token_dict.get(hash_id) is not None:
                usage_quantity_rows.append(
                    CreateUsageQuantitySchema.of_vector(
                        token_dict[hash_id],
                        next_vector_id,
                        UsqtyType.EMBEDDING.value,
                        CRUDType.INSERT.value,
                        current_user_id,
                    )
                )
            next_vector_id = next_vector_id + 1

        if len(token_dict) != len(embedding_data_dict):
            raise OpenAIRateLimitError()

        if usage_quantity_rows:
            await usage_repository.bulk_create(db, objs_in=usage_quantity_rows)
        if create_vectordb_rows:
            await vector_db_repository.bulk_create(db, objs_in=create_vectordb_rows)
        if update_vectordb_rows:
            await vector_db_repository.bulk_update(
                db, db_objs=updated_models, objs_in=update_vectordb_rows
            )

        for change_file in change_file_list:
            ncp_client.move_file_path(change_file[0], change_file[1])
        for upload_file in upload_file_list:
            await ncp_client.upload_file(upload_file[0], upload_file[1])

    except Exception as e:
        message = ApiBaseException.message
        if added_hash_id_list:
            vectordb.delete_from_collection(added_hash_id_list)
        if updated_hash_id_dict != {}:
            vectordb.make_document(base_vector_dict)
            vectordb.upsert_collection()
        if type(e).__name__ == "OpenAIRateLimitError":
            message = OpenAIRateLimitError.message
        raise ApiBaseException(message=message)


@transactional
@permission(Permission.MANUAL.value)
async def delete_manual(db: AsyncSession, request: Request, id_list: str) -> None:
    current_user_id = request.session.get("current_user")
    id_list = list(map(str.strip, id_list.split(",")))
    update_manuals, update_chatbots = [], []

    is_digit = [manual_id.isdigit() for manual_id in id_list]
    if not all(is_digit):
        raise ManualException("id list's element is not number")

    id_list = list(map(int, id_list))

    manuals = await vector_db_repository.get_by_id_list(db, id_list=id_list)
    chatbots = await chatbot_repository.get_by_vector_id_list(db, id_list=id_list)

    vector_models = [VectorDB.model_validate(manual).model_dump() for manual in manuals]
    actual_set = {manual.id for manual in manuals}
    manual_name_set = {manual.manual_name for manual in manuals}

    requested_set = set(id_list)

    missing_ids = requested_set - actual_set

    if missing_ids:
        raise ManualException(
            f"The following IDs do not exist in the database: {', '.join(map(str, missing_ids))}"
        )

    if len(manuals) == 0:
        raise ManualException("id list empty")

    hash_id_list = list()
    for vector_model in vector_models:
        hash_id_list.append(vector_model["hash_id"])
        if vector_model["image_path"]:
            ncp_client.delete_file(vector_model["image_path"])
        update_manuals.append(
            UpdateVectorDBSchema.of(vector_model, "N", current_user_id)
        )

    vectordb.delete_from_collection(hash_id_list)
    await vector_db_repository.bulk_update(db, db_objs=manuals, objs_in=update_manuals)

    for chatbot in chatbots:
        update_chatbots.append(
            UpdateChatbotSchema.of(chatbot.dgstfn, None, current_user_id)
        )

    await chatbot_repository.bulk_update(db, db_objs=chatbots, objs_in=update_chatbots)

    for manual_name in manual_name_set:
        manuals = await vector_db_repository.get_one_manual(db, manual_name=manual_name)
        if len(manuals) == 0:
            manual_path = ncp_client.path_maker(
                prefix_url=config.SAVE_DIR, manual_name=manual_name
            )
            ncp_client.delete_file(manual_path)


@transactional
@permission(Permission.MANUAL.value)
async def only_embedding(db: AsyncSession, request: Request):
    vectors = await vector_db_repository.get_all_vectors(db)
    for vector in vectors:
        data_dict = {
            "hash_id": vector.hash_id,
            "source": vector.screen_id,
            "subject": vector.subject,
            "content": vector.content,
        }
        vectordb.embedding(data_dict)
