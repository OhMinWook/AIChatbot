from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter, Response, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.auth.router import admin_auth
from src.api.admin.common.router import common
from src.api.admin.dashboard.router import use_dashboard
from src.api.admin.manual.router import manual
from src.api.admin.user.router import admin_user
from src.api.auth.router import auth
from src.api.auth.infrastructure import init_middleware
from src.api.chatbot.router import chatbot
from src.core.config import config
from src.core.database import get_db
from src.core.exception import init_listeners
from src.core.custom_logger import log_config
from src.api.admin.answer.router import admin_answer


def auth_check():
    return Response(content="OK", media_type="text/plain")


def health_check():
    return Response(content="OK", media_type="text/plain")


async def database_check(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(1))
    return result.scalar()


def init_routers(
        app: FastAPI,
) -> None:
    router = APIRouter()
    router.add_api_route(path="/auth-check", methods=["GET"], endpoint=auth_check)
    router.add_api_route(path="/health-check", methods=["GET"], endpoint=health_check)
    router.add_api_route(path="/database-check", methods=["GET"], endpoint=database_check)
    app.include_router(auth, prefix="/auth", tags=["auth"])
    app.include_router(chatbot, prefix="/chatbot", tags=["chatbot"])

    app.include_router(common, prefix="/admin/common", tags=["admin-common"])
    app.include_router(admin_auth, prefix="/admin/auth", tags=["admin-auth"])
    app.include_router(admin_answer, prefix="/admin/answer", tags=["admin-answer"])
    app.include_router(admin_user, prefix="/admin/user", tags=["admin-user"])
    app.include_router(manual, prefix="/admin/manual", tags=["admin-manual"])
    app.include_router(use_dashboard, prefix="/admin/dashboard/use", tags=["admin-use"])

    app.include_router(router)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log_config()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Huniverse",
        description="Hide API",
        version="1.0.0",
        lifespan=lifespan,
        docs_url=None if config.ENV == "production" else "/docs",
        redoc_url=None if config.ENV == "production" else "/redoc"
    )

    init_routers(app=app)
    init_listeners(app=app)
    init_middleware(app=app)
    return app


app = create_app()
