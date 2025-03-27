from typing import Optional, List, cast

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.preprocessing.models import Preprocessing
from src.api.preprocessing.schemas import CreatePreprocessingSchema, UpdatePreprocessingSchema
from src.core.crud import CRUDBase


class PreprocessingRepository(CRUDBase[Preprocessing, CreatePreprocessingSchema, UpdatePreprocessingSchema]):
    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[Preprocessing]:
        return await super().get_one(db, id=id)

    async def get_one_manual(
            self, db: AsyncSession, *, manual_name: str
    ) -> List[Preprocessing]:
        query = (
            select(self.model)
            .where(cast("ColumnElement[bool]", self.model.manual_name == manual_name))
            .order_by(self.model.id)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_one_manual_by_set_id(
            self, db: AsyncSession, *, set_id: int
    ) -> List[Preprocessing]:
        sub_query = (
            select(self.model.manual_name)
            .where(cast("ColumnElement[bool]", self.model.set_id == set_id))
            .limit(1)
            .scalar_subquery()
        )
        query = (
            select(self.model)
            .where(cast("ColumnElement[bool]", self.model.manual_name == sub_query))
            .where(cast("ColumnElement[bool]", self.model.set_id == set_id))
            .order_by(self.model.id)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_last_set_id(self, db: AsyncSession) -> Optional[Preprocessing]:
        query = select(self.model.set_id).order_by(desc(self.model.set_id)).limit(1).with_for_update()
        result = await db.execute(query)
        return result.scalars().one_or_none()

    async def create(
            self,
            db: AsyncSession,
            *,
            obj_in: CreatePreprocessingSchema
    ) -> Preprocessing:
        return await super().create(db, obj_in=obj_in)

    async def update(
            self,
            db: AsyncSession,
            *,
            db_obj: Preprocessing,
            obj_in: UpdatePreprocessingSchema
    ) -> Preprocessing:
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)


preprocessing_repository = PreprocessingRepository(Preprocessing)
