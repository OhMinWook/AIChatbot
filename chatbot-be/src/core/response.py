from typing import Optional, Any, List

from fastapi import status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


# TODO 기존 paging에 사용했던 것
class PageData:
    total_pages: int
    page_size: int
    current_page_no: int
    response: List[Any]
    total_count: int

    def __init__(
            self,
            response: List[Any],
            total_pages: int,
            page_size: int,
            current_page_no: int,
            total_count: int = 0
    ):
        self.response = response
        self.total_pages = total_pages
        self.page_size = page_size
        self.current_page_no = current_page_no
        self.total_count = total_count

    def model_dump(self) -> dict[str, Any]:
        return vars(self)


class ApiResponse(BaseModel):
    error: bool
    message: Optional[str]
    data: Optional[Any]

    @classmethod
    def of(cls, data: Any = None, http_status: status = status.HTTP_200_OK) -> JSONResponse:
        if isinstance(data, PageData):
            data = data.model_dump()
        return JSONResponse(
            status_code=http_status,
            content=cls(
                error=False,
                message="success",
                data=data
            ).model_dump()
        )

    @classmethod
    def of_error(cls, error_message: str, http_status: status = status.HTTP_500_INTERNAL_SERVER_ERROR) -> JSONResponse:
        return JSONResponse(
            status_code=http_status,
            content=cls(
                error=True,
                message=error_message,
                data=None
            ).model_dump()
        )


class EnumResponse(BaseModel):
    key: Any
    value: Any
    display_name: Optional[str]

    @classmethod
    def of(cls, key: Any, value: Any, display_name: Optional[str]) -> "EnumResponse":
        return EnumResponse(key=key, value=value, display_name=display_name)
