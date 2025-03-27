from functools import wraps
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.constants import Permission
from src.api.admin.auth.exception import PermissionDeniedException
from src.api.admin.user.repository import admin_user_repository


def permission(required_permission: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            db: AsyncSession = kwargs.get("db") or next(
                (arg for arg in args if isinstance(arg, AsyncSession)), None
            )
            request: Request = kwargs.get("request") or next(
                (arg for arg in args if isinstance(arg, Request)), None
            )

            # 현재 로그인 유저 정보 가져와 db에서 갖고있는 권한 가져오기
            current_user_no = request.session.get("current_user")

            current_user = await admin_user_repository.get_by_id(db, id=current_user_no)
            auth_bundle_list = list(map(int, current_user.auth_menu_list.split(",")))

            # 최고 관리자
            if Permission.SUPER_ADMIN.value in auth_bundle_list:
                return await func(*args, **kwargs)

            # 권한 비교
            if required_permission not in auth_bundle_list:
                raise PermissionDeniedException()

            return await func(*args, **kwargs)

        return wrapper

    return decorator
