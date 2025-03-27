from decimal import Decimal

from pydantic import BaseModel, Field, field_validator

from src.api.chatbot.exception import RateValueException


class QuestionRequest(BaseModel):
    question_content: str
    call_path: str = Field(default="api", pattern="^(user|api)$")


class RateRequest(BaseModel):
    id: int
    dgstfn: Decimal

    @field_validator("dgstfn")
    def dgstfn_validator(cls, v):
        if v < Decimal(0) or v > Decimal(5):
            raise RateValueException()

        remain = v - int(v)
        if remain not in [Decimal('0.0'), Decimal('0.5')]:
            raise RateValueException()

        return v
