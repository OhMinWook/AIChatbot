import io
import json
import os
from datetime import datetime
from decimal import Decimal
from typing import List
from unittest.mock import patch, AsyncMock, MagicMock, Mock

import pytest
from PIL import Image
from factory.fuzzy import FuzzyInteger, FuzzyText
from fastapi import UploadFile, Request, File
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.dashboard.constants import UsqtyType, CRUDType
from src.api.admin.dashboard.models import UsageQuantity
from src.api.admin.dashboard.schemas import CreateUsageQuantitySchema
from src.api.admin.manual.request import ManualSearchParam, CreatePreprocessRequest, \
    UpdateManualRequest, AddDataRequest
from src.api.admin.manual.response import ManualDetailResponse, PreprocessDetailResponse, ManualInfoResponse, \
    ManualUrlResponse, ManualImageResponse
from src.api.admin.user.models import BOUser
from src.api.chatbot.models import Chatbot
from src.api.chatbot.schemas import UpdateChatbotSchema
from src.api.preprocessing.constants import TokenPrice
from src.api.preprocessing.models import Preprocessing
from src.api.preprocessing.schemas import CreatePreprocessingSchema
from src.api.preprocessing.utils import manual_pattern_changer
from src.api.vectordb.models import VectorDB
from src.api.vectordb.schemas import CreateVectorDBSchema, UpdateVectorDBSchema
from src.core import utils
from src.core.config import config
from src.core.constants import OrderBy
from test_utils import diff_check


@pytest.mark.asyncio
async def test_get_all(
        super_admin_fixture: BOUser,
        manual_search_param: ManualSearchParam,
        vector_db_fixture: VectorDB,
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import get_all

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture
    presigned_url = "upload/test_manual/test_manual.pdf"

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        response = [
            vector_db_fixture,
            vector_db_fixture,
            vector_db_fixture
        ]
        with patch("src.api.admin.manual.service.vector_db_repository.get_all_manuals",
                   return_value=response) as mock_get_all_manuals, \
                patch("src.api.admin.manual.response.ncp_client.generate_presigned_get_url",
                      return_value=presigned_url):
            result = await get_all(mock_db, mock_request, manual_search_param)
            mock_get_all_manuals.assert_called_once_with(
                mock_db,
                pageable=manual_search_param
            )
            for actual, expected in zip(result, response):
                diff_check(actual, expected)


@pytest.mark.asyncio
async def test_get_one_manual(
        super_admin_fixture: BOUser,
        vector_db_fixture: VectorDB,
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import get_one_manual

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture
    manual_id = FuzzyInteger(1, 100).fuzz()
    manual = vector_db_fixture
    manuals = [
        manual,
        vector_db_fixture,
        vector_db_fixture,
        vector_db_fixture
    ]
    response = ManualDetailResponse.of(manuals)

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin), \
            patch("src.api.admin.manual.service.vector_db_repository.get_by_id", return_value=manual), \
            patch("src.api.admin.manual.service.vector_db_repository.get_one_manual",
                  return_value=manuals) as mock_get_one_manual:
        result = await get_one_manual(mock_db, mock_request, manual_id)
        mock_get_one_manual.assert_called_once_with(
            mock_db,
            manual_name=manual.manual_name
        )
        for actual, expected in zip(result, response):
            diff_check(actual, expected)


@pytest.mark.asyncio
async def test_get_one_preprocess(
        super_admin_fixture: BOUser,
        preprocessing_fixture: Preprocessing,
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import get_one_preprocess

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture
    preprocess = preprocessing_fixture
    preprocesses = [
        preprocess,
        preprocessing_fixture,
        preprocessing_fixture,
        preprocessing_fixture
    ]
    response = PreprocessDetailResponse.of(preprocesses)

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        with patch("src.api.admin.manual.service.preprocessing_repository.get_one_manual_by_set_id",
                   return_value=preprocesses) as mock_get_one_preprocess:
            result = await get_one_preprocess(mock_db, mock_request, preprocess.set_id)
            mock_get_one_preprocess.assert_called_once_with(
                mock_db,
                set_id=preprocess.set_id
            )
            for actual, expected in zip(result, response):
                diff_check(actual, expected)


@pytest.mark.asyncio
async def test_create_preprocessing(
        super_admin_fixture: BOUser,
        preprocess_schemas: List[Preprocessing],
        preprocess_pattern,
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import create_preprocessing

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture

    file_like = io.BytesIO()
    manual_file: UploadFile = UploadFile(file=file_like, filename='test_manual.pdf')

    mock_image = MagicMock(spec=Image.Image)
    mock_image.size = (100, 100)
    mock_image.mode = "RGB"

    manual_name = "test_manual.pdf"
    image_path = "http://test.com/png"
    preprocess_schema, token_schema = preprocess_schemas, []
    preprocess_content = {
        "source": "source",
        "subject": "subject",
        "content": "content",
        "images": mock_image,
        "pattern": "pattern1"
    }
    token_content = {
        'prompt_tokens': 100,
        'completion_tokens': 50
    }
    preprocessed_dict = {3: preprocess_content, 4: preprocess_content, 5: preprocess_content}
    token_dict = {3: token_content, 4: token_content, 5: token_content}

    create_schema = [
        CreatePreprocessingSchema.of(preprocessed_dict[3], 1, image_path, manual_name, current_user_id),
        CreatePreprocessingSchema.of(preprocessed_dict[4], 1, image_path, manual_name, current_user_id),
        CreatePreprocessingSchema.of(preprocessed_dict[5], 1, image_path, manual_name, current_user_id)
    ]

    for preprocess in preprocess_schema:
        token_schema.append(
            CreateUsageQuantitySchema.of_preprocessing(
                token_content,
                preprocess,
                UsqtyType.PREPROCESSING.value,
                CRUDType.INSERT.value,
                current_user_id
            )
        )

    with patch("src.api.admin.manual.service.vector_db_repository.is_exist_by_manual_name", return_value=False), \
            patch("src.api.admin.manual.service.DataPreprocess.extract", return_value=None), \
            patch("src.api.admin.manual.service.DataPreprocess.preprocess_txt",
                  return_value=(preprocessed_dict, token_dict)), \
            patch("src.api.admin.manual.service.preprocessing_repository.get_last_set_id",
                  return_value=None), \
            patch("src.api.admin.manual.service.ncp_client.path_maker", return_value=image_path), \
            patch("src.api.admin.manual.service.ncp_client.upload_file"), \
            patch("src.api.admin.manual.service.preprocessing_repository.bulk_create",
                  new_callable=AsyncMock) as mock_bulk_create_preprocess, \
            patch("src.api.admin.manual.service.usage_repository.bulk_create",
                  new_callable=AsyncMock) as mock_bulk_create_usage, \
            patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):

        mock_bulk_create_preprocess.return_value = preprocess_schema
        result = await create_preprocessing(mock_db, mock_request, preprocess_pattern, manual_file)

        assert result == preprocess_schema[0].set_id

        mock_bulk_create_preprocess.assert_called_once()
        mock_bulk_create_usage.assert_called_once()
        actual_preprocess_call = mock_bulk_create_preprocess.call_args[1]["objs_in"]
        actual_usage_call = mock_bulk_create_usage.call_args[1]["objs_in"]

        for actual_preprocess, expected_preprocess in zip(actual_preprocess_call, create_schema):
            diff_check(actual_preprocess, expected_preprocess)

        for actual_token, expected_token in zip(actual_usage_call, token_schema):
            diff_check(actual_token, expected_token)


@pytest.mark.asyncio
async def test_create_collection(
        super_admin_fixture: BOUser,
        preprocess_schemas: List[Preprocessing],
        vector_db_schemas: List[VectorDB],
        usage_quantity_schemas: List[UsageQuantity],
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import create_collection

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture
    set_id: int = 1
    manual_path = "upload/test_manual/test_manual.pdf"

    expected_token_dict = {
        "11111111-1111-1111-11111111": 10,
        "22222222-2222-2222-22222222": 20,
        "33333333-3333-3333-33333333": 30
    }

    with patch("src.api.admin.manual.service.preprocessing_repository.get_one_manual_by_set_id",
               return_value=preprocess_schemas), \
            patch("src.api.admin.manual.service.ncp_client.path_maker") as mock_path_maker, \
            patch("src.api.admin.manual.service.vector_db_repository.is_exist_by_manual_name", return_value=None), \
            patch("src.api.admin.manual.service.vector_db_repository.get_last_id", return_value=None), \
            patch("src.api.admin.manual.service.uuid.uuid4") as mock_uuid4, \
            patch("src.api.admin.manual.service.vector_db_repository.bulk_create",
                  new_callable=AsyncMock) as mock_bulk_create_vector, \
            patch("src.api.admin.manual.service.vectordb.make_document", return_value=None), \
            patch("src.api.admin.manual.service.vectordb.embedding", return_value=expected_token_dict), \
            patch("src.api.admin.manual.service.usage_repository.bulk_create",
                  new_callable=AsyncMock) as mock_bulk_create_usage, \
            patch("src.api.admin.manual.service.ncp_client.move_file_path"), \
            patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):

        mock_path_maker.side_effect = [
            manual_path,
            "upload/test_manual/1.png",
            "upload/test_manual/2.png",
            "upload/test_manual/3.png"
        ]
        mock_uuid4.side_effect = [
            "11111111-1111-1111-11111111",
            "22222222-2222-2222-22222222",
            "33333333-3333-3333-33333333"
        ]
        mock_bulk_create_vector.return_value = vector_db_schemas
        await create_collection(mock_db, mock_request, set_id, None, None, [])

        mock_bulk_create_vector.assert_called_once()
        mock_bulk_create_usage.assert_called_once()

        actual_vector_call = mock_bulk_create_vector.call_args[1]["objs_in"]
        actual_usage_call = mock_bulk_create_usage.call_args[1]["objs_in"]

        assert len(actual_vector_call) == len(vector_db_schemas) == len(actual_usage_call)

        for actual_vector, expected_vector in zip(actual_vector_call, vector_db_schemas):
            diff_check(actual_vector, expected_vector)

        for actual_usage, expected_usage in zip(actual_usage_call, usage_quantity_schemas):
            diff_check(actual_usage, expected_usage)


@pytest.mark.asyncio
async def test_update_manual(
        super_admin_fixture: BOUser,
        vector_db_schemas: List[VectorDB],
        updated_pages,
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import update_manual

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture
    manual = vector_db_schemas[0]
    expected_token_dict = {
        "11111111-1111-1111-11111111": 10,
        "22222222-2222-2222-22222222": 20
    }

    with patch("src.api.admin.manual.service.vector_db_repository.get_by_id",
               new_callable=AsyncMock, return_value=manual) as mock_get_by_id, \
            patch("src.api.admin.manual.service.vector_db_repository.get_one_manual", return_value=vector_db_schemas), \
            patch("src.api.admin.manual.service.vector_db_repository.get_last_id", return_value=None), \
            patch("src.api.admin.manual.service.VectorDBEmbeddings.make_document"), \
            patch("src.api.admin.manual.service.VectorDBEmbeddings.upsert_collection", return_value=expected_token_dict), \
            patch("src.api.admin.manual.service.usage_repository.bulk_create", return_value=None), \
            patch("src.api.admin.manual.service.vector_db_repository.bulk_update",
                  new_callable=AsyncMock) as mock_update_manual, \
            patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        await update_manual(mock_db, mock_request, manual.id, updated_pages, None, [])
        mock_get_by_id.assert_called_once()
        mock_update_manual.assert_called_once()
        actual_update_call = mock_update_manual.call_args[1]["db_objs"]
        for actual_vector, expected_vector in zip(actual_update_call, vector_db_schemas):
            diff_check(actual_vector, expected_vector)


@pytest.mark.asyncio
async def test_delete_manual(
        super_admin_fixture: BOUser,
        vector_db_schemas: List[VectorDB],
        chatbot_fixture: Chatbot,
        mock_request: Request,
        mock_db: AsyncSession,
        mock_chromadb_client
):
    from src.api.admin.manual.service import delete_manual

    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    current_admin = super_admin_fixture
    manuals, chatbots, id_list_int = vector_db_schemas, [chatbot_fixture], [1, 2, 3]

    id_list = ','.join(map(str, id_list_int))
    hash_id_list = [
            "11111111-1111-1111-11111111",
            "22222222-2222-2222-22222222",
            "33333333-3333-3333-33333333"
        ]

    with patch("src.api.admin.manual.service.vector_db_repository.get_by_id_list",
               new_callable=AsyncMock, return_value=manuals) as mock_get_by_id_list, \
            patch("src.api.admin.manual.service.chatbot_repository.get_by_vector_id_list",
                  return_value=chatbots) as mock_get_by_vector_id_list, \
            patch("src.api.admin.manual.service.ncp_client.delete_file"), \
            patch("src.api.admin.manual.service.vectordb.delete_from_collection") as mock_delete_collection, \
            patch("src.api.admin.manual.service.vector_db_repository.bulk_update",
                  new_callable=AsyncMock, return_value=None) as mock_manual_bulk_update, \
            patch("src.api.admin.manual.service.vector_db_repository.get_one_manual",
                  new_callable=AsyncMock, return_value=[vector_db_schemas]) as mock_get_one_manuals, \
            patch("src.api.admin.manual.service.chatbot_repository.bulk_update",
                  new_callable=AsyncMock, return_value=None) as mock_chatbot_bulk_update, \
            patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        fixed_datetime = datetime(2024, 9, 4, 13, 39, 19)
        with patch("src.core.utils.datetime") as mock_datetime:
            mock_datetime.now.return_value = fixed_datetime
            await delete_manual(mock_db, mock_request, id_list)

            mock_get_by_id_list.assert_called_once_with(mock_db, id_list=id_list_int)
            mock_get_by_vector_id_list.assert_called_once_with(mock_db, id_list=id_list_int)
            mock_delete_collection.assert_called_once_with(hash_id_list)

            mock_get_one_manuals.assert_called_once_with(
                mock_db,
                manual_name=manuals[0].manual_name
            )


            mock_manual_bulk_update.call_args[1]["db_objs"] = manuals
            mock_chatbot_bulk_update.call_args[1]["db_objs"] = chatbots
