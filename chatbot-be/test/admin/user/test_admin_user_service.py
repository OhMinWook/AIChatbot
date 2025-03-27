from unittest.mock import patch, AsyncMock

import pytest
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.exception import PermissionDeniedException
from src.api.admin.user.exception import AdminException, AdminNotFoundException
from src.api.admin.user.models import BOUser
from src.api.admin.user.repository import AdminUserRepository
from src.api.admin.user.request import CreateAdminRequest, UpdateAdminRequest
from src.api.admin.user.schemas import CreateBOUserSchema, UpdateBOUserSchema
from src.api.admin.user.service import get_all_admin, get_admin_detail, create_admin, update_admin, delete_admin
from src.core.constants import OrderBy
from src.core.pagination import Pageable
from test_utils import diff_check


@pytest.mark.asyncio
async def test_get_all_success(
        bo_user_fixture: BOUser,
        super_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        pageable: Pageable,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = super_admin_fixture
    with patch("src.api.admin.user.service.admin_user_repository.get_by_id",
               return_value=current_admin):
        admin_list = [
            bo_user_fixture,
            bo_user_fixture,
            bo_user_fixture
        ]

        with patch("src.api.admin.user.service.admin_user_repository.get_all",
                   return_value=admin_list) as mock_get_all:
            result = await get_all_admin(mock_db, mock_request, pageable)
            mock_get_all.assert_called_once_with(
                mock_db,
                pageable=pageable,
                order_by=OrderBy.ASC.value
            )
            assert len(result) == len(admin_list)
            for actual, expected in zip(result, admin_list):
                diff_check(actual, expected)


@pytest.mark.asyncio
async def test_get_all_failed_permission(
        bo_user_fixture: BOUser,
        manual_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        pageable: Pageable,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    admin = bo_user_fixture
    current_admin = manual_admin_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, admin]):
        with pytest.raises(PermissionDeniedException):
            await get_all_admin(mock_db, mock_request)


@pytest.mark.asyncio
async def test_get_one_success(
        bo_user_fixture: BOUser,
        super_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = super_admin_fixture
    admin = bo_user_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id",
               side_effect=[current_admin, admin]) as mock_get_by_id:
        actual = await get_admin_detail(mock_db, mock_request, admin.id)
        mock_get_by_id.assert_any_call(mock_db, id=current_user_id)
        mock_get_by_id.assert_any_call(mock_db, id=admin.id)

        diff_check(actual, admin)


@pytest.mark.asyncio
async def test_get_one_failed_permission(
        bo_user_fixture: BOUser,
        manual_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = manual_admin_fixture
    admin = bo_user_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, admin]):
        with pytest.raises(PermissionDeniedException):
            await get_all_admin(mock_db, mock_request)


@pytest.mark.asyncio
async def test_create_admin_success(
        super_admin_fixture: BOUser,
        create_admin_request: CreateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    expected_obj_in = CreateBOUserSchema.of(create_admin_request, current_user_id)
    current_admin = super_admin_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin), \
            patch("src.api.admin.user.service.admin_user_repository.get_by_login_id", return_value=None), \
            patch("src.api.admin.user.service.admin_user_repository.create", new_callable=AsyncMock) as mock_create:
        await create_admin(mock_db, mock_request, create_admin_request)

        mock_create.assert_called_once()
        actual_call = mock_create.call_args[1]['obj_in']
        diff_check(actual_call, expected_obj_in)


@pytest.mark.asyncio
async def test_create_admin_failed_duplicate(
        bo_user_fixture: BOUser,
        super_admin_fixture: BOUser,
        create_admin_request: CreateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    admin = bo_user_fixture
    current_admin = super_admin_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin), \
            patch("src.api.admin.user.service.admin_user_repository.get_by_login_id", return_value=admin):
        with pytest.raises(AdminException) as exc_info:
            await create_admin(mock_db, mock_request, create_admin_request)

        assert str(exc_info.value) == "User already exists"


@pytest.mark.asyncio
async def test_create_admin_failed_password(
        super_admin_fixture: BOUser,
        create_admin_password_error_request: CreateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = super_admin_fixture
    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin), \
            patch("src.api.admin.user.service.admin_user_repository.get_by_login_id", return_value=None):
        with pytest.raises(AdminException) as exc_info:
            await create_admin(mock_db, mock_request, create_admin_password_error_request)

        assert str(exc_info.value) == "Password mismatch"


@pytest.mark.asyncio
async def test_create_admin_failed_permission(
        bo_user_fixture: BOUser,
        manual_admin_fixture: BOUser,
        create_admin_request: CreateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = manual_admin_fixture
    admin = bo_user_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, admin]):
        with pytest.raises(PermissionDeniedException):
            await create_admin(mock_db, mock_request, create_admin_request)


@pytest.mark.asyncio
async def test_update_admin_success(
        bo_user_fixture: BOUser,
        super_admin_fixture: BOUser,
        update_admin_request: UpdateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    admin = bo_user_fixture
    current_admin = super_admin_fixture
    expected_obj_in = UpdateBOUserSchema.of(update_admin_request.model_dump(), current_user_id)

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, admin]):
        with patch("src.api.admin.user.service.admin_user_repository.update", new_callable=AsyncMock) as mock_update:
            await update_admin(mock_db, mock_request, update_admin_request)
            mock_update.assert_called_once()
            actual_db_obj = mock_update.call_args[1]['db_obj']
            actual_obj_in = mock_update.call_args[1]['obj_in']

            assert actual_db_obj == bo_user_fixture

            diff_check(actual_obj_in, expected_obj_in)


@pytest.mark.asyncio
async def test_update_admin_failed_not_found(
        super_admin_fixture: BOUser,
        update_admin_request: UpdateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = super_admin_fixture
    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, None]):
        with pytest.raises(AdminNotFoundException):
            await update_admin(mock_db, mock_request, update_admin_request)


@pytest.mark.asyncio
async def test_update_admin_failed_password(
        bo_user_fixture: BOUser,
        super_admin_fixture: BOUser,
        update_admin_password_error_request: UpdateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    admin = bo_user_fixture
    current_admin = super_admin_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, admin]):
        with pytest.raises(AdminException) as exc_info:
            await update_admin(mock_db, mock_request, update_admin_password_error_request)
            assert str(exc_info.value) == "Password mismatch"


@pytest.mark.asyncio
async def test_update_admin_failed_permission(
        bo_user_fixture: BOUser,
        manual_admin_fixture: BOUser,
        update_admin_request: UpdateAdminRequest,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = manual_admin_fixture
    admin = bo_user_fixture

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", side_effect=[current_admin, admin]):
        with pytest.raises(PermissionDeniedException):
            await update_admin(mock_db, mock_request, update_admin_request)


@pytest.mark.asyncio
async def test_delete_admin_success(
        super_admin_fixture: BOUser,
        manual_admin_fixture: BOUser,
        answer_admin_fixture: BOUser,
        dashboard_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = super_admin_fixture
    admins = [super_admin_fixture, manual_admin_fixture, answer_admin_fixture, dashboard_admin_fixture]
    id_list = "1, 2, 3, 4, 5"

    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        with patch("src.api.admin.user.service.admin_user_repository.get_by_id_list",
                   return_value=admins) as mock_get_by_id_list:
            with patch("src.api.admin.user.service.admin_user_repository.bulk_delete",
                       new_callable=AsyncMock) as mock_delete:
                await delete_admin(mock_db, mock_request, id_list)
                mock_get_by_id_list.assert_called_once_with(
                    mock_db,
                    id_list=list(map(int, id_list.split(',')))
                )
                mock_delete.assert_called_once_with(
                    mock_db,
                    id_list=[admin.id for admin in admins]
                )


@pytest.mark.asyncio
async def test_delete_admin_failed_id_format(
        super_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = super_admin_fixture
    id_list = "1, 2, 3, a, 5"
    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        with pytest.raises(AdminException) as exc_info:
            await delete_admin(mock_db, mock_request, id_list)
            assert str(exc_info.value) == "id list's element is not number"


@pytest.mark.asyncio
async def test_delete_admin_failed_id_format(
        manual_admin_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}

    current_admin = manual_admin_fixture
    id_list = "1, 2, 3, 4, 5"
    with patch("src.api.admin.user.service.admin_user_repository.get_by_id", return_value=current_admin):
        with pytest.raises(PermissionDeniedException):
            await delete_admin(mock_db, mock_request, id_list)
