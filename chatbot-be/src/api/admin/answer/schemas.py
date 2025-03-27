from datetime import datetime
from typing import Optional

from src.core import utils
from src.core.schemas import OrmBase


class BoAnswer(OrmBase):
    id: int
    answer_content: str
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime


class CreateBOAnswerSchema(OrmBase):
    pass


class UpdateBOAnswerSchema(OrmBase):
    id: int
    answer_content: Optional[str]
    update_id: int
    update_dt: datetime

    @staticmethod
    def of(answer: BoAnswer, answer_content: str, user_id: int) -> "UpdateBOAnswerSchema":
        return UpdateBOAnswerSchema(
            id=answer.id,
            answer_content=answer_content,
            update_id=user_id,
            update_dt=utils.now()
        )
