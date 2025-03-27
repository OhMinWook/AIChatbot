from pydantic import BaseModel, Field


class SignInRequest(BaseModel):
    login_id: str = Field(..., title="유저 이메일", examples=["root@gmail.com"], description="")
    password: str = Field(..., title="유저 비밀번호", examples=["password!"], description="")

    class Config:
        json_schema_extra = {
            "example": {
                "login_id": "admin",
                "password": "admin"
            }
        }
