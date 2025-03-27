from datetime import datetime
from decimal import Decimal
from typing import Optional

from src.api.chatbot.request import QuestionRequest
from src.core import utils
from src.core.schemas import OrmBase


class ChatBot(OrmBase):
    id: int
    user_id: Optional[int]
    call_path: str
    vectordb_id: Optional[int]
    question_content: str
    answer_content: Optional[str]
    dgstfn: Optional[Decimal]
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime


class CreateChatbotSchema(OrmBase):
    user_id: Optional[int]
    call_path: str
    vectordb_id: Optional[int]
    question_content: str
    answer_content: Optional[str]
    dgstfn: Optional[Decimal]
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime

    @staticmethod
    def of(
            request_body: QuestionRequest,
            user_id: int,
            doc_id: Optional[int],
            answer_content: Optional[str]
    ) -> "CreateChatbotSchema":
        return CreateChatbotSchema(
            user_id=user_id,
            call_path=request_body.call_path,
            vectordb_id=doc_id,
            question_content=request_body.question_content,
            answer_content=answer_content,
            dgstfn=None,
            creation_id=user_id,
            update_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )

    @staticmethod
    def of_(
            request: QuestionRequest, doc_id: int, answer_content: str, current_user_id: int
    ) -> "CreateChatbotSchema":
        return CreateChatbotSchema(
            user_id=current_user_id,
            call_path=request.call_path,
            vectordb_id=doc_id,
            question_content=request.question_content,
            answer_content=answer_content,
            dgstfn=None,
            creation_id=current_user_id,
            update_id=current_user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )


class UpdateChatbotSchema(OrmBase):
    vectordb_id: Optional[int]
    dgstfn: Optional[Decimal]
    update_id: int
    update_dt: datetime

    @staticmethod
    def of(dgstfn: Decimal, vectordb_id: Optional[int], user_id: int) -> "UpdateChatbotSchema":
        return UpdateChatbotSchema(
            vectordb_id=vectordb_id,
            dgstfn=dgstfn,
            update_id=user_id,
            update_dt=utils.now()
        )
