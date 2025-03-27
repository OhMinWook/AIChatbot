import io
from typing import List

import pytest
from fastapi import UploadFile
from starlette import status
from starlette.responses import JSONResponse

from src.api.admin.manual.request import ManualSearchParam, CreatePreprocessRequest, \
    UpdateManualRequest, AddDataRequest
from src.api.admin.manual.response import ManualResponse, ManualDetailResponse, PreprocessDetailResponse, \
    ManualUrlResponse, ManualInfoResponse
from src.core.response import ApiResponse


@pytest.mark.asyncio
async def test_get_all(
        admin_manual_router,
        admin_manual_service,
        manual_search_param: ManualSearchParam,
        manual_response: ManualResponse,
        mock_db,
        mock_request
):
    get_all_router = admin_manual_router[0]
    get_all_service = admin_manual_service[0]

    get_all_service.return_value = manual_response

    async def mock_get_all_router(db_session, request, manual_search_param):
        data = await get_all_service(request, manual_search_param)
        return ApiResponse.of(data=data)

    get_all_router.side_effect = mock_get_all_router

    result = await get_all_router(mock_db, mock_request, manual_search_param)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_get_one_manual(
        admin_manual_router,
        admin_manual_service,
        manual_detail_response: ManualDetailResponse,
        mock_db,
        mock_request
):
    get_one_manual_router = admin_manual_router[1]
    get_one_manual_service = admin_manual_service[1]

    get_one_manual_service.return_value = manual_detail_response
    manual_id = 1

    async def mock_get_one_manual_router(db_session, request, manual_id):
        data = await get_one_manual_service(request, manual_id)
        return ApiResponse.of(data=data)

    get_one_manual_router.side_effect = mock_get_one_manual_router

    result = await get_one_manual_router(mock_db, mock_request, manual_id)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_get_one_preprocess(
        admin_manual_router,
        admin_manual_service,
        preprocess_detail_response: PreprocessDetailResponse,
        mock_db,
        mock_request
):
    get_one_preprocess_router = admin_manual_router[1]
    get_one_preprocess_service = admin_manual_service[1]

    get_one_preprocess_service.return_value = preprocess_detail_response
    preprocess_id = 1

    async def mock_get_one_preprocess_router(db_session, request, preprocess_id):
        data = await get_one_preprocess_service(request, preprocess_id)
        return ApiResponse.of(data=data)

    get_one_preprocess_router.side_effect = mock_get_one_preprocess_router

    result = await get_one_preprocess_router(mock_db, mock_request, preprocess_id)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_create_preprocessing(
        admin_manual_router,
        admin_manual_service,
        preprocess_pattern,
        mock_db,
        mock_request
):
    create_preprocessing_router = admin_manual_router[2]
    create_preprocessing_service = admin_manual_service[2]

    file_like = io.BytesIO()
    manual_file: UploadFile = UploadFile(file=file_like, filename='test_manual.pdf')
    create_preprocessing_service.return_value = 1

    async def mock_create_preprocessing_router(db_session, request, mock_pattern, mock_file):
        data = await create_preprocessing_service(request, mock_pattern, mock_file)
        return ApiResponse.of(http_status=status.HTTP_201_CREATED, data=data)

    create_preprocessing_router.side_effect = mock_create_preprocessing_router

    result = await create_preprocessing_router(mock_db, mock_request, preprocess_pattern, manual_file)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 201


@pytest.mark.asyncio
async def test_create_collection(
        admin_manual_router,
        admin_manual_service,
        updated_pages,
        added_pages,
        mock_db,
        mock_request
):
    create_collection_router = admin_manual_router[3]
    create_collection_service = admin_manual_service[3]
    set_id: int = 1
    file_like = io.BytesIO()
    image_files: List[UploadFile] = [UploadFile(file=file_like, filename='added_0.png')]

    async def mock_create_collection_router(db_session, request, set_id, updated_pages, added_pages, image_files):
        await create_collection_service(request, set_id, updated_pages, added_pages, image_files)
        return ApiResponse.of(http_status=status.HTTP_201_CREATED)

    create_collection_router.side_effect = mock_create_collection_router

    result = await create_collection_router(mock_db, mock_request, set_id, updated_pages, added_pages, image_files)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 201


@pytest.mark.asyncio
async def test_update_manual(
        admin_manual_router,
        admin_manual_service,
        updated_pages,
        added_pages,
        mock_db,
        mock_request
):
    update_manual_router = admin_manual_router[4]
    update_manual_service = admin_manual_service[4]

    manual_id: int = 1
    file_like = io.BytesIO()
    image_files: List[UploadFile] = [UploadFile(file=file_like, filename='added_0.png')]

    async def mock_update_manual_router(db_session, request, manual_id, updated_pages, added_pages, image_files):
        await update_manual_service(request, manual_id, updated_pages, added_pages, image_files)
        return ApiResponse.of()

    update_manual_router.side_effect = mock_update_manual_router

    result = await update_manual_router(mock_db, mock_request, manual_id, updated_pages, added_pages, image_files)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_delete_manual(
        admin_manual_router,
        admin_manual_service,
        mock_db,
        mock_request
):
    delete_manual_router = admin_manual_router[5]
    delete_manual_service = admin_manual_service[5]

    id_list = "1,2"

    async def mock_delete_manual_router(db_session, request, id_list):
        await delete_manual_service(request, id_list)
        return ApiResponse.of()

    delete_manual_router.side_effect = mock_delete_manual_router

    result = await delete_manual_router(mock_db, mock_request, id_list)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200
