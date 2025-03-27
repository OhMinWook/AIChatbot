from typing import Optional

from pydantic import BaseModel, field_validator

from src.core import utils
from src.core.exception import ValidationException


class Pageable(BaseModel):
    last_id: int = 0
    page_size: int = 50
    start_dt: Optional[float] = None
    end_dt: Optional[float] = None

    @field_validator("last_id")
    def validate_last_id(cls, v):
        if v < 0:
            raise ValidationException("last_id should be bigger than 0")
        else:
            return v

    @field_validator("page_size")
    def validate_page_size(cls, v):
        if v < 1:
            raise ValidationException("page_size should be bigger than 0")
        else:
            return v

    @field_validator("start_dt")
    def validate_start_dt(cls, v):
        if v:
            date_time = utils.unix_time_to_datetime(v)
            return utils.convert_to_kst(date_time)
        return v

    @field_validator("end_dt")
    def validate_end_dt(cls, v):
        if v:
            date_time = utils.unix_time_to_datetime(v)
            return utils.convert_to_kst(date_time)
        return v
