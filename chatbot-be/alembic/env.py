import asyncio
import importlib
import os
from logging.config import fileConfig

from sqlalchemy import pool

from alembic import context
from sqlalchemy.ext.asyncio import async_engine_from_config

from src.core.config import config as api_config
from src.core.database import Base
from src.core.model import Model
from src.api.user.models import User

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

if not config.get_main_option('sqlalchemy.url'):
    config.set_main_option(
        'sqlalchemy.url',
        'mysql+asyncmy://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}'.format(
            MYSQL_USER=api_config.MYSQL_USER,
            MYSQL_PASSWORD=api_config.MYSQL_PASSWORD,
            MYSQL_HOST=api_config.MYSQL_HOST,
            MYSQL_PORT=api_config.MYSQL_PORT,
            MYSQL_DATABASE=api_config.MYSQL_DATABASE
        )
    )

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 모델이 정의된 디렉토리
models_directory = os.path.join(os.path.dirname(__file__), '..', 'src')

# 디렉토리 내 모든 'models.py' 파일을 임포트
for root, dirs, files in os.walk(models_directory):
    for file in files:
        if file == "models.py":
            # 모듈의 절대 경로 생성
            module_path = os.path.relpath(root, os.path.dirname(__file__))
            module_path = module_path.replace(os.path.sep, '.')

            # 루트 패키지에 맞게 조정
            if module_path.startswith('...'):
                module_path = module_path[3:]

            # 절대 경로를 사용하여 모듈 임포트
            importlib.import_module(f"{module_path}.models")


# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations():
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
