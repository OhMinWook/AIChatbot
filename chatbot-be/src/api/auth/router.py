from fastapi import APIRouter, Request
from starlette.responses import JSONResponse

from src.core.database import db_session
from src.core.response import ApiResponse
from src.core.config import config
from src.api.auth.request import SignInRequest
from src.api.auth import service

auth = APIRouter()


@auth.post("/sign-in")
async def sign_in(
        request: Request,
        sign_in_request: SignInRequest,
        db: db_session
) -> JSONResponse:
    """
    ## DB 내 login_token 업데이트 및 set_cookie
    ### Args:
        login_id: 유저 이메일 (str)
        password: 유저 비밀번호 (str)

    ### Raises:
        SignInFailedException: 이메일 or 비밀번호 틀림 (401, 'Unauthorized')

    ### Returns:
        status: (200, 'OK')
        data: {
            id: ~~,
            name: ~~,
            dept_name: ~~,
            login_id: ~~,
            creation_dt: ~~
        }
    """
    data = await service.sign_in(request, sign_in_request, db)
    response = ApiResponse.of(data=data)
    response.set_cookie(
        key=config.COOKIE_NAME, value=request.session[config.COOKIE_NAME], httponly=True,
        secure=False, samesite="lax", domain=config.DOMAIN
    )
    response.delete_cookie(key=config.ADMIN_COOKIE_NAME, domain=config.DOMAIN)
    return response


@auth.post("/sign-out")
async def sign_out(request: Request) -> JSONResponse:
    """
    ## delete_cookie
    ### Args:

    ### Raises:
        로그인 상태 아닌데 요청 보내면
        401 Unauthorized: Not exists session_id at cookie

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.sign_out(request)
    response = ApiResponse.of()
    response.delete_cookie(key=config.COOKIE_NAME, domain=config.DOMAIN)
    return response
