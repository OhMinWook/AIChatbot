from __future__ import annotations

import asyncio
from contextvars import ContextVar
from functools import wraps
from typing import Union, Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_scoped_session, async_sessionmaker
)

from sqlalchemy.orm import declarative_base

from src.core.config import config

session_context: ContextVar[str] = ContextVar("session_context")
Base = declarative_base()


engine = create_async_engine(config.DB_URL, pool_recycle=3600, echo=False)
async_session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

session: Union[AsyncSession, async_scoped_session] = async_scoped_session(
    session_factory=async_session_factory,
    scopefunc=asyncio.current_task
)


# @asynccontextmanager
# TODO: 원래 위 데코레이터 붙였는데 fastapi Depends()를 사용하여 의존성 주입을 하게 되면
#  중복으로 되면서 AsyncSession 객체가 아니라 _AsyncGeneratorContextManager가 주입되어 에러 발생했음
#  -> 위 데코레이터 떼니까 AsyncSession로 잘 주입되었음..
async def get_db() -> AsyncSession:
    async with session() as db:
        try:
            yield db
        finally:
            await db.close()

# db_session import 해서 쓰면 Depends(get_db) 안써도 된다!
db_session = Annotated[AsyncSession, Depends(get_db)]


def transactional(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        db = next((arg for arg in args if isinstance(arg, AsyncSession)), None) or kwargs.get('db')
        if not db:
            raise ValueError("AsyncSession instance 존재 x")
        if not db.in_transaction():
            async with db.begin_nested():
                try:
                    result = await func(*args, **kwargs)
                    await db.commit()
                    return result
                except Exception as e:
                    await db.rollback()
                    raise e
        else:
            return await func(*args, **kwargs)

    return wrapper
