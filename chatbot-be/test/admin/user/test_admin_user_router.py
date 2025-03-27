import pytest
from factory.fuzzy import FuzzyInteger
from fastapi import Request
from starlette.responses import JSONResponse

from src.api.admin.user.request import CreateAdminRequest, UpdateAdminRequest
from src.api.admin.user.response import AdminResponse, AdminDetailResponse
from src.core.pagination import Pageable
from src.core.response import ApiResponse


@pytest.mark.asyncio
async def test_get_all(
        admin_user_router,
        admin_user_service,
        pageable: Pageable,
        admin_response: AdminResponse
):
    # given
    get_all_router = admin_user_router[0]
    get_all_service = admin_user_service[0]
    get_all_service.return_value = admin_response

    async def mock_get_all_router(db_session, request):
        data = await get_all_service(request)

        return ApiResponse.of(data=data)

    get_all_router.side_effect = mock_get_all_router

    # Act
    result = await get_all_router(db_session=None, request=pageable)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_get_one(
        admin_user_router,
        admin_user_service,
        admin_detail_response: AdminDetailResponse,
        mock_request: Request
):
    # given
    get_one_router = admin_user_router[1]
    get_one_service = admin_user_service[1]

    admin_id = FuzzyInteger(1, 100).fuzz()
    get_one_service.return_value = admin_detail_response

    async def mock_get_one_router(db_session, request):
        data = await get_one_service(request)

        return ApiResponse.of(data=data)

    get_one_router.side_effect = mock_get_one_router

    # Act
    result = await get_one_router(db_session=None, request=admin_id)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_create_admin(
        admin_user_router,
        admin_user_service,
        create_admin_request: CreateAdminRequest
):
    # given
    create_admin_router = admin_user_router[2]
    create_admin_service = admin_user_service[2]
    create_admin_service.return_value = None

    async def mock_create_admin_router(db_session, request):
        data = await create_admin_service(request)

        return ApiResponse.of(data=data)

    create_admin_router.side_effect = mock_create_admin_router

    # Act
    result = await create_admin_router(db_session=None, request=create_admin_request)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_update_admin(
        admin_user_router,
        admin_user_service,
        update_admin_request: UpdateAdminRequest
):
    # given
    update_admin_router = admin_user_router[3]
    update_admin_service = admin_user_service[3]
    update_admin_service.return_value = None

    async def mock_update_admin_router(db_session, request):
        data = await update_admin_service(request)

        return ApiResponse.of(data=data)

    update_admin_router.side_effect = mock_update_admin_router

    # Act
    result = await update_admin_router(db_session=None, request=update_admin_request)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_delete_admin(
        admin_user_router,
        admin_user_service
):
    # given
    delete_admin_router = admin_user_router[4]
    delete_admin_service = admin_user_service[4]
    delete_admin_service.return_value = None

    id_list = str(FuzzyInteger(1, 100).fuzz())

    async def mock_delete_admin_router(db_session, request):
        data = await delete_admin_service(request)

        return ApiResponse.of(data=data)

    delete_admin_router.side_effect = mock_delete_admin_router

    # Act
    result = await delete_admin_router(db_session=None, request=id_list)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200
