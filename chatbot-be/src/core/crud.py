from typing import TypeVar, Generic, Type, List, Any, Optional, Union, Dict, cast, Tuple

from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, and_, join
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import coalesce

from src.core.constants import OrderBy
from src.core.pagination import Pageable

ModelType = TypeVar('ModelType')
CreateSchemaType = TypeVar('CreateSchemaType')
UpdateSchemaType = TypeVar('UpdateSchemaType')
ResponseType = TypeVar('ResponseType')


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_one(
            self, db: AsyncSession, id: Any
    ) -> Optional[ModelType]:
        where = [cast("ColumnElement[bool]", self.model.id == id)]

        # vectordb 테이블에서 호출했다면 data_status Y인 것만 가져오도록
        if self.model.__tablename__ == "vectordb":
            where.append(self.model.data_status == "Y")

        result = await db.execute(select(self.model).where(and_(*where)))
        return result.scalars().first()

    async def get_all(
            self, db: AsyncSession, *, pageable: Pageable, order_by: int
    ) -> List[ModelType]:
        query = (
            select(self.model)
            .limit(pageable.page_size)
        )

        order = self.model.id.asc() if order_by == OrderBy.ASC.value else self.model.id.desc()
        query = query.order_by(order)

        if pageable.last_id != 0:
            last_id_condition = self.model.id > pageable.last_id if order_by == OrderBy.ASC.value else self.model.id < pageable.last_id
            query = query.where(last_id_condition)

        result = await db.execute(query)
        return result.scalars().fetchall()

    async def get_all_filter(
            self, db: AsyncSession, *, pageable: Pageable, order_by: int
    ) -> tuple[List[ModelType], int]:
        filter_args = []
        if pageable.last_id != 0:
            filter_args.append(self.model.id < pageable.last_id)

        for field_name in pageable.__class__.model_fields:
            field_value = getattr(pageable, field_name)
            if field_name in ["last_id", "page_size"]:
                continue
            elif field_name in ["start_dt", "end_dt"]:
                filter_args.append(
                    self.model.update_dt.between(
                        coalesce(pageable.start_dt, self.model.update_dt),
                        coalesce(pageable.end_dt, self.model.update_dt),
                    )
                )
            elif isinstance(field_value, str):
                model_column = getattr(self.model, field_name, None)
                filter_args.append(
                    model_column.like(
                        coalesce(field_value, model_column)
                    )
                )
            else:
                model_column = getattr(self.model, field_name, None)
                filter_args.append(model_column == coalesce(field_value, model_column))

        # vectordb 테이블에서 호출했다면 data_status Y인 것만 가져오도록
        if self.model.__tablename__ == "vectordb":
            filter_args.append(self.model.data_status == "Y")

        query = (
            select(self.model)
            .where(and_(*filter_args))
            .limit(pageable.page_size)
        )
        order = self.model.update_dt.asc() if order_by == OrderBy.ASC.value else self.model.update_dt.desc()
        query = query.order_by(order)

        result = await db.execute(query)
        return result.scalars().fetchall()

    async def get_with_joins(
            self,
            db: AsyncSession,
            join_models: List[Tuple[Type[Any], Any]],
            *,
            filters: Optional[List[Any]] = None,
            limit: int = 5
    ) -> List[Dict[str, Any]]:
        from_clause = self.model

        for join_model, join_condition in join_models:
            from_clause = join(from_clause, join_model, join_condition, isouter=True)

        base_query = select(self.model, *[join_model for join_model, _ in join_models]).select_from(from_clause)

        query = base_query.select_from(from_clause)

        if filters:
            for filter_condition in filters:
                query = query.where(filter_condition)

        query = query.order_by(self.model.id.desc()).limit(limit)
        result = await db.execute(query)
        return result.mappings().all()

    async def get_all_filter_with_joins(
            self,
            db: AsyncSession,
            join_models: List[Tuple[Type[Any], Any]],
            *,
            pageable: Pageable,
            order_by: int,
            sort_by: Optional[ModelType] = None,
            filters: Optional[List[Any]] = None
    ) -> List[Dict[str, Any]]:
        from_clause = self.model
        filter_args = []

        if sort_by is None:
            sort_by = self.model.id

        filter_args.append(
            self.model.creation_dt.between(
                coalesce(pageable.start_dt, self.model.creation_dt),
                coalesce(pageable.end_dt, self.model.creation_dt),
            )
        )

        for field_name in pageable.__class__.model_fields:
            field_value = getattr(pageable, field_name)
            if field_name in ["last_id", "page_size", "start_dt", "end_dt"]:
                continue
            elif isinstance(field_value, str):
                model_column = getattr(self.model, field_name, None)
                filter_args.append(
                    model_column.like(
                        coalesce(field_value, model_column)
                    )
                )
            else:
                model_column = getattr(self.model, field_name, None)
                filter_args.append(model_column == coalesce(field_value, model_column))

        for join_model, join_condition in join_models:
            from_clause = join(from_clause, join_model, join_condition, isouter=True)

        query = (
            select(self.model, *[join_model for join_model, _ in join_models])
            .select_from(from_clause)
            .where(and_(*filter_args))
            .limit(pageable.page_size)
        )

        order = sort_by.asc() if order_by == OrderBy.ASC.value else sort_by.desc()
        query = query.order_by(order)

        if pageable.last_id != 0:
            last_id_condition = sort_by > pageable.last_id if order_by == OrderBy.ASC.value else sort_by < pageable.last_id
            query = query.where(last_id_condition)

        if filters:
            query = query.where(and_(*filters))

        result = await db.execute(query)
        return result.mappings().fetchall()

    async def create(
            self, db: AsyncSession, *, obj_in: ModelType
    ) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def bulk_create(
            self, db: AsyncSession, *, objs_in: List[ModelType]
    ) -> List[ModelType]:
        db_objs = []
        # count = 0
        for obj_in in objs_in:
            # if count == 2:
            #     raise Exception()
            obj_in_data = jsonable_encoder(obj_in)
            db_obj = self.model(**obj_in_data)
            db.add(db_obj)
            db_objs.append(db_obj)
            # count += 1

        for db_obj in db_objs:
            await db.flush()
            await db.refresh(db_obj)

        return db_objs

    async def update(
            self,
            db: AsyncSession,
            *,
            db_obj: ModelType,
            obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        update_data.pop("id", None)
        for field in obj_data:
            if field in update_data and update_data[field] is not None:
                setattr(db_obj, field, update_data[field])
        await db.merge(db_obj)
        return db_obj

    async def bulk_update(
            self,
            db: AsyncSession,
            *,
            db_objs: List[ModelType],
            objs_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> List[ModelType]:
        for db_obj, obj_in in zip(db_objs, objs_in):
            obj_data = jsonable_encoder(db_obj)
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.dict(exclude_unset=True)
            update_data.pop("id", None)
            for field in obj_data:
                if field in update_data:
                    setattr(db_obj, field, update_data[field])
            await db.merge(db_obj)
        return db_objs

    async def delete(self, db: AsyncSession, *, id: int) -> ModelType:
        result = await db.execute(select(self.model).where(cast("ColumnElement[bool]", self.model.id == id)))
        obj = result.mappings().fetchone()
        if obj is None:
            raise Exception("Not Found")
        await db.delete(obj)
        return obj

    async def bulk_delete(self, db: AsyncSession, *, id_list: list) -> ModelType:
        # 아래와 동일
        # await db.execute(
        #   delete(self.model).where(self.model.id.in_(id_list)).execution_options(synchronize_session="fetch")
        # )
        result = await db.execute(select(self.model).where(self.model.id.in_(id_list)))
        objs = result.scalars().all()
        if objs is None:
            raise Exception("Not Found")
        for obj in objs:
            await db.delete(obj)
        return objs
