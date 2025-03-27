import asyncio
import logging
import re
from collections import defaultdict

from fastapi import Request, BackgroundTasks
from typing import Optional, List, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.answer.repository import admin_answer_repository
from src.api.admin.dashboard.constants import UsqtyType, CRUDType
from src.api.admin.dashboard.repository import usage_repository
from src.api.admin.dashboard.schemas import CreateUsageQuantitySchema
from src.api.chatbot.association import ChatbotVectorDB, CreateAssociationSchema
from src.api.chatbot.exception import ChatNotFoundException, ChatbotException
from src.api.chatbot.models import Chatbot
from src.api.chatbot.repository import chatbot_repository, association_repository
from src.api.chatbot.request import RateRequest, QuestionRequest
from src.api.chatbot.response import ChatbotResponse
from src.api.chatbot.schemas import UpdateChatbotSchema, CreateChatbotSchema
from src.api.chatbot.utils import ChatModule
from src.api.report.exception import ReportDuplicateValueException
from src.api.report.models import Report
from src.api.report.repository import report_repository
from src.api.report.request import ReportRequest
from src.api.report.schemas import CreateReportSchema
from src.api.vectordb.models import VectorDB
from src.api.vectordb.repository import vector_db_repository
from src.core import prompts
from src.core.database import transactional
from src.core.ncp_client import ncp_client

tasks: Dict[str, asyncio.Task] = {}


@transactional
async def return_base_answer(db: AsyncSession) -> str:
    base_answer = await admin_answer_repository.get_by_id(db, id=1)
    if base_answer:
        return base_answer.answer_content
    else:
        return prompts.base_answer


@transactional
async def get_all(
        db: AsyncSession,
        request: Request,
        last_id: Optional[int]
) -> List[ChatbotResponse]:
    filters = [Chatbot.user_id == request.session.get("current_user")]
    if last_id != 0:
        filters.append(Chatbot.id < last_id)

    chatbot_list = await chatbot_repository.get_id_list(db, filters=filters)
    chatbot_id_list = [chatbot["Chatbot"].id for chatbot in chatbot_list]
    datas = await chatbot_repository.get_with_joins_by_id_list(
        db, filters=filters, chatbot_id_list=chatbot_id_list
    )
    # chatbot id로 묶어서 response로 내보내기
    grouped_by_id = defaultdict(list)
    for data in datas:
        chatbot_id = data["Chatbot"].id
        grouped_by_id[chatbot_id].append(data)
    return [ChatbotResponse.of(value) for key, value in grouped_by_id.items()]


@transactional
async def answer_task(
        db: AsyncSession,
        request: Request,
        request_body: QuestionRequest
) -> ChatbotResponse:
    try:
        current_user_id = request.session.get("current_user")
        sorted_hash_id, association_rows = [], []

        chat_module = ChatModule()
        similarity_dict = chat_module.retrieve_docs(query=request_body.question_content)
        answer_content, token_dict = chat_module.answer(query=request_body.question_content, uid=current_user_id)

        # docs 찾았지만 답변이 이상한 경우 & chroma에 데이터가 없어 doc을 못 찾은 경우
        if (answer_content is None or
                prompts.base_answer in answer_content or
                similarity_dict is None):
            doc_id = None
            answer_content = await return_base_answer(db)

        else:
            # doc id 기준으로 분리 (0번 index는 순수 답변 1~ index는 참고한 문서 hash_id)
            uuid_pattern = r"\b[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}\b"
            hash_list = re.findall(uuid_pattern, answer_content)
            # 실제 답변에 사용된 hash id(key)와 거리(value)가 담긴 dictionary 생성
            filtered_dict = {hash_id: similarity_dict[hash_id] for hash_id in hash_list if hash_id in similarity_dict}
            # 실제 답변에 사용된 문서들을 유사도 높은 순 대로 정렬
            sorted_hash_id = sorted(filtered_dict, key=filtered_dict.get, reverse=True)

            # 가장 유사도가 높은 것 1개만 chatbot 테이블에 저장
            max_hash_id = sorted_hash_id[0] if sorted_hash_id else None
            vector = await vector_db_repository.get_by_hash_id(db, hash_id=max_hash_id)
            doc_id = vector.id if max_hash_id else None

        chatbot = await chatbot_repository.create(
            db, obj_in=CreateChatbotSchema.of(
                request_body,
                current_user_id,
                doc_id,
                answer_content
            )
        )
        await usage_repository.create(
            db, obj_in=CreateUsageQuantitySchema.of_chatbot(
                token_dict,
                chatbot,
                UsqtyType.USER.value,
                CRUDType.INSERT.value,
                current_user_id
            )
        )

        if sorted_hash_id:
            vector_id_list = await vector_db_repository.get_by_hash_id_list(db, hash_id_list=sorted_hash_id)
            for vector_id in vector_id_list:
                association_rows.append(
                    CreateAssociationSchema.of(
                        chatbot.id,
                        vector_id
                    )
                )
            await association_repository.bulk_create(db, objs_in=association_rows)

        join_models = [(Report, Chatbot.id == Report.chatbot_id)]
        if doc_id is not None:
            join_models.append((ChatbotVectorDB, Chatbot.id == ChatbotVectorDB.chatbot_id))
            join_models.append((VectorDB, ChatbotVectorDB.vectordb_id == VectorDB.id))

        filters = [Chatbot.id == chatbot.id]
        data = await chatbot_repository.get_with_joins(
            db, join_models=join_models, filters=filters
        )
        return ChatbotResponse.of(data)

    except asyncio.CancelledError:
        raise


@transactional
async def answer(
        db: AsyncSession,
        request: Request,
        background_tasks: BackgroundTasks,
        request_body: QuestionRequest
):
    current_user_id = request.session.get("current_user")
    task = asyncio.create_task(answer_task(db, request, request_body))
    tasks[current_user_id] = task
    background_tasks.add_task(remove_task, current_user_id)

    try:
        return await task
    except asyncio.CancelledError:
        raise ChatbotException("Request was canceled")


async def cancel(
        db: AsyncSession,
        request: Request
):
    current_user_id = request.session.get("current_user")
    task = tasks.get(current_user_id)
    if task:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            return {"status": "canceled"}
    raise ChatbotException("Request not found")


async def remove_task(current_user_id: int):
    await tasks.pop(current_user_id, None)


@transactional
async def get_image(
        db: AsyncSession,
        request: Request,
        doc_id: str
):
    vectordb = await vector_db_repository.get_by_hash_id(db, hash_id=doc_id)
    return ncp_client.generate_presigned_get_url(vectordb.image_path)


@transactional
async def rate(
        db: AsyncSession,
        request: Request,
        request_body: RateRequest
) -> None:
    current_user_id = request.session.get("current_user")

    chatbot = await chatbot_repository.get_by_id(db, id=request_body.id)
    if chatbot is None:
        raise ChatNotFoundException()

    await chatbot_repository.update(db, db_obj=chatbot, obj_in=UpdateChatbotSchema.of(request_body.dgstfn, chatbot.vectordb_id, current_user_id))


@transactional
async def report(
        db: AsyncSession,
        request: Request,
        request_body: ReportRequest
) -> None:
    current_user_id = request.session.get("current_user")

    if await chatbot_repository.get_by_id(db, id=request_body.id) is None:
        raise ChatNotFoundException()

    if await report_repository.get_by_chatbot_id(db, chatbot_id=request_body.id):
        raise ReportDuplicateValueException()

    await report_repository.create(db, obj_in=CreateReportSchema.of(request_body, current_user_id))
