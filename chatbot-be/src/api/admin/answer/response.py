from typing import Optional

from pydantic import BaseModel

from src.api.admin.answer.models import BOAnswer
from src.core import utils
from src.core.ncp_client import ncp_client

from src.core.utils import datetime_to_unix_time


class AnswerResponse(BaseModel):
    answer_id: int
    answer_content: str

    @classmethod
    def of(cls, answer: BOAnswer) -> "AnswerResponse":
        return AnswerResponse(
            answer_id=answer.id,
            answer_content=answer.answer_content
        )


class ReportResponse(BaseModel):
    report_id: int
    question_content: str
    answer_content: str
    report_content: str
    creation_dt: Optional[float]

    @classmethod
    def of(cls, result: dict) -> "ReportResponse":
        report = result["Report"]
        chatbot = result["Chatbot"]
        return cls(
            report_id=report.id,
            question_content=chatbot.question_content,
            answer_content=chatbot.answer_content,
            report_content=report.report_content,
            creation_dt=datetime_to_unix_time(report.creation_dt)
        )


class ReportDetailResponse(BaseModel):
    report_id: int
    question_content: str
    answer_content: str
    report_content: str
    creation_dt: float
    user_id: str
    screen_id: Optional[str]
    manual_name: Optional[str]
    manual_path: Optional[str]
    manual_id: Optional[int]

    @classmethod
    def of(cls, data: dict) -> "ReportDetailResponse":
        report = data["Report"]
        chatbot = data["Chatbot"]
        user = data["User"]
        vectordb = data.get("VectorDB")

        return ReportDetailResponse(
            report_id=report.id,
            question_content=chatbot.question_content,
            answer_content=chatbot.answer_content,
            manual_id=vectordb.id if vectordb else None,
            report_content=report.report_content,
            creation_dt=utils.datetime_to_unix_time(report.creation_dt),
            user_id=user.login_id,
            screen_id=vectordb.screen_id if vectordb else None,
            manual_name=vectordb.manual_name if vectordb else None,
            manual_path=ncp_client.generate_presigned_get_url(vectordb.manual_path) if vectordb else None
        )

