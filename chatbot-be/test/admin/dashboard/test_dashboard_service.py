from conftest import mock_search_use_params, get_mock_search_use_summary_params
from src.api.admin.dashboard import service
from src.api.admin.dashboard.response import UserUseResponse, UseSummaryResponse, AdminUseResponse
import pytest


@pytest.mark.asyncio
async def test_get_user_all_use_success(
        mock_db,
        mock_request,
        mock_repository_get_user_all_use
):
    # given
    params = mock_search_use_params

    # when
    # 인증 및 트랜잭션 데코레이터에 대한 의존성을 제거하여, 순수 로직 함수 부분만 테스트
    result = await service.get_user_all_use.__wrapped__.__wrapped__(
        db=mock_db,
        request=mock_request,
        params=params
    )

    # then
    assert len(result) == len(mock_repository_get_user_all_use.return_value)
    for item in result:
        assert isinstance(item, UserUseResponse)


@pytest.mark.asyncio
async def test_get_user_use_success(
        mock_db,
        mock_request,
        mock_repository_get_user_use,
        mock_decimal_to_str
):
    # given
    use_id = 1
    mock_data = await mock_repository_get_user_use()
    expected = UserUseResponse.of(mock_data[0])

    # when
    result = await service.get_user_use.__wrapped__.__wrapped__(
        db=mock_db,
        request=mock_request,
        use_id=use_id
    )

    # then
    assert isinstance(result, UserUseResponse)
    assert result == expected


@pytest.mark.asyncio
async def test_get_user_use_summary_success(
        mock_db,
        mock_request,
        mock_repository_get_user_use_summary
):
    # given
    params = get_mock_search_use_summary_params("call_path")

    # when
    result = await service.get_user_use_summary.__wrapped__.__wrapped__(
        db=mock_db,
        request=mock_request,
        params=params
    )

    # then
    assert len(result) == len(mock_repository_get_user_use_summary.return_value)
    for item in result:
        assert isinstance(item, UseSummaryResponse)


@pytest.mark.asyncio
async def test_get_admin_all_use_success(
        mock_db,
        mock_request,
        mock_repository_get_admin_all_use
):
    # given
    params = mock_search_use_params

    # when
    result = await service.get_admin_all_use.__wrapped__.__wrapped__(
        db=mock_db,
        request=mock_request,
        params=params
    )

    # then
    assert len(result) == len(mock_repository_get_admin_all_use.return_value)
    for item in result:
        assert isinstance(item, AdminUseResponse)


@pytest.mark.asyncio
async def test_get_admin_use_summary_success(
        mock_db,
        mock_request,
        mock_repository_get_admin_use_summary
):
    # given
    params = get_mock_search_use_summary_params("admin")

    # when
    result = await service.get_admin_use_summary.__wrapped__.__wrapped__(
        db=mock_db,
        request=mock_request,
        params=params
    )
    # then
    assert len(result) == len(mock_repository_get_admin_use_summary.return_value)
    for item in result:
        assert isinstance(item, UseSummaryResponse)
