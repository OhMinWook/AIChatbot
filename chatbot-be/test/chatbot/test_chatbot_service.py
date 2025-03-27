from unittest.mock import patch, AsyncMock

import pytest
from factory.fuzzy import FuzzyInteger, FuzzyText
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.chatbot.models import Chatbot
from src.api.chatbot.request import RateRequest
from src.api.chatbot.response import ChatbotResponse
from src.api.chatbot.service import get_all, rate, report
from src.api.report.request import ReportRequest
from src.api.vectordb.models import VectorDB
from test_utils import diff_check


@pytest.mark.asyncio
async def test_get_all(
        chatbot_fixture: Chatbot,
        vector_db_fixture: VectorDB,
        mock_request: Request,
        mock_db: AsyncSession
):
    current_user_id = 1
    mock_request.session = {"current_user": current_user_id}
    mock_base_answer = FuzzyText(length=10).fuzz()

    last_id = FuzzyInteger(0, 100).fuzz()
    responses = [{"Chatbot": chatbot_fixture, "VectorDB": vector_db_fixture}]
    chatbot_list = [{"Chatbot": chatbot_fixture}]
    grouped_by_id = {chatbot_fixture.id: responses}

    with patch("src.api.chatbot.service.chatbot_repository.get_id_list",
               return_value=chatbot_list), \
            patch("src.api.chatbot.service.chatbot_repository.get_with_joins_by_id_list",
                  return_value=responses), \
            patch("src.api.chatbot.service.return_base_answer", return_value=mock_base_answer):
        results = await get_all(mock_db, mock_request, last_id)
        assert results == [ChatbotResponse.of(value) for key, value in grouped_by_id.items()]


@pytest.mark.asyncio
async def test_rate(
        chatbot_fixture: Chatbot,
        rate_request: RateRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    chatbot = chatbot_fixture

    current_user_id = chatbot.user_id
    mock_request.session = {"current_user": current_user_id}

    with patch("src.api.chatbot.service.chatbot_repository.get_by_id", return_value=chatbot) as mock_get_by_id, \
            patch("src.api.chatbot.service.chatbot_repository.update", new_callable=AsyncMock) as mock_update:
        await rate(mock_db, mock_request, rate_request)

        mock_get_by_id.assert_called_once_with(mock_db, id=rate_request.id)
        mock_update.assert_called_once()
        actual_update_call = mock_update.call_args[1]["db_obj"]
        assert actual_update_call == chatbot


@pytest.mark.asyncio
async def test_report(
        chatbot_fixture: Chatbot,
        report_request: ReportRequest,
        mock_request: Request,
        mock_db: AsyncSession
):
    chatbot = chatbot_fixture
    chatbot.id = report_request.id

    current_user_id = chatbot.user_id
    mock_request.session = {"current_user": current_user_id}

    with patch("src.api.chatbot.service.chatbot_repository.get_by_id", return_value=chatbot) as mock_get_by_id, \
            patch("src.api.chatbot.service.report_repository.get_by_chatbot_id",
                  return_value=None) as mock_get_by_chatbot_id, \
            patch("src.api.chatbot.service.report_repository.create", new_callable=AsyncMock) as mock_create:
        mock_create.return_value = chatbot
        await report(mock_db, mock_request, report_request)

        mock_get_by_id.assert_called_once_with(mock_db, id=report_request.id)
        mock_get_by_chatbot_id.assert_called_once_with(mock_db, chatbot_id=report_request.id)

        mock_create.assert_called_once()
        actual_create_call = mock_create.call_args[1]["obj_in"]

        diff_check(actual_create_call, chatbot)
