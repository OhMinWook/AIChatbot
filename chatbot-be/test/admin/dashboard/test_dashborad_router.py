import pytest
from conftest import mock_search_use_params_json, get_mock_search_use_summary_params_json


def get_expected_response(expected_data: list) -> dict:
    return {
        "error": False,
        "message": "success",
        "data": expected_data
    }


def get_expected_pageable_response(expected_data: list) -> dict:
    return {
        "error": False,
        "message": "success",
        "data": expected_data
    }


@pytest.mark.asyncio
async def test_get_user_all_use_success(
        mock_db,
        mock_admin_auth,
        mock_service_get_user_all_use,
        mock_chromadb_client,
        mock_os_getenv
):
    from fastapi.testclient import TestClient
    from server import app
    # given
    client = TestClient(app)
    params = mock_search_use_params_json

    # when
    response = client.get("/admin/dashboard/use/user", params=params)

    # then
    mock_service_get_user_all_use.assert_called_once()
    assert response.status_code == 200

    expected = get_expected_pageable_response(mock_service_get_user_all_use.return_value)
    assert response.json() == expected


@pytest.mark.asyncio
async def test_get_user_use_success(
        mock_db,
        mock_admin_auth,
        mock_service_get_user_use,
        mock_chromadb_client,
        mock_os_getenv
):
    from fastapi.testclient import TestClient
    from server import app
    # given
    client = TestClient(app)
    # given
    use_id = 1

    # when
    response = client.get(f"/admin/dashboard/use/user/{use_id}")

    # then
    mock_service_get_user_use.asser_called_once()
    assert response.status_code == 200

    expected = get_expected_response(mock_service_get_user_use.return_value)
    assert response.json() == expected


@pytest.mark.asyncio
async def test_get_user_use_summary_success(
        mock_db,
        mock_admin_auth,
        mock_service_get_user_use_summary,
        mock_chromadb_client,
        mock_os_getenv
):
    from fastapi.testclient import TestClient
    from server import app
    # given
    client = TestClient(app)
    # given
    params = get_mock_search_use_summary_params_json("call_path")

    # when
    response = client.get("/admin/dashboard/use/user/summary", params=params)

    # then
    mock_service_get_user_use_summary.assert_called_once()
    assert response.status_code == 200

    expected = get_expected_pageable_response(mock_service_get_user_use_summary.return_value)
    assert response.json() == expected


@pytest.mark.asyncio
async def test_get_admin_use_success(
        mock_db,
        mock_admin_auth,
        mock_service_get_admin_all_use,
        mock_chromadb_client,
        mock_os_getenv
):
    from fastapi.testclient import TestClient
    from server import app
    # given
    client = TestClient(app)
    # given
    params = mock_search_use_params_json

    # when
    response = client.get("/admin/dashboard/use/admin", params=params)

    # then
    mock_service_get_admin_all_use.assert_called_once()
    assert response.status_code == 200

    expected = get_expected_pageable_response(mock_service_get_admin_all_use.return_value)
    assert response.json() == expected


@pytest.mark.asyncio
async def test_get_admin_use_summary_success(
        mock_db,
        mock_admin_auth,
        mock_service_get_admin_use_summary,
        mock_chromadb_client,
        mock_os_getenv
):
    from fastapi.testclient import TestClient
    from server import app
    # given
    client = TestClient(app)
    # given
    params = get_mock_search_use_summary_params_json("all")

    # when
    response = client.get("/admin/dashboard/use/admin/summary", params=params)

    # then
    mock_service_get_admin_use_summary.assert_called_once()
    assert response.status_code == 200

    expected = get_expected_pageable_response(mock_service_get_admin_use_summary.return_value)
    assert response.json() == expected
