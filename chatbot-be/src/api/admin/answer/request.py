from typing import Optional

from pydantic import BaseModel, Field, field_validator

from src.core.pagination import Pageable


class AnswerSearchParam(Pageable):
    report_content: Optional[str] = Field(default=None)

    @field_validator('report_content')
    def validate_screen_id(cls, v):
        if v:
            return f"%{v}%"
        return v


class UpdateAnswerRequest(BaseModel):
    answer_content: str

    class Config:
        json_schema_extra = {
            "example": {
                "answer_content": "Updated answer content",
            }
        }
