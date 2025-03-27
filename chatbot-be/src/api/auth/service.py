from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth.request import SignInRequest
from src.api.user.repository import user_repository
from src.api.user.response import UserResponse
from src.api.user.schemas import UpdateUserTokenSchema
from src.api.auth.utils import authenticate_user, create_session_id
from src.core import utils
from src.core.config import config
from src.core.database import transactional


@transactional
async def sign_in(
        request: Request,
        request_body: SignInRequest,
        db: AsyncSession
) -> UserResponse:
    # 로그인 검증
    user = await authenticate_user(request_body, user_repository, db)
    login_token = create_session_id()

    # session에 토큰, 현재 시각 등록
    request.session[config.COOKIE_NAME] = login_token
    request.session["last_activity"] = utils.datetime_to_unix_time(utils.now())
    request.session["current_user"] = user.id

    # 토큰 db에 업데이트
    user = await user_repository.update(db, db_obj=user, obj_in=UpdateUserTokenSchema.of_token(user, login_token))
    return UserResponse.of(user)


async def sign_out(request: Request) -> None:
    # session에 있는 쿠키, 현재 시각 제거
    request.session.pop(config.COOKIE_NAME, None)
    request.session.pop("last_activity", None)
