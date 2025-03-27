from typing import Optional, List, cast

from sqlalchemy import select, and_, desc, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import coalesce

from src.api.vectordb.models import VectorDB
from src.api.vectordb.schemas import CreateVectorDBSchema, UpdateVectorDBSchema
from src.core.constants import OrderBy
from src.core.crud import CRUDBase
from src.core.pagination import Pageable


class VectorDBRepository(
    CRUDBase[VectorDB, CreateVectorDBSchema, UpdateVectorDBSchema]
):
    async def get_by_id(self, db: AsyncSession, *, id: int) -> Optional[VectorDB]:
        return await super().get_one(db, id=id)

    async def get_all_vectors(self, db: AsyncSession) -> List[VectorDB]:
        query = select(self.model).where(
            cast("ColumnElement[bool]", self.model.data_status == "Y")
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_all_manuals(
            self, db: AsyncSession, *, pageable: Pageable
    ) -> List[VectorDB]:
        filter_args = [
            self.model.data_status == "Y",
            self.model.update_dt.between(
                coalesce(pageable.start_dt, self.model.update_dt),
                coalesce(pageable.end_dt, self.model.update_dt),
            )
        ]

        if pageable.last_update_dt:
            filter_args.append(
                or_(
                    self.model.update_dt < pageable.last_update_dt,
                    and_(
                        self.model.update_dt == pageable.last_update_dt,
                        self.model.id < pageable.last_id
                    )
                )
            )

        for field_name in pageable.__class__.model_fields:
            field_value = getattr(pageable, field_name)
            if isinstance(field_value, str):
                model_column = getattr(self.model, field_name, None)
                filter_args.append(
                    model_column.like(coalesce(field_value, model_column))
                )

        query = (
            select(self.model)
            .where(and_(*filter_args))
            .order_by(self.model.update_dt.desc(), self.model.id.desc())
            .limit(pageable.page_size)
        )

        result = await db.execute(query)
        return result.scalars().fetchall()

    async def get_by_hash_id(self, db: AsyncSession, *, hash_id: str) -> VectorDB:
        query = (
            select(self.model)
            .where(cast("ColumnElement[bool]", self.model.data_status == "Y"))
            .where(cast("ColumnElement[bool]", self.model.hash_id == hash_id))
        )
        result = await db.execute(query)
        return result.scalars().one()

    async def get_by_hash_id_list(
        self, db: AsyncSession, *, hash_id_list: list
    ) -> List[VectorDB]:
        query = (
            select(self.model.id)
            .where(cast("ColumnElement[bool]", self.model.data_status == "Y"))
            .where(self.model.hash_id.in_(hash_id_list))
            .order_by(self.model.id)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_one_manual(
        self, db: AsyncSession, *, manual_name: str
    ) -> List[VectorDB]:
        where = [
            cast("ColumnElement[bool]", self.model.manual_name == manual_name),
            self.model.data_status == "Y",
        ]

        query = select(self.model).where(and_(*where)).order_by(self.model.id)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_by_id_list(
        self, db: AsyncSession, *, id_list: list
    ) -> List[VectorDB]:
        where = [self.model.data_status == "Y", self.model.id.in_(id_list)]
        query = select(self.model).where(and_(*where))
        result = await db.execute(query)
        return result.scalars().all()

    async def get_last_id(self, db: AsyncSession) -> Optional[int]:
        query = (
            select(self.model.id)
            .order_by(desc(self.model.id))
            .limit(1)
            .with_for_update()
        )
        result = await db.execute(query)
        return result.scalars().one_or_none()

    async def get_one_manual(
        self, db: AsyncSession, *, manual_name: str
    ) -> List[VectorDB]:
        where = [
            cast("ColumnElement[bool]", self.model.manual_name == manual_name),
            self.model.data_status == "Y",
        ]

        query = select(self.model).where(and_(*where)).order_by(self.model.id)
        result = await db.execute(query)
        return result.scalars().all()

    async def is_exist_by_manual_name(
        self, db: AsyncSession, *, manual_name: str
    ) -> bool:
        return True if await self.get_one_manual(db, manual_name=manual_name) else False

    async def create(
        self, db: AsyncSession, *, obj_in: CreateVectorDBSchema
    ) -> VectorDB:
        return await super().create(db, obj_in=obj_in)

    async def update(
        self, db: AsyncSession, *, db_obj: VectorDB, obj_in: UpdateVectorDBSchema
    ) -> VectorDB:
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)

    async def get_deleted_manual(self, db: AsyncSession) -> List[VectorDB]:
        query = (
            select(self.model)
            .where(cast("ColumnElement[bool]", self.model.data_status == "N"))
            .order_by(self.model.id)
        )
        result = await db.execute(query)
        return result.scalars().all()


vector_db_repository = VectorDBRepository(VectorDB)
