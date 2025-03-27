import pytest
from starlette.responses import JSONResponse

from src.api.admin.answer.request import UpdateAnswerRequest, AnswerSearchParam
from src.core.response import ApiResponse
from src.api.admin.answer.response import ReportDetailResponse, ReportResponse, AnswerResponse


@pytest.mark.asyncio
async def test_get_all_reports(
        admin_answer_router,
        admin_answer_service,
        answer_search_param:AnswerSearchParam,
        report_response: ReportResponse
):
    get_all_reports_router = admin_answer_router[0]
    get_all_reports_service = admin_answer_service[0]

    get_all_reports_service.return_value = report_response

    async def mock_get_all_reports_router(db_session, request):
        data = await get_all_reports_service(db_session, request)
        return ApiResponse.of(data=data)

    get_all_reports_router.side_effect = mock_get_all_reports_router

    result = await get_all_reports_router(db_session=None, request=answer_search_param)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_delete_report(
        admin_answer_router,
        admin_answer_service,
):
    delete_report_router = admin_answer_router[1]
    delete_report_service = admin_answer_service[1]

    id_list = "1,2"

    async def mock_delete_report_router(db_session, request):
        await delete_report_service(db_session, request)
        return ApiResponse.of(data={})

    delete_report_router.side_effect = mock_delete_report_router

    result = await delete_report_router(db_session=None, request=id_list)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_get_report_detail(
        admin_answer_router,
        admin_answer_service,
        report_detail_response: ReportDetailResponse
):
    report_detail_router = admin_answer_router[2]
    report_detail_service = admin_answer_service[2]

    report_id = 1
    report_detail_service.return_value = report_detail_response

    async def mock_get_report_detail(db_session, request):
        data = await report_detail_service(db_session, request)
        return ApiResponse.of(data=data)

    report_detail_router.side_effect = mock_get_report_detail

    result = await report_detail_router(db_session=None, request=report_id)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_get_answer(
        admin_answer_router,
        admin_answer_service,
        answer_response: AnswerResponse
):
    get_answer_router = admin_answer_router[3]
    get_answer_service = admin_answer_service[3]

    answer_id = 1
    get_answer_service.return_value = answer_response

    async def mock_get_answer_router(db_session, request):
        data = await get_answer_service(db_session, answer_id, request)
        return ApiResponse.of(data=data)

    get_answer_router.side_effect = mock_get_answer_router
    result = await get_answer_router(db_session=None, request=answer_id)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200


@pytest.mark.asyncio
async def test_update_answer(
        admin_answer_router,
        admin_answer_service,
        update_answer_request: UpdateAnswerRequest
):
    update_answer_router = admin_answer_router[4]
    update_answer_service = admin_answer_service[4]

    answer_id = 1
    update_answer_service.return_value = None  # 업데이트 후 특별한 데이터가 없을 경우

    async def mock_update_answer_router(db_session, request):
        await update_answer_service(db_session, answer_id, request)
        return ApiResponse.of(data={})  # 업데이트는 성공 여부만 응답

    update_answer_router.side_effect = mock_update_answer_router

    result = await update_answer_router(db_session=None, request=update_answer_request)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200
