from datetime import datetime
from unittest.mock import Mock, AsyncMock

from fastapi import Request

import pytest
import pytz

from factory.fuzzy import FuzzyInteger, FuzzyText
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.constants import Permission
from src.api.admin.user.models import BOUser
from src.api.admin.user.repository import AdminUserRepository
from src.api.auth.utils import get_password_hash
from src.api.user.models import User
from src.api.user.repository import UserRepository
from test_utils import generate_phone_number

DATE = datetime(2024, 1, 1, tzinfo=pytz.UTC)


@pytest.fixture
def mock_db() -> AsyncSession:
    return AsyncMock(spec=AsyncSession)


@pytest.fixture
def mock_request() -> Request:
    mock_request = AsyncMock(spec=Request)
    return mock_request


# cookie 인증 미들웨어 모킹
@pytest.fixture
def mock_admin_auth(mocker, request):
    async def mock_dispatch(request, call_next):
        return await call_next(request)

    return mocker.patch("src.api.auth.infrastructure.AuthorizationMiddleware.dispatch",
                        side_effect=mock_dispatch)


@pytest.fixture
def user_fixture():
    user_id = FuzzyInteger(0, 100).fuzz()
    return User(
        id=user_id,
        hospital_code="",
        login_id=f"test_user{user_id}@gmail.com",
        password=get_password_hash("test1234!"),
        name=FuzzyText(length=50).fuzz(),
        hospital_name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        login_token=FuzzyText(length=500).fuzz(),
        creation_id=user_id,
        update_id=user_id,
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def user_repository():
    repository = Mock(spec=UserRepository)
    repository.update = AsyncMock(return_value=None)
    return repository


@pytest.fixture
def bo_user_fixture():
    admin_id = FuzzyInteger(0, 100).fuzz()

    return BOUser(
        id=admin_id,
        login_id=f"test_admin{admin_id}@gmail.com",
        password=get_password_hash("test1234!"),
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        auth_menu_list=str(FuzzyInteger(1, 4).fuzz()),
        login_token=FuzzyText(length=500).fuzz(),
        creation_id=admin_id,
        update_id=admin_id,
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def super_admin_fixture():
    admin_id = FuzzyInteger(0, 100).fuzz()

    return BOUser(
        id=admin_id,
        login_id=f"test_admin{admin_id}@gmail.com",
        password=get_password_hash("test1234!"),
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        auth_menu_list=str(Permission.SUPER_ADMIN.value),
        login_token=FuzzyText(length=500).fuzz(),
        creation_id=admin_id,
        update_id=admin_id,
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def manual_admin_fixture():
    admin_id = FuzzyInteger(0, 100).fuzz()

    return BOUser(
        id=admin_id,
        login_id=f"test_admin{admin_id}@gmail.com",
        password=get_password_hash("test1234!"),
        name=FuzzyText(length=50).fuzz(),

        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        auth_menu_list=str(Permission.MANUAL.value),
        login_token=FuzzyText(length=500).fuzz(),
        creation_id=admin_id,
        update_id=admin_id,
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def answer_admin_fixture():
    admin_id = FuzzyInteger(0, 100).fuzz()

    return BOUser(
        id=admin_id,
        login_id=f"test_admin{admin_id}@gmail.com",
        password=get_password_hash("test1234!"),
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        auth_menu_list=str(Permission.ANSWER.value),
        login_token=FuzzyText(length=500).fuzz(),
        creation_id=admin_id,
        update_id=admin_id,
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def dashboard_admin_fixture():
    admin_id = FuzzyInteger(0, 100).fuzz()

    return BOUser(
        id=admin_id,
        login_id=f"test_admin{admin_id}@gmail.com",
        password=get_password_hash("test1234!"),
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        auth_menu_list=str(Permission.TokenDashboard.value),
        login_token=FuzzyText(length=500).fuzz(),
        creation_id=admin_id,
        update_id=admin_id,
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def admin_user_repository():
    repository = Mock(spec=AdminUserRepository)
    repository.update = AsyncMock(return_value=None)
    return repository


# paging 관련 utils 함수 mocking
@pytest.fixture
def mock_utils_get_page_count(mocker):
    return mocker.patch("src.core.utils.get_page_count", return_value=1)


@pytest.fixture
def mock_utils_get_page_offset(mocker):
    return mocker.patch("src.core.utils.get_page_offset", return_value=0)