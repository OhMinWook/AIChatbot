from datetime import datetime
from typing import Optional

from src.api.admin.user.request import CreateAdminRequest
from src.api.auth.utils import get_password_hash
from src.core import utils

from src.api.admin.user.models import BOUser as BOUserModel
from src.core.schemas import OrmBase


class BOUser(OrmBase):
    id: int
    login_id: str
    password: str
    name: Optional[str]
    dept_name: Optional[str]
    tel_no: Optional[str]
    auth_menu_list: Optional[str]
    login_token: Optional[str]
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime


class CreateBOUserSchema(OrmBase):
    login_id: str
    password: str
    name: str
    dept_name: str
    tel_no: str
    auth_menu_list: str
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime

    def to_dict(self) -> dict:
        return {k: v for k, v in vars(self).items() if v is not None}

    @staticmethod
    def of(request: CreateAdminRequest, user_id: int) -> "CreateBOUserSchema":
        return CreateBOUserSchema(
            login_id=request.login_id,
            password=get_password_hash(request.password),
            name=request.name,
            dept_name=request.dept_name,
            tel_no=request.tel_no,
            auth_menu_list=request.auth_menu_list,
            creation_id=user_id,
            update_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )


class UpdateBOUserTokenSchema(OrmBase):
    id: int
    login_token: str
    update_id: int
    update_dt: datetime

    def to_dict(self) -> dict:
        return {k: v for k, v in vars(self).items() if v is not None}

    @staticmethod
    def of(user: BOUserModel, login_token: Optional[str] = None) -> "UpdateBOUserTokenSchema":
        return UpdateBOUserTokenSchema(
            id=user.id,
            login_id=user.login_id,
            password=user.password,
            name=user.name,
            dept_name=user.dept_name,
            tel_no=user.tel_no,
            auth_menu_list=user.auth_menu_list,
            login_token=login_token if login_token else user.login_token,
            update_id=user.id,
            update_dt=utils.now()
        )


class UpdateBOUserSchema(OrmBase):
    id: int
    password: Optional[str]
    name: str
    dept_name: str
    tel_no: str
    auth_menu_list: str
    update_id: int
    update_dt: datetime

    def to_dict(self) -> dict:
        return {k: v for k, v in vars(self).items() if v is not None}

    @staticmethod
    def of(update_data: dict, update_id: int) -> "UpdateBOUserSchema":
        return UpdateBOUserSchema(
            id=update_data["admin_id"],
            password=get_password_hash(update_data["password"]) if update_data["password"] else None,
            name=update_data["name"],
            dept_name=update_data["dept_name"],
            tel_no=update_data["tel_no"],
            auth_menu_list=update_data["auth_menu_list"],
            update_id=update_id,
            update_dt=utils.now()
        )
