from typing import Optional

from pydantic import BaseModel


class CreateAdminRequest(BaseModel):
    name: str
    dept_name: str
    tel_no: str
    login_id: str
    password: str
    password_check: str
    auth_menu_list: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "손예진",
                "dept_name": "경영지원",
                "tel_no": "010-3333-3333",
                "login_id": "admin2@gmail.com",
                "password": "password!",
                "password_check": "password!",
                "auth_menu_list": "1,3",
            }
        }


class UpdateAdminRequest(BaseModel):
    admin_id: int
    name: Optional[str] = None
    dept_name: Optional[str] = None
    tel_no: Optional[str] = None
    password: Optional[str] = None
    password_check: Optional[str] = None
    auth_menu_list: str

    class Config:
        json_schema_extra = {
            "example": {
                "admin_id": 1,
                "name": "손예진",
                "dept_name": "경영지원",
                "tel_no": "010-3333-3333",
                "password": "password!",
                "password_check": "password!",
                "auth_menu_list": "1,3",
            }
        }


class CreateUserRequest(BaseModel):
    login_id: str
    hospital_code: str
    password: str
    password_check: str
    name: str
    hospital_name: str
    dept_name: str

    class Config:
        json_schema_extra = {
            "example": {
                "login_id": "user2@gmail.com",
                "hospital_code": "hospital code",
                "password": "password!",
                "password_check": "password!",
                "name": "손예진",
                "hospital_name": "병원 이름",
                "dept_name": "경영지원"
            }
        }


class UpdateUserRequest(BaseModel):
    user_id: int
    hospital_code: Optional[str] = None
    password: Optional[str] = None
    password_check: Optional[str] = None
    name: Optional[str] = None
    hospital_name: Optional[str] = None
    dept_name: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "hospital_code": "hospital code",
                "password": "password!",
                "password_check": "password!",
                "name": "손예진",
                "hospital_name": "병원 이름",
                "dept_name": "경영지원"
            }
        }
