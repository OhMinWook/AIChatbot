from typing import Optional

from pydantic import BaseModel

from src.api.user.models import User
from src.core import utils


class UserDetailResponse(BaseModel):
    id: int
    login_id: str
    hospital_code: str
    name: Optional[str]
    hospital_name: Optional[str]
    dept_name: Optional[str]

    @classmethod
    def of(cls, user: User) -> "UserDetailResponse":
        return UserDetailResponse(
            id=user.id,
            login_id=user.login_id,
            hospital_code=user.hospital_code,
            name=user.name,
            hospital_name=user.hospital_name,
            dept_name=user.dept_name
        )


class UserResponse(UserDetailResponse):
    creation_dt: float

    @classmethod
    def of(cls, user: User) -> "UserResponse":
        return UserResponse(
            id=user.id,
            login_id=user.login_id,
            hospital_code=user.hospital_code,
            name=user.name,
            hospital_name=user.hospital_name,
            dept_name=user.dept_name,
            creation_dt=utils.datetime_to_unix_time(user.creation_dt)
        )
