from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.user.repository import admin_user_repository
from src.api.admin.user.response import AdminResponse
from src.api.admin.user.schemas import UpdateBOUserTokenSchema
from src.api.auth.request import SignInRequest

from src.api.auth.utils import authenticate_user, create_session_id
from src.core import utils
from src.core.config import config
from src.core.database import transactional


@transactional
async def sign_in(
        request: Request,
        request_body: SignInRequest,
        db: AsyncSession
) -> AdminResponse:
    # 로그인 검증
    user = await authenticate_user(request_body, admin_user_repository, db)
    login_token = create_session_id()

    # session에 토큰, 현재 시각 등록
    request.session[config.ADMIN_COOKIE_NAME] = login_token
    request.session["last_activity"] = utils.datetime_to_unix_time(utils.now())
    request.session["current_user"] = user.id

    # 토큰 db에 업데이트
    admin = await admin_user_repository.update(db, db_obj=user, obj_in=UpdateBOUserTokenSchema.of(user, login_token=login_token))
    return AdminResponse.of(admin)


async def sign_out(request: Request) -> None:
    # session에 있는 쿠키, 현재 시각 제거
    request.session.pop(config.ADMIN_COOKIE_NAME, None)
    request.session.pop("last_activity", None)
    request.session.pop("current_user", None)
