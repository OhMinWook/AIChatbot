from sqlalchemy import ForeignKey
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base
from src.core.schemas import OrmBase


class ChatbotVectorDB(Base):
    __tablename__ = "chatbot_vectordb"

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디",
    )
    chatbot_id: Mapped[int] = mapped_column(
        ForeignKey("chatbot.id", ondelete="RESTRICT", onupdate="RESTRICT"),
        nullable=False,
        comment="챗봇 아이디",
    )
    vectordb_id: Mapped[int] = mapped_column(
        ForeignKey("vectordb.id", ondelete="RESTRICT", onupdate="RESTRICT"),
        nullable=True,
        comment="벡터디비 아이디",
    )


class CreateAssociationSchema(OrmBase):
    chatbot_id: int
    vectordb_id: int

    @staticmethod
    def of(chatbot_id: int, vectordb_id: int) -> "CreateAssociationSchema":
        return CreateAssociationSchema(chatbot_id=chatbot_id, vectordb_id=vectordb_id)


class UpdateAssociationSchema(OrmBase):
    pass
