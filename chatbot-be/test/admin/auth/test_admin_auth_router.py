import pytest
from fastapi import Request
from starlette.responses import JSONResponse

from src.api.auth.request import SignInRequest
from src.core.config import config
from src.core.response import ApiResponse


@pytest.mark.asyncio
async def test_sign_in(
        admin_auth_router,
        admin_auth_service,
        success_request: SignInRequest,
        mock_request: Request
):
    # given
    sign_in_router, _ = admin_auth_router
    sign_in_service, _ = admin_auth_service
    mock_request.session = {config.ADMIN_COOKIE_NAME: "mocked_session_id"}

    async def mock_sign_in_router(sign_in_request, db_session):
        await sign_in_service(mock_request, sign_in_request, db_session)
        response = ApiResponse.of()
        response.set_cookie(
            key=config.ADMIN_COOKIE_NAME, value=mock_request.session[config.ADMIN_COOKIE_NAME], httponly=True,
            secure=False, samesite="lax", domain=config.DOMAIN
        )
        response.delete_cookie(key=config.COOKIE_NAME, domain=config.DOMAIN)
        return response

    sign_in_router.side_effect = mock_sign_in_router

    # Act
    result = await sign_in_router(success_request, db_session=None)

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200

    # Validate cookies
    cookies = result.headers.getlist('set-cookie')
    assert any(config.ADMIN_COOKIE_NAME in cookie for cookie in cookies)
    deleted_cookies = [cookie for cookie in cookies if f'{config.COOKIE_NAME}=' in cookie]
    assert any('Max-Age=0' in cookie or 'expires=' in cookie.lower() for cookie in deleted_cookies)


@pytest.mark.asyncio
async def test_sign_out(
        admin_auth_router,
        admin_auth_service,
        success_request: SignInRequest,
        mock_request: Request
):
    # given
    _, sign_out_router = admin_auth_router
    _, sign_out_service = admin_auth_service

    async def mock_sign_out_router():
        await sign_out_service(mock_request)
        response = ApiResponse.of()
        response.delete_cookie(key=config.ADMIN_COOKIE_NAME, domain=config.DOMAIN)
        return response

    sign_out_router.side_effect = mock_sign_out_router

    # Act
    result = await sign_out_router()

    # Assert
    assert isinstance(result, JSONResponse)
    assert result.status_code == 200

    # Validate that the cookie is deleted
    cookies = result.headers.getlist('set-cookie')
    deleted_cookie = None
    for cookie in cookies:
        if config.COOKIE_NAME in cookie:
            deleted_cookie = cookie
            break

    assert deleted_cookie is not None
    assert "Max-Age=0" in deleted_cookie or "expires=" in deleted_cookie.lower()
    assert f"{config.COOKIE_NAME}=" in deleted_cookie
