from typing import Optional, cast

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.report.models import Report
from src.api.report.schemas import CreateReportSchema, UpdateReportSchema
from src.core.crud import CRUDBase


class ReportRepository(CRUDBase[Report, CreateReportSchema, UpdateReportSchema]):
    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[Report]:
        return await super().get_one(db, id=id)

    async def get_by_chatbot_id(
            self,
            db: AsyncSession,
            *,
            chatbot_id: int
    ) -> Optional[Report]:
        query = select(self.model).where(cast("ColumnElement[bool]", self.model.chatbot_id == chatbot_id))
        report = await db.execute(query)
        return report.scalars().first()


report_repository = ReportRepository(Report)
