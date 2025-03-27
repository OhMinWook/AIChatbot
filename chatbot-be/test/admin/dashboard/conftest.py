from datetime import datetime
from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest

from src.api.admin.dashboard.models import UsageQuantity
from src.api.admin.dashboard.request import UseSummarySearchParam
from src.api.chatbot.models import Chatbot
from src.api.user.models import User
from src.core import utils
from src.core.pagination import Pageable

"""
    요청 관련 데이터 mock
"""
mock_search_use_params_json = {
    "page_no": 1,
    "page_size": 10,
    "start_dt": 1695097800,
    "end_dt": 1726720200
}

mock_search_use_params = Pageable(
    page_no=1,
    page_size=10,
    start_dt=1695097800,
    end_dt=1726720200
)


def get_mock_search_use_summary_params_json(detail_fileter: str):
    return {
        "page_no": 1,
        "page_size": 10,
        "start_dt": 1695097800,
        "end_dt": 1726720200,
        "date_filter": "day",
        "detail_filter": detail_fileter
    }


def get_mock_search_use_summary_params(detail_fileter: str):
    return UseSummarySearchParam(
        page_no=1,
        page_size=10,
        start_dt=1695097800,
        end_dt=1726720200,
        date_filter="day",
        detail_fileter=detail_fileter
    )


"""
    응답 관련 데이터 mock
"""

mock_user_use1 = {
    "use_id": 1,
    "hospital_name": "hospital1",
    "user_name": "user1",
    "call_path": "화면",
    "use_token_cnt": 20,
    "use_amount": utils.decimal_to_str(Decimal('0.5')),
    "question_content": "question1",
    "answer_content": "answer1",
    "satisfaction_rate": 3.5,
    "creation_dt": 1721350800
}

mock_user_use_row1 = {
    "UsageQuantity": UsageQuantity(
        id=1,
        usqty_type="2",
        type_id=1,
        crud_type="c",
        question_token_cnt=15,
        answer_token_cnt=5,
        use_token_cnt=20,
        use_amount=Decimal('0.5'),
        creation_id=1,
        creation_dt=datetime(2024, 9, 19, 10, 00, 00)
    ),
    "Chatbot": Chatbot(
        id=1,
        user_id=1,
        call_path="user",
        vectordb_id=1,
        question_content="question1",
        answer_content="answer1",
        dgstfn=Decimal('3.5'),
        creation_id=1,
        creation_dt=datetime(2024, 9, 19, 10, 00, 00),
        update_id=1,
        update_dt=datetime(2024, 9, 19, 10, 00, 00)
    ),
    "User": User(
        id=1,
        login_id="test",
        password="<PASSWORD>",
        name="user1",
        hospital_name="hospital1",
        dept_name=None,
        login_token=None,
        creation_id=1,
        creation_dt=datetime(2024, 9, 19, 10, 00, 00),
        update_id=1,
        update_dt=datetime(2024, 9, 19, 10, 00, 00)
    )
}

mock_user_use_row2 = {
    "UsageQuantity": UsageQuantity(
        id=2,
        usqty_type="2",
        type_id=2,
        crud_type="c",
        question_token_cnt=35,
        answer_token_cnt=5,
        use_token_cnt=40,
        use_amount=Decimal('0.5'),
        creation_id=1,
        creation_dt=datetime(2024, 9, 19, 10, 00, 00)
    ),
    "Chatbot": Chatbot(
        id=2,
        user_id=1,
        call_path="api",
        vectordb_id=2,
        question_content="question1",
        answer_content="answer1",
        dgstfn=Decimal('3.5'),
        creation_id=1,
        creation_dt=datetime(2024, 9, 19, 10, 00, 00),
        update_id=1,
        update_dt=datetime(2024, 9, 19, 10, 00, 00)
    ),
    "User": User(
        id=1,
        login_id="test",
        password="<PASSWORD>",
        name="user1",
        hospital_name="hospital1",
        dept_name=None,
        login_token=None,
        creation_id=1,
        creation_dt=datetime(2024, 9, 19, 10, 00, 00),
        update_id=1,
        update_dt=datetime(2024, 9, 19, 10, 00, 00)
    )
}

"""
    서비스 함수 mocking
"""


@pytest.fixture
def mock_service_get_user_all_use(mocker):
    data = {
        "response": [
            mock_user_use1
        ],
        "total_pages": 1,
        "page_size": 10,
        "current_page_no": 1
    }
    return mocker.patch("src.api.admin.dashboard.service.get_user_all_use",
                        new=AsyncMock(return_value=data))


@pytest.fixture
def mock_service_get_user_use(mocker):
    return mocker.patch("src.api.admin.dashboard.service.get_user_use",
                        new=AsyncMock(return_value=mock_user_use1))


@pytest.fixture
def mock_service_get_user_use_summary(mocker):
    data = {
        "response": [
            {
                "detail": "api",
                "total_token_cnt": 1000,
                "total_use_amount": "15.000000000000000000",
                "date": "2024.07.19"
            }
        ],
        "total_pages": 1,
        "page_size": 50,
        "current_page_no": 1
    }
    return mocker.patch("src.api.admin.dashboard.service.get_user_use_summary",
                        new=AsyncMock(return_value=data))


@pytest.fixture
def mock_service_get_admin_all_use(mocker):
    data = {
        "use_id": 1,
        "admin_name": "admin1",
        "use_type": "1",
        "screen_id": "screen1",
        "manual_name": "manual1",
        "use_token_cnt": 20,
        "use_amount": "0.500000000000000000",
        "creation_dt": 1726707600
    }
    return mocker.patch("src.api.admin.dashboard.service.get_admin_all_use",
                        new=AsyncMock(return_value=data))


@pytest.fixture
def mock_service_get_admin_use_summary(mocker):
    data = {
        "detail": "전체",
        "total_token_cnt": 150,
        "total_use_amount": "150.000000000000000000",
        "date": "2023.09 - 2024.09"
    }
    return mocker.patch("src.api.admin.dashboard.service.get_admin_use_summary",
                        new=AsyncMock(return_value=data))


"""
    repository 함수 mocking
"""


@pytest.fixture
def mock_repository_get_user_all_use(mocker):
    datas = [
        mock_user_use_row1,
        mock_user_use_row2
    ]
    return mocker.patch("src.api.admin.dashboard.repository.user_use_repository.get_all_filter_with_joins",
                        new=AsyncMock(return_value=datas))


@pytest.fixture
def mock_repository_get_user_use(mocker):
    async def mock_get_with_joins(*args, **kwargs):
        return [mock_user_use_row1]

    return mocker.patch(
        "src.api.admin.dashboard.repository.user_use_repository.get_with_joins",
        new=mock_get_with_joins
    )


@pytest.fixture
def mock_repository_get_user_use_summary(mocker):
    datas = [
        {
            "detail": "user",
            "total_token_cnt": 100,
            "total_use_amount": Decimal('100'),
            "date": "-"
        },
        {
            "detail": "api",
            "total_token_cnt": 100,
            "total_use_amount": Decimal('100'),
            "date": "2024.07.20"
        }
    ]

    return mocker.patch("src.api.admin.dashboard.repository.user_use_repository.get_user_use_summary",
                        new=AsyncMock(return_value=datas))


@pytest.fixture
def mock_repository_get_admin_all_use(mocker):
    datas = [
        {
            "id": 1,
            "name": "admin1",
            "usqty_type": "1",
            "screen_id": "screen1",
            "manual_name": "manual1",
            "use_token_cnt": 20,
            "use_amount": Decimal('100'),
            "creation_dt": datetime(2024, 9, 19, 10, 00, 00)
        },
        {
            "id": 2,
            "name": "admin2",
            "usqty_type": "2",
            "screen_id": "screen2",
            "manual_name": "manual2",
            "use_token_cnt": 20,
            "use_amount": Decimal('100'),
            "creation_dt": datetime(2024, 9, 19, 10, 00, 00)
        }
    ]

    return mocker.patch("src.api.admin.dashboard.repository.admin_use_repository.get_admin_all_use",
                        new=AsyncMock(return_value=datas))


@pytest.fixture
def mock_repository_get_admin_use_summary(mocker):
    datas = [
        {
            "detail": "전체",
            "total_token_cnt": 100,
            "total_use_amount": Decimal('150'),
            "date": "2023.09 - 2024.09"
        },
        {
            "detail": "전체",
            "total_token_cnt": 100,
            "total_use_amount": Decimal('150'),
            "date": "2023.09 - 2024.09"
        }
    ]

    return mocker.patch("src.api.admin.dashboard.repository.admin_use_repository.get_admin_use_summary",
                        new=AsyncMock(return_value=datas))


"""
    utils 함수 모킹
"""


@pytest.fixture
def mock_decimal_to_str(mocker):
    return mocker.patch(
        "src.core.utils.decimal_to_str", side_effect=lambda d: f"{d:.18f}" if isinstance(d, Decimal) else None
    )


@pytest.fixture(scope='session', autouse=True)
def mock_chromadb_client():
    with patch('src.api.vectordb.utils.ChromaDBClient.get_client', new_callable=AsyncMock) as mock_get_client:
        mock_get_client.return_value = AsyncMock()
        yield


@pytest.fixture(scope='session', autouse=True)
def mock_os_getenv():
    with patch('src.core.config.os.getenv') as mock_getenv:
        # getenv_side_effect 정의
        yield
