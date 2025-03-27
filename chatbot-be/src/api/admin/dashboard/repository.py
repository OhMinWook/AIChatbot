from typing import Optional, List, Sequence, cast

from sqlalchemy import func, select, RowMapping, and_, case, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import coalesce

from src.api.admin.dashboard.constants import UsqtyType
from src.api.admin.dashboard.models import UsageQuantity
from src.api.admin.dashboard.request import UseSummarySearchParam, AdminUseSummarySearchParam, UserUseSummarySearchParam
from src.api.admin.dashboard.schemas import CreateUsageQuantitySchema, UpdateUsageQuantitySchema
from src.api.admin.user.models import BOUser
from src.api.chatbot.models import Chatbot
from src.api.preprocessing.models import Preprocessing
from src.api.user.models import User
from src.api.vectordb.models import VectorDB
from src.core.crud import CRUDBase
from src.core.pagination import Pageable


class UserUseRepository(CRUDBase[UsageQuantity, CreateUsageQuantitySchema, UpdateUsageQuantitySchema]):
    async def get_user_use_summary(
            self,
            db: AsyncSession,
            params: UserUseSummarySearchParam
    ) -> Sequence[RowMapping]:
        date_filter = params.date_filter
        detail_filter = params.detail_filter

        date_columns = []
        detail_columns = []
        group_by_columns = []
        where_columns = [
            self.model.usqty_type == UsqtyType.USER.value,
            self.model.creation_dt.between(
                coalesce(params.start_dt, self.model.creation_dt),
                coalesce(params.end_dt, self.model.creation_dt)
            )
        ]

        if params.last_id != 0:
            where_columns.append(self.model.id < params.last_id)

        # 날짜 기준 통계
        if date_filter == "year":
            date_columns.append(func.date_format(self.model.creation_dt, "%Y"))
        elif date_filter == "month":
            date_columns.append(func.date_format(self.model.creation_dt, "%Y.%m"))
        elif date_filter == "day":
            date_columns.append(func.date_format(self.model.creation_dt, "%Y.%m.%d"))
        elif date_filter == "all":
            date_columns.append('-')

        # 상세 기준 통계
        if detail_filter == "hospital":
            detail_columns.append(User.hospital_name.label("detail"))
            group_by_columns.append(User.hospital_name)

        if detail_filter == "call_path":
            detail_columns.append(Chatbot.call_path.label("detail"))
            group_by_columns.append(Chatbot.call_path)

        if detail_filter == "all":
            detail_columns.append(func.concat("전체").label("detail"))

        # 공통 쿼리
        query = (
            select(
                func.concat(*date_columns).label('date'),
                func.sum(self.model.use_token_cnt).label('total_token_cnt'),
                func.sum(self.model.use_amount).label('total_use_amount'),
                *detail_columns
            )
            .select_from(self.model)
            .join(Chatbot, Chatbot.id == UsageQuantity.type_id)
            .join(User, Chatbot.user_id == User.id)
            .where(and_(*where_columns))
            .limit(params.page_size)
        )

        # 해당 하는 경우, group by 추가
        if group_by_columns or date_columns:
            query = query.group_by(func.concat(*date_columns), *group_by_columns)

        if date_filter in ("year", "month", "day"):
            query = query.order_by("detail", desc("date"))
        else:
            query = query.order_by(desc("detail"))

        result = await db.execute(query)
        return result.mappings().fetchall()


class AdminUseRepository(CRUDBase[UsageQuantity, CreateUsageQuantitySchema, UpdateUsageQuantitySchema]):
    async def get_admin_all_use(
            self,
            db: AsyncSession,
            params: Pageable
    ) -> Sequence[RowMapping]:
        filters = [
            UsageQuantity.usqty_type.in_([UsqtyType.PREPROCESSING.value, UsqtyType.EMBEDDING.value]),
            UsageQuantity.creation_dt.between(
                coalesce(params.start_dt, UsageQuantity.creation_dt),
                coalesce(params.end_dt, UsageQuantity.creation_dt),
            )
        ]
        if params.last_id != 0:
            filters.append(self.model.id < params.last_id)

        query = (
            select(
                self.model.id,
                case(
                    (self.model.usqty_type == UsqtyType.PREPROCESSING.value, Preprocessing.screen_id),
                    (self.model.usqty_type == UsqtyType.EMBEDDING.value, VectorDB.screen_id),
                    else_="N/A"  # join 된 데이터 없는 경우
                ).label("screen_id"),
                case(
                    (self.model.usqty_type == UsqtyType.PREPROCESSING.value, Preprocessing.manual_name),
                    (self.model.usqty_type == UsqtyType.EMBEDDING.value, VectorDB.manual_name),
                    else_="N/A").label("manual_name"),
                self.model.creation_dt,
                self.model.usqty_type,
                self.model.use_token_cnt,
                self.model.use_amount,
                BOUser.name
            )
            .select_from(self.model)
            .join(BOUser, UsageQuantity.creation_id == BOUser.id)
            .outerjoin(
                Preprocessing,
                (UsageQuantity.usqty_type == UsqtyType.PREPROCESSING.value) &
                (UsageQuantity.type_id == Preprocessing.id)
            )
            .outerjoin(
                VectorDB,
                (UsageQuantity.usqty_type == UsqtyType.EMBEDDING.value) &
                (UsageQuantity.type_id == VectorDB.id) &
                (VectorDB.data_status == "Y")
            )
            .where(and_(*filters))
            .order_by(desc(UsageQuantity.creation_dt))
            .limit(params.page_size)
        )
        result = await db.execute(query)  # 상세 데이터
        return result.mappings().fetchall()

    async def get_admin_use_summary(
            self,
            db: AsyncSession,
            params: AdminUseSummarySearchParam
    ) -> Sequence[RowMapping]:
        date_filter = params.date_filter
        detail_filter = params.detail_filter

        date_columns = []
        detail_columns = []
        group_by_columns = []
        where_columns = [
            UsageQuantity.usqty_type.in_([UsqtyType.PREPROCESSING.value, UsqtyType.EMBEDDING.value]),
            UsageQuantity.creation_dt.between(
                coalesce(params.start_dt, UsageQuantity.creation_dt),
                coalesce(params.end_dt, UsageQuantity.creation_dt)
            )
        ]

        if params.last_id != 0:
            where_columns.append(self.model.id < params.last_id)

        # 날짜 기준 통계
        if date_filter == "year":
            date_columns.append(func.date_format(self.model.creation_dt, "%Y"))
        elif date_filter == "month":
            date_columns.append(func.date_format(self.model.creation_dt, "%Y.%m"))
        elif date_filter == "day":
            date_columns.append(func.date_format(self.model.creation_dt, "%Y.%m.%d"))
        elif date_filter == "all":
            date_columns.append('-')

        # 상세 기준 통계
        if detail_filter == "admin":
            detail_columns.append(BOUser.name.label("detail"))
            group_by_columns.append(BOUser.name)

        if detail_filter == "type":
            detail_columns.append(UsageQuantity.usqty_type.label("detail"))
            group_by_columns.append(UsageQuantity.usqty_type)

        if detail_filter == "all":
            detail_columns.append(func.concat("전체").label("detail"))

        # 공통 쿼리
        query = (
            select(
                func.concat(*date_columns).label('date'),
                func.sum(UsageQuantity.use_token_cnt).label('total_token_cnt'),
                func.sum(UsageQuantity.use_amount).label('total_use_amount'),
                *detail_columns
            )
            .select_from(UsageQuantity)
            .outerjoin(BOUser, UsageQuantity.creation_id == BOUser.id)
            .where(and_(*where_columns))
            .limit(params.page_size)
        )

        # 해당 하는 경우, group by 추가
        if group_by_columns or date_columns:
            query = query.group_by(func.concat(*date_columns), *group_by_columns)

        if date_filter in ("year", "month", "day"):
            query = query.order_by("detail", desc("date"))
        else:
            query = query.order_by("detail")

        result = await db.execute(query)
        return result.mappings().fetchall()


class UsageQuantityRepository(CRUDBase[UsageQuantity, CreateUsageQuantitySchema, UpdateUsageQuantitySchema]):
    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[UsageQuantity]:
        admin = await super().get_one(db, id=id)
        return admin

    async def create(
            self,
            db: AsyncSession,
            *,
            obj_in: CreateUsageQuantitySchema
    ) -> UsageQuantity:
        db_obj = await super().create(db, obj_in=obj_in)
        return db_obj

    async def update(
            self,
            db: AsyncSession,
            *,
            db_obj: UsageQuantity,
            obj_in: UpdateUsageQuantitySchema
    ) -> UsageQuantity:
        db_obj = await super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj

    async def bulk_delete(self, db: AsyncSession, *, id_list: list) -> UsageQuantity:
        db_obj = await super().bulk_delete(db, id_list=id_list)
        return db_obj

    async def get_first_entry_by_type(
            self,
            db: AsyncSession,
            usqty_type: List[UsqtyType]
    ) -> RowMapping:
        query = (
            select(
                UsageQuantity.creation_dt
            )
            .where(UsageQuantity.usqty_type.in_([t.value for t in usqty_type]))
            .order_by(UsageQuantity.id)
            .limit(1)
        )

        result = await db.execute(query)
        return result.mappings().fetchone()


user_use_repository = UserUseRepository(UsageQuantity)
admin_use_repository = AdminUseRepository(UsageQuantity)
usage_repository = UsageQuantityRepository(UsageQuantity)
