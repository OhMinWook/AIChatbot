from datetime import datetime
from unittest.mock import patch, AsyncMock

import pytest
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.user.models import BOUser
from src.api.admin.user.repository import AdminUserRepository
from src.api.admin.user.schemas import UpdateBOUserTokenSchema
from src.api.auth.request import SignInRequest
from src.api.admin.auth.service import sign_in, sign_out
from src.api.user.exceptions import UserNotFoundException, AuthenticationFailedException
from src.core.config import config


@pytest.mark.asyncio
async def test_sign_in_success(
        bo_user_fixture: BOUser,
        admin_user_repository: AdminUserRepository,
        success_request: SignInRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    with patch("src.api.admin.auth.service.authenticate_user", new_callable=AsyncMock) as mock_authenticate_user:
        mock_authenticate_user.return_value = bo_user_fixture

        with patch("src.api.admin.auth.service.create_session_id", return_value="test_session_id"):
            with patch("src.api.admin.auth.service.admin_user_repository.update",
                       new_callable=AsyncMock) as mock_update:
                fixed_datetime = datetime(2024, 9, 4, 13, 39, 19)
                with patch("src.core.utils.datetime") as mock_datetime:
                    mock_datetime.now.return_value = fixed_datetime
                    mock_update.return_value = bo_user_fixture
                    mock_request.session = {}

                    await sign_in(mock_request, success_request, mock_db)

                    assert mock_request.session.get(config.ADMIN_COOKIE_NAME) == "test_session_id"
                    assert "last_activity" in mock_request.session
                    assert "current_user" in mock_request.session

                    user_update_instance = UpdateBOUserTokenSchema.of(bo_user_fixture, "test_session_id")
                    mock_update.assert_called_once_with(mock_db, db_obj=bo_user_fixture,
                                                        obj_in=user_update_instance)


@pytest.mark.asyncio
async def test_sign_in_id_failed(
        id_failed_request: SignInRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    with patch("src.api.admin.auth.service.authenticate_user", side_effect=UserNotFoundException("Wrong id")):
        with patch("src.api.admin.auth.service.create_session_id", return_value="test_session_id"):
            mock_request.session = {}

            # 예외를 예상하고 sign_in 호출
            with pytest.raises(UserNotFoundException) as exc_info:
                await sign_in(mock_request, id_failed_request, mock_db)

            assert str(exc_info.value) == "Wrong id"


@pytest.mark.asyncio
async def test_sign_in_password_failed(
        password_failed_request: SignInRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    with patch("src.api.admin.auth.service.authenticate_user",
               side_effect=AuthenticationFailedException("Wrong password")):
        with patch("src.api.admin.auth.service.create_session_id", return_value="test_session_id"):
            mock_request.session = {}

            # 예외를 예상하고 sign_in 호출
            with pytest.raises(AuthenticationFailedException) as exc_info:
                await sign_in(mock_request, password_failed_request, mock_db)

            assert str(exc_info.value) == "Wrong password"


@pytest.mark.asyncio
async def test_sign_out(mock_request: Request):
    mock_request.session = {}
    await sign_out(mock_request)

    assert mock_request.session.get(config.ADMIN_COOKIE_NAME) is None
