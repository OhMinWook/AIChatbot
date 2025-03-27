from factory.fuzzy import FuzzyInteger
import pytest
from src.api.admin.answer.response import ReportResponse


@pytest.mark.asyncio
async def test_get_all_reports(admin_answer_service, mock_db, mock_request, answer_search_param, report_response):
    # 가상의 Pageable 객체
    pageable = FuzzyInteger(1, 100).fuzz()

    # service의 get_all_reports 메서드를 모킹하여 테스트 데이터 반환
    admin_answer_service[0].return_value = [report_response, 1]

    # get_all_reports 함수 호출
    result = await admin_answer_service[0](mock_db, mock_request, answer_search_param)

    # 반환된 결과가 예상한 형태인지 확인
    assert len(result) == 2
    assert isinstance(result[0], ReportResponse)
    admin_answer_service[0].assert_called_once()


@pytest.mark.asyncio
async def test_delete_report(admin_answer_service, mock_db, mock_request):
    report_id = FuzzyInteger(1, 100).fuzz()

    # delete_report 함수 호출
    await admin_answer_service[1](mock_db, mock_request, report_id)

    # delete_report가 한 번 호출되었는지 확인
    admin_answer_service[1].assert_called_once_with(mock_db, mock_request, report_id)


@pytest.mark.asyncio
async def test_get_report_detail(admin_answer_service, mock_db, mock_request, report_detail_response):
    report_id = FuzzyInteger(1, 100).fuzz()

    # 모킹된 get_report_detail로부터 테스트 데이터 반환
    admin_answer_service[2].return_value = report_detail_response

    # get_report_detail 함수 호출
    result = await admin_answer_service[2](mock_db, mock_request, report_id)

    # 반환된 결과가 예상한 형태인지 확인
    assert result == report_detail_response
    admin_answer_service[2].assert_called_once_with(mock_db, mock_request, report_id)


@pytest.mark.asyncio
async def test_get_answer(admin_answer_service, mock_db, mock_request, answer_response):
    answer_id = 1

    # 모킹된 get_report_detail로부터 테스트 데이터 반환
    admin_answer_service[3].return_value = answer_response

    # get_report_detail 함수 호출
    result = await admin_answer_service[3](mock_db, mock_request, answer_id)

    # 반환된 결과가 예상한 형태인지 확인
    assert result == answer_response
    admin_answer_service[3].assert_called_once_with(mock_db, mock_request, answer_id)


@pytest.mark.asyncio
async def test_update_answer(admin_answer_service, mock_db, mock_request, update_answer_request):
    answer_id = FuzzyInteger(1, 100).fuzz()

    # update_answer 호출
    await admin_answer_service[4](mock_db, mock_request, answer_id, update_answer_request)

    # update_answer가 한 번 호출되었는지 확인
    admin_answer_service[4].assert_called_once_with(mock_db, mock_request, answer_id, update_answer_request)
