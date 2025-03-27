from datetime import datetime
from unittest.mock import patch, AsyncMock

import pytest
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth.request import SignInRequest
from src.api.auth.service import sign_in, sign_out
from src.api.user.exceptions import UserNotFoundException, AuthenticationFailedException
from src.api.user.models import User
from src.api.user.repository import UserRepository
from src.api.user.schemas import UpdateUserTokenSchema
from src.core.config import config


@pytest.mark.asyncio
async def test_sign_in_success(
        user_fixture: User,
        user_repository: UserRepository,
        success_request: SignInRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    with patch("src.api.auth.service.authenticate_user", new_callable=AsyncMock) as mock_authenticate_user:
        mock_authenticate_user.return_value = user_fixture

        with patch("src.api.auth.service.create_session_id", return_value="test_session_id"):
            with patch("src.api.auth.service.user_repository.update", new_callable=AsyncMock) as mock_update:
                fixed_datetime = datetime(2024, 9, 4, 13, 39, 19)
                with patch("src.core.utils.datetime") as mock_datetime:
                    mock_update.return_value = user_fixture
                    mock_datetime.now.return_value = fixed_datetime
                    mock_request.session = {}

                    await sign_in(mock_request, success_request, mock_db)

                    assert mock_request.session.get(config.COOKIE_NAME) == "test_session_id"
                    assert "last_activity" in mock_request.session
                    assert "current_user" in mock_request.session

                    user_update_instance = UpdateUserTokenSchema.of_token(user_fixture, "test_session_id")
                    mock_update.assert_called_once_with(mock_db, db_obj=user_fixture,
                                                        obj_in=user_update_instance)


@pytest.mark.asyncio
async def test_sign_in_id_failed(
        id_failed_request: SignInRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    with patch("src.api.auth.service.authenticate_user", side_effect=UserNotFoundException("Wrong id")):
        with patch("src.api.auth.service.create_session_id", return_value="test_session_id"):
            mock_request.session = {}

            with pytest.raises(UserNotFoundException) as exc_info:
                await sign_in(mock_request, id_failed_request, mock_db)

            assert str(exc_info.value) == "Wrong id"


@pytest.mark.asyncio
async def test_sign_in_password_failed(
        password_failed_request: SignInRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    with patch("src.api.auth.service.authenticate_user", side_effect=AuthenticationFailedException("Wrong password")):
        with patch("src.api.auth.service.create_session_id", return_value="test_session_id"):
            mock_request.session = {}

            with pytest.raises(AuthenticationFailedException) as exc_info:
                await sign_in(mock_request, password_failed_request, mock_db)

            assert str(exc_info.value) == "Wrong password"


@pytest.mark.asyncio
async def test_sign_out(mock_request: Request):
    mock_request.session = {}
    await sign_out(mock_request)

    assert mock_request.session.get(config.COOKIE_NAME) is None
