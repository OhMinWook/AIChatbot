from datetime import datetime

from src.api.report.request import ReportRequest
from src.core import utils
from src.core.schemas import OrmBase


class Report(OrmBase):
    id: int
    chatbot_id: int
    report_content: str
    creation_id: int
    creation_dt: datetime


class CreateReportSchema(OrmBase):
    chatbot_id: int
    report_content: str
    creation_id: int
    creation_dt: datetime

    @staticmethod
    def of(request: ReportRequest, user_id: int) -> "CreateReportSchema":
        return CreateReportSchema(
            chatbot_id=request.id,
            report_content=request.report_content,
            creation_id=user_id,
            creation_dt=utils.now()
        )


class UpdateReportSchema(OrmBase):
    pass
