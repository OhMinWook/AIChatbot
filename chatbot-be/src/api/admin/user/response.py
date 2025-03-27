from typing import Optional

from pydantic import BaseModel

from src.api.admin.user.schemas import BOUser
from src.api.user.models import User
from src.core import utils


class AdminDetailResponse(BaseModel):
    id: int
    name: Optional[str]
    dept_name: Optional[str]
    tel_no: Optional[str]
    login_id: str
    auth_menu_list: Optional[str]

    @classmethod
    def of(cls, admin: BOUser) -> "AdminDetailResponse":
        return AdminDetailResponse(
            id=admin.id,
            name=admin.name,
            dept_name=admin.dept_name,
            tel_no=admin.tel_no,
            login_id=admin.login_id,
            auth_menu_list=admin.auth_menu_list
        )


class AdminResponse(AdminDetailResponse):
    creation_dt: float

    @classmethod
    def of(cls, admin: BOUser) -> "AdminResponse":
        return AdminResponse(
            id=admin.id,
            name=admin.name,
            dept_name=admin.dept_name,
            tel_no=admin.tel_no,
            login_id=admin.login_id,
            auth_menu_list=admin.auth_menu_list,
            creation_dt=utils.datetime_to_unix_time(admin.creation_dt)
        )
