import pytest
from factory.fuzzy import FuzzyInteger
from starlette.responses import JSONResponse

from src.api.chatbot.request import RateRequest
from src.api.chatbot.response import ChatbotResponse
from src.api.report.request import ReportRequest
from src.core.response import ApiResponse


@pytest.mark.asyncio
async def test_get_all(
        chatbot_router,
        chatbot_service,
        chatbot_response: ChatbotResponse
):
    get_all_router = chatbot_router[0]
    get_all_service = chatbot_service[0]

    last_id = FuzzyInteger(0, 100).fuzz()
    get_all_service.return_value = [chatbot_response] * FuzzyInteger(0, 5).fuzz()

    async def mock_get_all_router(db_session, request):
        data = await get_all_service(request)
        return ApiResponse.of(data=data)

    get_all_router.side_effect = mock_get_all_router

    result = await get_all_router(db_session=None, request=last_id)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


# TODO 일정 상 streaming 방식은 추후 다시 사용 예정
# @pytest.mark.asyncio
# async def test_question(
#         question_request: QuestionRequest,
#         mock_admin_auth,
#         chatbot_router
# ):
#     with patch("src.api.chatbot.router.ChatModule.main") as mock_main:
#         async def mock_stream_generator(*args, **kwargs):
#             yield b"Test streaming content"
#
#         mock_main.return_value = StreamingResponse(
#             mock_stream_generator(),
#             media_type="text/plain"
#         )
#
#         response = client.post(
#             "/chatbot/",
#             json=question_request.model_dump()
#         )
#
#         assert response.status_code == 200
#
#         content = b""
#         for chunk in response.iter_bytes():
#             content += chunk
#
#         assert content == b"Test streaming content"


@pytest.mark.asyncio
async def test_rate(
        chatbot_router,
        chatbot_service,
        rate_request: RateRequest
):
    rate_router = chatbot_router[2]
    rate_service = chatbot_service[2]

    async def mock_rate_router(db_session, request):
        await rate_service(request)
        return ApiResponse.of()

    rate_router.side_effect = mock_rate_router

    result = await rate_router(db_session=None, request=rate_request)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_report(
        chatbot_router,
        chatbot_service,
        report_request: ReportRequest
):
    report_router = chatbot_router[3]
    report_service = chatbot_service[3]

    async def mock_report_router(db_session, request):
        await report_service(request)
        return ApiResponse.of()

    report_router.side_effect = mock_report_router

    result = await report_router(db_session=None, request=report_request)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200
