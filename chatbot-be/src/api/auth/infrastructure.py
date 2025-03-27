import typing
from http import HTTPStatus

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import Response, JSONResponse

from starlette.middleware.base import RequestResponseEndpoint, BaseHTTPMiddleware
from starlette.requests import Request
import re

from src.api.admin.user.repository import admin_user_repository
from src.api.user.repository import user_repository
from src.core import utils
from src.core.database import session as db_session
from src.core.response import ApiResponse
from src.core.config import config


def init_middleware(app: FastAPI) -> None:
    # 나중에 추가된 middleware가 가장 먼저 실행
    app.add_middleware(
        AuthorizationMiddleware,
        ignore_urls=[
            fr"^{config.ROOT_PATH}/docs",  # swagger
            fr"^{config.ROOT_PATH}/redoc",  # redoc
            fr"^{config.ROOT_PATH}/openapi.json",  # swagger, redoc
            fr"^{config.ROOT_PATH}/health-check",
            fr"^{config.ROOT_PATH}/database-check",
            fr"^{config.ROOT_PATH}/auth/sign-in",
            fr"^{config.ROOT_PATH}/admin/auth/sign-in",

        ]
    )

    app.add_middleware(
        SessionMiddleware,
        secret_key=config.SECRET_KEY,
        max_age=config.MAX_AGE,
    )

    origins: typing.Sequence[str] = config.ORIGINS.split(",")
    expose_headers = [
        "Access-Control-Allow-Credentials"
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=expose_headers
    )


class AuthorizationMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, ignore_urls=None):
        super().__init__(app)
        self.ignore_urls = ignore_urls or []

    def __is_ignore_url(self, url: str) -> bool:
        for url_pattern in self.ignore_urls:
            if re.match(url_pattern, url):
                return True

        return False

    async def dispatch(
            self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request.state.db = db_session()

        try:
            if self.__is_ignore_url(request.url.path):
                return await call_next(request)

            db = request.state.db
            if request.url.path.startswith(f'{config.ROOT_PATH}/admin'):
                session_cookie_name = config.ADMIN_COOKIE_NAME
                current_session = await admin_user_repository.get_token_by_id(
                    db,
                    user_id=request.session.get("current_user")
                )
            else:
                session_cookie_name = config.COOKIE_NAME
                current_session = await user_repository.get_token_by_id(
                    db,
                    user_id=request.session.get("current_user")
                )

            session = request.cookies.get(session_cookie_name)

            if session is None:
                return JSONResponse(
                    status_code=HTTPStatus.UNAUTHORIZED,
                    content=ApiResponse(error=True, message="Not exists session_id at cookie",
                                        data=None).model_dump()
                )

            if session != current_session:
                return JSONResponse(
                    status_code=HTTPStatus.UNAUTHORIZED,
                    content=ApiResponse(error=True, message="Duplicate login Detected.",
                                        data=None).model_dump()
                )

            last_activity = request.session.get("last_activity", 0)
            if utils.now().timestamp() - float(last_activity) > config.MAX_AGE:  # 세션 만료 (30분) 확인
                return JSONResponse(
                    status_code=HTTPStatus.UNAUTHORIZED,
                    content=ApiResponse(error=True, message="Session expired",
                                        data=None).model_dump()
                )
            request.session["last_activity"] = utils.datetime_to_unix_time(utils.now())
            return await call_next(request)

        except Exception as e:
            raise e

        finally:
            await request.state.db.close()
