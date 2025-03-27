import os
from contextlib import ExitStack
import random
from datetime import datetime
from decimal import Decimal
from unittest.mock import patch, AsyncMock, MagicMock

import pytest
import pytz
from factory.fuzzy import FuzzyText, FuzzyInteger

from src.api.chatbot.models import Chatbot
from src.api.chatbot.request import QuestionRequest, RateRequest
from src.api.chatbot.response import ChatbotResponse
from src.api.report.request import ReportRequest
from src.api.vectordb.models import VectorDB
from src.core import utils
from src.core.config import config

DATE = datetime(2024, 1, 1, tzinfo=pytz.UTC)


@pytest.fixture
def mock_admin_auth(mocker, request):
    async def mock_dispatch(request, call_next):
        return await call_next(request)

    return mocker.patch("src.api.auth.infrastructure.AuthorizationMiddleware.dispatch",
                        side_effect=mock_dispatch)


@pytest.fixture
def chatbot_router():
    methods_to_patch = [
        "get_all",
        "answer",
        "rate",
        "report"
    ]

    with ExitStack() as stack:
        mocks = [stack.enter_context(patch(f"src.api.chatbot.router.{method}", new_callable=AsyncMock)) for method in methods_to_patch]
        yield mocks


@pytest.fixture
def chatbot_service():
    methods_to_patch = [
        "get_all",
        "answer",
        "rate",
        "report"
    ]

    with ExitStack() as stack:
        mocks = [stack.enter_context(patch(f"src.api.chatbot.service.{method}", new_callable=AsyncMock)) for method in methods_to_patch]
        yield mocks


def dgstfn_maker() -> str:
    value = FuzzyInteger(0, 5).fuzz()
    if value != 5:
        value += random.choice([Decimal(0.5), Decimal(0)])
    return str(value)


@pytest.fixture
def chatbot_fixture() -> Chatbot:
    user = FuzzyInteger(1, 100).fuzz()
    return Chatbot(
        id=FuzzyInteger(1, 100).fuzz(),
        user_id=user,
        call_path=random.choice(["user", "api"]),
        vectordb_id=FuzzyInteger(1, 100).fuzz(),
        question_content=FuzzyText(length=50).fuzz(),
        answer_content=FuzzyText(length=50).fuzz(),
        dgstfn=Decimal(dgstfn_maker()),
        creation_id=user,
        creation_dt=DATE,
        update_id=user,
        update_dt=DATE
    )


@pytest.fixture
def vector_db_fixture() -> VectorDB:
    manual = FuzzyText(length=50).fuzz()
    return VectorDB(
        id=FuzzyInteger(1, 100).fuzz(),
        screen_id=f"screen_",
        manual_name=manual,
        manual_path=os.path.join(config.SAVE_DIR, manual),
        subject=FuzzyText(length=50).fuzz(),
        content=FuzzyText(length=50).fuzz(),
        image_path=FuzzyText(length=50).fuzz(),
        data_status=random.choice(["Y", "N"]),
        creation_id=FuzzyInteger(1, 100).fuzz(),
        update_id=FuzzyInteger(1, 100).fuzz(),
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def question_request() -> QuestionRequest:
    return QuestionRequest(
        question_content=FuzzyText(length=50).fuzz(),
        call_path=random.choice(["user", "api"])
    )


@pytest.fixture
def rate_request() -> RateRequest:
    return RateRequest(
        id=FuzzyInteger(0, 100).fuzz(),
        dgstfn=dgstfn_maker()
    )


@pytest.fixture
def report_request() -> ReportRequest:
    return ReportRequest(
        id=FuzzyInteger(0, 100).fuzz(),
        report_content=FuzzyText(length=50).fuzz()
    )


@pytest.fixture
def chatbot_response() -> ChatbotResponse:
    return ChatbotResponse(
        id=FuzzyInteger(0, 100).fuzz(),
        question_content=FuzzyText(length=50).fuzz(),
        answer_content=FuzzyText(length=50).fuzz(),
        screen_id=FuzzyText(length=50).fuzz(),
        hash_id_list=[FuzzyText(length=50).fuzz()],
        dgstfn=dgstfn_maker(),
        is_report_exist=random.choice([True, False]),
        date=utils.datetime_to_unix_time(DATE)
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
