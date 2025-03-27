from typing import Optional, List

from pydantic import BaseModel, field_validator, Field

from src.api.admin.manual.exception import ManualException
from src.api.admin.manual.response import ManualPage
from src.core import utils
from src.core.pagination import Pageable


class ManualSearchParam(Pageable):
    last_update_dt: Optional[int] = Field(default=None)
    screen_id: Optional[str] = Field(default=None)
    manual_name: Optional[str] = Field(default=None)
    hash_id: Optional[str] = Field(default=None)

    @field_validator("last_update_dt")
    def validate_last_update_dt(cls, v):
        if v:
            date_time = utils.unix_time_to_datetime(v)
            return utils.convert_to_kst(date_time)
        return v

    @field_validator("screen_id")
    def validate_screen_id(cls, v):
        if v:
            return f"%{v}%"
        return v

    @field_validator("manual_name")
    def validate_manual_name(cls, v):
        if v:
            return f"%{v}%"
        return v

    @field_validator("hash_id")
    def validate_hash_id(cls, v):
        if v:
            return f"%{v}%"
        return v


class CreatePreprocessRequest(BaseModel):
    pattern1: Optional[str] = None
    pattern1_1: Optional[str] = None
    pattern2: Optional[str] = None
    exclude: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {"pattern1": "", "pattern1_1": "", "pattern2": "", "exclude": ""}
        }


class PageModificationRequest(BaseModel):
    id: int
    source: Optional[str] = None
    subject: Optional[str] = None
    content: Optional[str] = None


class UpdateManualRequest(BaseModel):
    update_type: int
    content_type: int
    data: Optional[str]

    @field_validator("update_type")
    def validate_update_type(cls, v):
        if v not in [0, 1]:
            raise ManualException("update type must be 0 or 1")
        return v

    @field_validator("content_type")
    def validate_content_type(cls, v):
        if v not in [0, 1, 2]:
            raise ManualException("content type must be 0 ~ 2")
        return v

    class Config:
        json_schema_extra = {
            "example": {"update_type": 1, "content_type": 2, "data": "string"}
        }


class AddDataRequest(BaseModel):
    update_type: int
    type_id: int
    manual_name: str
    source: Optional[str] = None
    subject: Optional[str] = None
    content: str
    image_path: Optional[str] = None

    @field_validator("update_type")
    def validate_update_type(cls, v):
        if v not in [0, 1]:
            raise ManualException("update type must be 0 or 1")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "update_type": 0,
                "type_id": 1,
                "manual_name": "string",
                "source": "string",
                "subject": "string",
                "content": "string",
                "image_path": "string",
            }
        }
