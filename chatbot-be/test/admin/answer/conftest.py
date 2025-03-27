from contextlib import ExitStack
from datetime import datetime
from unittest.mock import patch, AsyncMock
import pytest
import pytz
from factory.fuzzy import FuzzyInteger, FuzzyText

from src.api.admin.answer.request import UpdateAnswerRequest, AnswerSearchParam
from src.api.admin.answer.response import ReportResponse, ReportDetailResponse, AnswerResponse
from src.core.utils import datetime_to_unix_time

# 테스트용 상수
DATE = datetime(2024, 1, 1, tzinfo=pytz.UTC)


@pytest.fixture
def admin_answer_router():
    router_methods = [AsyncMock(), AsyncMock(), AsyncMock(), AsyncMock(), AsyncMock(), AsyncMock(), AsyncMock()]
    return router_methods


@pytest.fixture()
def admin_answer_service():
    methods_to_patch = [
        "get_all_reports",
        "delete_report",
        "get_report_detail",
        "get_answer",
        "update_answer"
    ]
    with ExitStack() as stack:
        mocks = [stack.enter_context(patch(f"src.api.admin.answer.service.{method}", new_callable=AsyncMock)) for method
                 in methods_to_patch]
        yield mocks


@pytest.fixture
def update_answer_request() -> UpdateAnswerRequest:
    return UpdateAnswerRequest(
        answer_content=FuzzyText(length=50).fuzz(),
    )


@pytest.fixture
def answer_search_param() -> AnswerSearchParam:
    return AnswerSearchParam(
        report_content=FuzzyText(length=200).fuzz()
    )


@pytest.fixture
def answer_response() -> AnswerResponse:
    return AnswerResponse(
        answer_id=FuzzyInteger(1, 100).fuzz(),
        answer_content=FuzzyText(length=50).fuzz()
    )


@pytest.fixture
def report_response() -> ReportResponse:
    return ReportResponse(
        report_id=FuzzyInteger(1, 100).fuzz(),
        question_content=FuzzyText(length=50).fuzz(),
        answer_content=FuzzyText(length=50).fuzz(),
        report_content=FuzzyText(length=50).fuzz(),
        creation_dt=datetime_to_unix_time(DATE)
    )


@pytest.fixture
def report_detail_response() -> ReportDetailResponse:
    return ReportDetailResponse(
        report_id=FuzzyInteger(1, 100).fuzz(),
        question_content=FuzzyText(length=50).fuzz(),
        answer_content=FuzzyText(length=50).fuzz(),
        report_content=FuzzyText(length=50).fuzz(),
        creation_dt=datetime_to_unix_time(DATE),
        user_id=FuzzyText(length=50).fuzz(),
        screen_id=FuzzyText(length=10).fuzz(),
        manual_name=FuzzyText(length=10).fuzz(),
        manual_path=FuzzyText(length=10).fuzz(),
        manual_id=FuzzyInteger(1, 100).fuzz(),
    )
