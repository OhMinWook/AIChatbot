from typing import Optional

from pydantic import field_validator

from src.api.admin.dashboard.exception import InvalidDateFilter
from src.core.pagination import Pageable


class UseSummarySearchParam(Pageable):
    date_filter: Optional[str] = "all"
    detail_filter: Optional[str] = "all"

    @field_validator("date_filter")
    def validate_date_filter(cls, v):
        v = v.lower()
        if v not in ("all", "year", "month", "day"):
            raise InvalidDateFilter()
        return v


class UserUseSummarySearchParam(UseSummarySearchParam):
    @field_validator("detail_filter")
    def validate_detail_filter(cls, v):
        v = v.lower()
        if v.lower() not in ("all", "hospital", "call_path"):
            raise InvalidDateFilter()
        return v


class AdminUseSummarySearchParam(UseSummarySearchParam):
    @field_validator("detail_filter")
    def validate_detail_filter(cls, v):
        v = v.lower()
        if v.lower() not in ("all", "admin", "type"):
            raise InvalidDateFilter()
        return v
