from unittest.mock import AsyncMock, patch

import pytest

from src.api.auth.request import SignInRequest


@pytest.fixture
def auth_router():
    with patch("src.api.auth.router.sign_in", new_callable=AsyncMock) as mock_sign_in, \
            patch("src.api.auth.router.sign_out", new_callable=AsyncMock) as mock_sign_out:
        yield mock_sign_in, mock_sign_out


@pytest.fixture
def auth_service():
    with patch("src.api.auth.service.sign_in", new_callable=AsyncMock) as mock_sign_in, \
         patch("src.api.auth.service.sign_out", new_callable=AsyncMock) as mock_sign_out:
        yield mock_sign_in, mock_sign_out


@pytest.fixture
def success_request():
    return SignInRequest(
        login_id="test_user@gmail.com",
        password="test1234!"
    )


@pytest.fixture
def id_failed_request():
    return SignInRequest(
        login_id="test_user@.com",
        password="test1234!"
    )


@pytest.fixture
def password_failed_request():
    return SignInRequest(
        login_id="test_user@gmail.com",
        password="test1234"
    )
