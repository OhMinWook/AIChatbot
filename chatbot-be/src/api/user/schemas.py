from datetime import datetime
from typing import Optional

from src.api.admin.user.request import CreateUserRequest
from src.api.auth.utils import get_password_hash
from src.core import utils
from src.core.schemas import OrmBase

from src.api.user.models import User as UserModel


class User(OrmBase):
    id: int
    hospital_code: str
    login_id: str
    password: str
    name: Optional[str]
    hospital_name: Optional[str]
    dept_name: Optional[str]
    login_token: Optional[str]
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime


class CreateUserSchema(OrmBase):
    hospital_code: str
    login_id: str
    password: str
    name: Optional[str]
    hospital_name: Optional[str]
    dept_name: Optional[str]
    login_token: Optional[str]
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime

    @staticmethod
    def of(request: CreateUserRequest, user_id: int) -> "CreateUserSchema":
        return CreateUserSchema(
            hospital_code=request.hospital_code,
            login_id=request.login_id,
            password=get_password_hash(request.password),
            name=request.name,
            hospital_name=request.hospital_name,
            dept_name=request.dept_name,
            login_token=None,
            creation_id=user_id,
            update_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )


class UpdateUserTokenSchema(OrmBase):
    login_token: str
    update_id: int
    update_dt: datetime

    def to_dict(self) -> dict:
        return {k: v for k, v in vars(self).items() if v is not None}

    @staticmethod
    def of_token(user: UserModel, login_token: str) -> "UpdateUserTokenSchema":
        return UpdateUserTokenSchema(
            login_token=login_token,
            update_id=user.id,
            update_dt=utils.now()
        )


class UpdateUserSchema(OrmBase):
    hospital_code: Optional[str] = None
    password: Optional[str] = None
    name: Optional[str] = None
    hospital_name: Optional[str] = None
    dept_name: Optional[str] = None
    update_id: int
    update_dt: datetime

    @staticmethod
    def of(update_data: dict, update_id: int) -> "UpdateUserSchema":
        return UpdateUserSchema(
            hospital_code=update_data["hospital_code"],
            password=get_password_hash(update_data["password"]) if update_data["password"] else None,
            name=update_data["name"],
            hospital_name=update_data["hospital_name"],
            dept_name=update_data["dept_name"],
            update_id=update_id,
            update_dt=utils.now()
        )
