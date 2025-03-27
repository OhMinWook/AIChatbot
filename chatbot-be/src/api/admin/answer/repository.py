from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.answer.models import BOAnswer
from src.api.admin.answer.schemas import UpdateBOAnswerSchema, CreateBOAnswerSchema
from src.core.crud import CRUDBase


class AdminAnswerRepository(CRUDBase[BOAnswer, CreateBOAnswerSchema, UpdateBOAnswerSchema]):
    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[BOAnswer]:
        return await super().get_one(db, id=id)


admin_answer_repository = AdminAnswerRepository(BOAnswer)
