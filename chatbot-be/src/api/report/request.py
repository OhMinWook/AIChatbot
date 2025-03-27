from pydantic import BaseModel


class ReportRequest(BaseModel):
    id: int
    report_content: str
