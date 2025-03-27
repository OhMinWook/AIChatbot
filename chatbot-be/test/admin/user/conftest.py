from datetime import datetime
from typing import List
from unittest.mock import AsyncMock, patch

import pytest
import pytz
from factory.fuzzy import FuzzyInteger, FuzzyText
from factory import Sequence

from src.api.admin.user.request import CreateAdminRequest, UpdateAdminRequest
from src.api.admin.user.response import AdminDetailResponse, AdminResponse
from src.api.admin.user.schemas import CreateBOUserSchema
from src.api.auth.utils import get_password_hash
from src.core import utils
from src.core.pagination import Pageable
from test_utils import generate_phone_number

DATE = datetime(2024, 1, 1, tzinfo=pytz.UTC)


@pytest.fixture
def admin_user_router():
    with patch("src.api.admin.user.router.get_all_admin", new_callable=AsyncMock) as mock_get_all, \
            patch("src.api.admin.user.router.get_admin_detail", new_callable=AsyncMock) as mock_get_one, \
            patch("src.api.admin.user.router.create_admin", new_callable=AsyncMock) as mock_create, \
            patch("src.api.admin.user.router.update_admin", new_callable=AsyncMock) as mock_update, \
            patch("src.api.admin.user.router.delete_admin", new_callable=AsyncMock) as mock_delete:
        yield [mock_get_all, mock_get_one, mock_create, mock_update, mock_delete]


@pytest.fixture
def admin_user_service():
    with patch("src.api.admin.user.service.get_all_admin", new_callable=AsyncMock) as mock_get_all, \
            patch("src.api.admin.user.service.get_admin_detail", new_callable=AsyncMock) as mock_get_one, \
            patch("src.api.admin.user.service.create_admin", new_callable=AsyncMock) as mock_create, \
            patch("src.api.admin.user.service.update_admin", new_callable=AsyncMock) as mock_update, \
            patch("src.api.admin.user.service.delete_admin", new_callable=AsyncMock) as mock_delete:
        yield [mock_get_all, mock_get_one, mock_create, mock_update, mock_delete]


@pytest.fixture
def admin_response() -> List[AdminResponse]:
    admin_id = Sequence(lambda n: n + 1)
    return [
        AdminResponse(
            id=FuzzyInteger(1, 100).fuzz(),
            name=FuzzyText(length=50).fuzz(),
            dept_name=FuzzyText(length=50).fuzz(),
            tel_no=generate_phone_number(),
            login_id=f"test_admin{admin_id}@gmail.com",
            auth_menu_list=str(FuzzyInteger(1, 4).fuzz()),
            creation_dt=utils.datetime_to_unix_time(DATE)
        ),
        AdminResponse(
            id=FuzzyInteger(1, 100).fuzz(),
            name=FuzzyText(length=50).fuzz(),
            dept_name=FuzzyText(length=50).fuzz(),
            tel_no=generate_phone_number(),
            login_id=f"test_admin{admin_id}@gmail.com",
            auth_menu_list=str(FuzzyInteger(1, 4).fuzz()),
            creation_dt=utils.datetime_to_unix_time(DATE)
        ),
        AdminResponse(
            id=FuzzyInteger(1, 100).fuzz(),
            name=FuzzyText(length=50).fuzz(),
            dept_name=FuzzyText(length=50).fuzz(),
            tel_no=generate_phone_number(),
            login_id=f"test_admin{admin_id}@gmail.com",
            auth_menu_list=str(FuzzyInteger(1, 4).fuzz()),
            creation_dt=utils.datetime_to_unix_time(DATE)
        )
    ]


@pytest.fixture
def admin_detail_response() -> AdminDetailResponse:
    admin_id = FuzzyInteger(1, 100).fuzz()
    return AdminDetailResponse(
        id=admin_id,
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        login_id=f"test_admin{admin_id}@gmail.com",
        auth_menu_list=str(FuzzyInteger(1, 4).fuzz()),
        creation_dt=utils.datetime_to_unix_time(DATE)
    )


@pytest.fixture
def pageable() -> Pageable:
    return Pageable(
        page_no=FuzzyInteger(1, 100).fuzz(),
        page_size=FuzzyInteger(1, 100).fuzz(),
        start_dt=None,
        end_dt=None
    )


@pytest.fixture
def create_admin_request() -> CreateAdminRequest:
    password = FuzzyText(length=20).fuzz()
    return CreateAdminRequest(
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        login_id=f"test_admin{FuzzyInteger(1, 100).fuzz()}@gmail.com",
        password=password,
        password_check=password,
        auth_menu_list=str(FuzzyInteger(1, 4).fuzz())
    )


@pytest.fixture
def create_admin_password_error_request() -> CreateAdminRequest:
    password = FuzzyText(length=20).fuzz()
    return CreateAdminRequest(
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        login_id=f"test_admin{FuzzyInteger(1, 100).fuzz()}@gmail.com",
        password=password,
        password_check=FuzzyText(length=50).fuzz(),
        auth_menu_list=str(FuzzyInteger(1, 4).fuzz())
    )


@pytest.fixture
def bo_create_user_fixture():
    admin_id = FuzzyInteger(0, 100).fuzz()

    return CreateBOUserSchema(
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
def update_admin_request() -> UpdateAdminRequest:
    password = FuzzyText(length=20).fuzz()
    return UpdateAdminRequest(
        admin_id=FuzzyInteger(1, 100).fuzz(),
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        password=password,
        password_check=password,
        auth_menu_list=str(FuzzyInteger(1, 4).fuzz())
    )


@pytest.fixture
def update_admin_password_error_request() -> UpdateAdminRequest:
    password = FuzzyText(length=20).fuzz()
    return UpdateAdminRequest(
        admin_id=FuzzyInteger(1, 100).fuzz(),
        name=FuzzyText(length=50).fuzz(),
        dept_name=FuzzyText(length=50).fuzz(),
        tel_no=generate_phone_number(),
        password=password,
        password_check=FuzzyText(length=20).fuzz(),
        auth_menu_list=str(FuzzyInteger(1, 4).fuzz())
    )
