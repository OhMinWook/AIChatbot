from typing import Optional, Type, cast, List

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.crud import CRUDBase
from src.api.user.models import User
from src.api.user.schemas import CreateUserSchema, UpdateUserTokenSchema, UpdateUserSchema


class UserRepository(CRUDBase[User, CreateUserSchema, UpdateUserTokenSchema]):
    def __init__(self, model: Type[User]):
        super().__init__(model)

    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[User]:
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
    ) -> Optional[User]:
        query = select(self.model).where(cast("ColumnElement[bool]", self.model.login_id == login_id))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_login_id_and_hospital_code(
            self,
            db: AsyncSession,
            *,
            login_id: str,
            hospital_code: str
    ) -> Optional[User]:
        query = (
            select(self.model)
            .where(cast("ColumnElement[bool]", self.model.login_id == login_id))
            .where(cast("ColumnElement[bool]", self.model.hospital_code == hospital_code))
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_id_list(
            self, db: AsyncSession, *, id_list: list
    ) -> List[User]:
        query = (
            select(self.model)
            .where(self.model.id.in_(id_list))
        )
        result = await db.execute(query)
        return result.scalars().all()


user_repository = UserRepository(User)
