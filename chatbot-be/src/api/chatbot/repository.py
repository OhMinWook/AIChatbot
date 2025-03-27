from typing import Optional, List, Dict, Any

from sqlalchemy import select, join
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.chatbot.association import ChatbotVectorDB, CreateAssociationSchema, UpdateAssociationSchema
from src.api.chatbot.models import Chatbot
from src.api.chatbot.schemas import UpdateChatbotSchema, CreateChatbotSchema
from src.api.report.models import Report
from src.api.vectordb.models import VectorDB
from src.core.crud import CRUDBase


class ChatbotRepository(CRUDBase[Chatbot, CreateChatbotSchema, UpdateChatbotSchema]):
    async def get_by_id(
            self,
            db: AsyncSession,
            *,
            id: int
    ) -> Optional[Chatbot]:
        return await super().get_one(db, id=id)

    async def get_by_vector_id_list(
            self,
            db: AsyncSession,
            *,
            id_list: list
    ) -> List[Chatbot]:
        query = select(self.model).where(self.model.vectordb_id.in_(id_list))
        result = await db.execute(query)
        return result.scalars().all()

    async def get_id_list(
            self,
            db: AsyncSession,
            *,
            filters: list
    ):
        query = (
            select(self.model)
            .where(*filters)
            .order_by(self.model.id.desc())
            .limit(5)
        )
        result = await db.execute(query)
        return result.mappings().all()

    async def get_with_joins_by_id_list(
            self,
            db: AsyncSession,
            *,
            filters: list,
            chatbot_id_list: list
    ) -> List[Dict[str, Any]]:
        from_clause = self.model
        join_models = [
            (ChatbotVectorDB, Chatbot.id == ChatbotVectorDB.chatbot_id),
            (VectorDB, ChatbotVectorDB.vectordb_id == VectorDB.id),
            (Report, Chatbot.id == Report.chatbot_id)
        ]

        for join_model, join_condition in join_models:
            from_clause = join(from_clause, join_model, join_condition, isouter=True)

        query = (
            select(self.model, *[join_model for join_model, _ in join_models])
            .select_from(from_clause)
            .where(self.model.id.in_(chatbot_id_list))
        )

        for filter_condition in filters:
            query = query.where(filter_condition)

        query = query.order_by(self.model.id.desc())
        result = await db.execute(query)
        return result.mappings().all()


class AssociationRepository(CRUDBase[ChatbotVectorDB, CreateAssociationSchema, UpdateAssociationSchema]):
    pass


chatbot_repository = ChatbotRepository(Chatbot)
association_repository = AssociationRepository(ChatbotVectorDB)
