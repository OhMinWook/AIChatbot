from typing import Optional, cast, List, Union

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.api.admin.user.schemas import CreateBOUserSchema, UpdateBOUserTokenSchema, UpdateBOUserSchema
from src.core.crud import CRUDBase
from src.api.admin.user.models import BOUser


class AdminUserRepository(CRUDBase[BOUser, CreateBOUserSchema, UpdateBOUserTokenSchema]):
    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[BOUser]:
        return await super().get_one(db, id=id)

    async def get_token_by_id(
            self,
            db: AsyncSession,
            *,
            user_id: str
    ) -> str:
        query = select(self.model.login_token).where(cast("ColumnElement[bool]", self.model.id == user_id))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_login_id(
            self,
            db: AsyncSession,
            *,
            login_id: str
    ) -> Optional[BOUser]:
        query = select(self.model).where(cast("ColumnElement[bool]", self.model.login_id == login_id))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_id_list(
            self, db: AsyncSession, *, id_list: list
    ) -> List[BOUser]:
        query = (
            select(self.model)
            .where(self.model.id.in_(id_list))
            .where(self.model.auth_menu_list.notlike("%1%"))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def create(
            self,
            db: AsyncSession,
            *,
            obj_in: CreateBOUserSchema
    ) -> BOUser:
        return await super().create(db, obj_in=obj_in)

    async def update(
            self,
            db: AsyncSession,
            *,
            db_obj: BOUser,
            obj_in: Union[UpdateBOUserTokenSchema, UpdateBOUserSchema]
    ) -> BOUser:
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)


admin_user_repository = AdminUserRepository(BOUser)
