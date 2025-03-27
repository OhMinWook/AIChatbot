from typing import List

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.constants import Permission
from src.api.admin.auth.utils import permission
from src.api.admin.dashboard.constants import UsqtyType
from src.api.admin.dashboard.exception import DataNotFound
from src.api.admin.dashboard.models import UsageQuantity
from src.api.admin.dashboard.repository import user_use_repository, admin_use_repository, usage_repository
from src.api.admin.dashboard.request import UseSummarySearchParam, UserUseSummarySearchParam, AdminUseSummarySearchParam
from src.api.admin.dashboard.response import UserUseResponse, UseSummaryResponse, AdminUseResponse, \
    UserUseDetailResponse
from src.api.chatbot.models import Chatbot
from src.api.user.models import User
from src.core import utils
from src.core.constants import OrderBy
from src.core.database import transactional
from src.core.pagination import Pageable


@transactional
@permission(Permission.TokenDashboard.value)
async def get_user_all_use(
        db: AsyncSession,
        request: Request,
        params: Pageable
) -> List[UserUseResponse]:
    join_models = [
        (Chatbot, UsageQuantity.type_id == Chatbot.id),
        (User, Chatbot.user_id == User.id)
    ]
    filters = [UsageQuantity.usqty_type == UsqtyType.USER.value]
    datas = await user_use_repository.get_all_filter_with_joins(
        db, join_models=join_models, pageable=params,
        order_by=OrderBy.DESC.value, filters=filters
    )
    return [UserUseResponse.of(data) for data in datas]


@transactional
@permission(Permission.TokenDashboard.value)
async def get_user_use_summary(
        db: AsyncSession,
        request: Request,
        params: UserUseSummarySearchParam
) -> List[UseSummaryResponse]:
    datas = await user_use_repository.get_user_use_summary(db=db, params=params)

    if params.start_dt is None:
        first_entry = await usage_repository.get_first_entry_by_type(db=db, usqty_type=[UsqtyType.USER])
        if not first_entry:
            return []
        start_dt = first_entry.creation_dt
    else:
        start_dt = params.start_dt

    return [
        UseSummaryResponse.of(
            start_dt=start_dt,
            end_dt=params.end_dt if params.end_dt else utils.now(),
            data=data
        ) for data in datas
    ]


@transactional
@permission(Permission.TokenDashboard.value)
async def get_user_use(
        db: AsyncSession,
        request: Request,
        use_id: int
) -> UserUseDetailResponse:
    join_models = [
        (Chatbot, UsageQuantity.type_id == Chatbot.id),
        (User, Chatbot.user_id == User.id)
    ]
    filters = [
        UsageQuantity.usqty_type == UsqtyType.USER.value,
        UsageQuantity.id == use_id
    ]
    data = await user_use_repository.get_with_joins(
        db, join_models=join_models, filters=filters, limit=1)
    if not data:
        raise DataNotFound()
    return UserUseDetailResponse.of(data[0])


@transactional
@permission(Permission.TokenDashboard.value)
async def get_admin_all_use(
        db: AsyncSession,
        request: Request,
        params: Pageable
) -> List[AdminUseResponse]:
    datas = await admin_use_repository.get_admin_all_use(db, params=params)
    return [AdminUseResponse.of(data) for data in datas]


@transactional
@permission(Permission.TokenDashboard.value)
async def get_admin_use_summary(
        db: AsyncSession,
        request: Request,
        params: AdminUseSummarySearchParam
) -> List[UseSummaryResponse]:
    datas = await admin_use_repository.get_admin_use_summary(db=db, params=params)

    if params.start_dt is None:
        first_entry = await usage_repository.get_first_entry_by_type(
            db=db, usqty_type=[UsqtyType.PREPROCESSING, UsqtyType.EMBEDDING]
        )
        if not first_entry:
            return []
        start_dt = first_entry.creation_dt
    else:
        start_dt = params.start_dt

    return [
        UseSummaryResponse.of(
            start_dt=start_dt,
            end_dt=params.end_dt if params.end_dt else utils.now(),
            data=data
        ) for data in datas
    ]
