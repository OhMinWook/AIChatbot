from typing import List

from fastapi import Request

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.constants import Permission
from src.api.admin.auth.utils import permission
from src.api.admin.user.exception import (
    AdminException,
    AdminNotFoundException,
)
from src.api.admin.user.repository import admin_user_repository

from src.api.admin.user.request import (
    CreateAdminRequest,
    UpdateAdminRequest,
    CreateUserRequest,
    UpdateUserRequest,
)
from src.api.admin.user.response import AdminResponse, AdminDetailResponse
from src.api.admin.user.schemas import CreateBOUserSchema, UpdateBOUserSchema
from src.api.user.exceptions import UserNotFoundException
from src.api.user.repository import user_repository
from src.api.user.response import UserResponse, UserDetailResponse
from src.api.user.schemas import (
    CreateUserSchema,
    UpdateUserTokenSchema,
    UpdateUserSchema,
)
from src.core.constants import OrderBy

from src.core.database import transactional
from src.core.pagination import Pageable


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def get_all_admin(
    db: AsyncSession, request: Request, request_body: Pageable
) -> List[AdminResponse]:
    admin_users = await admin_user_repository.get_all(
        db, pageable=request_body, order_by=OrderBy.ASC.value
    )
    return [AdminResponse.of(admin_user) for admin_user in admin_users]


@transactional
# @permission(Permission.SUPER_ADMIN.value)
async def get_admin_detail(
    db: AsyncSession, request: Request, admin_id: int
) -> AdminDetailResponse:
    admin = await admin_user_repository.get_by_id(db, id=admin_id)
    if not admin:
        raise AdminNotFoundException()
    return AdminDetailResponse.of(admin)


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def create_admin(
    db: AsyncSession,
    request: Request,
    request_body: CreateAdminRequest,
) -> None:
    current_user_id = request.session.get("current_user")
    if request_body.password != request_body.password_check:
        raise AdminException("Password mismatch")
    admin = await admin_user_repository.get_by_login_id(
        db, login_id=request_body.login_id
    )
    if admin:
        raise AdminException("User already exists")
    await admin_user_repository.create(
        db, obj_in=CreateBOUserSchema.of(request_body, current_user_id)
    )


@transactional
# @permission(Permission.SUPER_ADMIN.value)
async def update_admin(
    db: AsyncSession, request: Request, request_body: UpdateAdminRequest
) -> None:
    current_user_id = request.session.get("current_user")
    if not current_user_id:
        raise AdminException("User not authenticated")

    # 현재 사용자 검증
    current_user = await user_repository.get_by_id(db, id=current_user_id)
    if not current_user:
        raise AdminException("User not found")
    if request_body.password != request_body.password_check:
        raise AdminException("Password mismatch")
    admin = await admin_user_repository.get_by_id(db, id=request_body.admin_id)
    if not admin:
        raise AdminNotFoundException()
    update_data = request_body.model_dump()
    await admin_user_repository.update(
        db, db_obj=admin, obj_in=UpdateBOUserSchema.of(update_data, current_user_id)
    )


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def delete_admin(db: AsyncSession, request: Request, id_list: str) -> None:
    try:
        # id_list "1, 2, 3" -> , 기준으로 잘라 공백 제거 후 int 형으로 바꿔 list에
        id_list = [
            int(admin_id.strip())
            for admin_id in id_list.split(",")
            if admin_id.strip().isdigit()
        ]
    except ValueError:
        raise AdminException("id list's element is not a valid number")

    # id_list에 있는 관리자를 전체 가져옴, 근데 최고 관리자인 경우 제외 (프론트에서 예외처리 하지만 혹시 몰라..)
    admins = await admin_user_repository.get_by_id_list(db, id_list=id_list)
    admin_ids = [admin.id for admin in admins]
    await admin_user_repository.bulk_delete(db, id_list=admin_ids)


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def get_all_user(
    db: AsyncSession, request: Request, request_body: Pageable
) -> List[UserResponse]:
    users = await user_repository.get_all(
        db, pageable=request_body, order_by=OrderBy.ASC.value
    )
    return [UserResponse.of(user) for user in users]


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def get_user_detail(
    db: AsyncSession, request: Request, user_id: int
) -> UserDetailResponse:
    user = await user_repository.get_by_id(db, id=user_id)
    if not user:
        raise UserNotFoundException()
    return UserDetailResponse.of(user)


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def create_user(
    db: AsyncSession,
    request: Request,
    request_body: CreateUserRequest,
) -> None:
    current_user_id = request.session.get("current_user")
    if request_body.password != request_body.password_check:
        raise AdminException("Password mismatch")
    is_duplicate = await user_repository.get_by_login_id_and_hospital_code(
        db, login_id=request_body.login_id, hospital_code=request_body.hospital_code
    )
    if is_duplicate:
        raise AdminException("hospital code and login id duplicatd")
    await user_repository.create(
        db, obj_in=CreateUserSchema.of(request_body, current_user_id)
    )


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def update_user(
    db: AsyncSession, request: Request, request_body: UpdateUserRequest
) -> None:
    current_user_id = request.session.get("current_user")
    if request_body.password != request_body.password_check:
        raise AdminException("Password mismatch")
    user = await user_repository.get_by_id(db, id=request_body.user_id)
    if not user:
        raise UserNotFoundException()

    # 항상 value가 오기 때문에 본인 인지 check 후 중복이 있으면 exception raise
    is_duplicate = await user_repository.get_by_login_id_and_hospital_code(
        db, login_id=user.login_id, hospital_code=request_body.hospital_code
    )
    if is_duplicate and is_duplicate.id != request_body.user_id:
        raise AdminException("hospital code duplicated")

    update_data = request_body.model_dump()

    await user_repository.update(
        db, db_obj=user, obj_in=UpdateUserSchema.of(update_data, current_user_id)
    )


@transactional
@permission(Permission.SUPER_ADMIN.value)
async def delete_user(db: AsyncSession, request: Request, id_list: str) -> None:
    try:
        # id_list "1, 2, 3" -> , 기준으로 잘라 공백 제거 후 int 형으로 바꿔 list에
        id_list = [
            int(user_id.strip())
            for user_id in id_list.split(",")
            if user_id.strip().isdigit()
        ]
    except ValueError:
        raise AdminException("id list's element is not a valid number")

    # id_list에 있는 관리자를 전체 가져옴, 근데 최고 관리자인 경우 제외 (프론트에서 예외처리 하지만 혹시 몰라..)
    users = await user_repository.get_by_id_list(db, id_list=id_list)
    user_ids = [user.id for user in users]
    await user_repository.bulk_delete(db, id_list=user_ids)
