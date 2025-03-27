from decimal import Decimal
from typing import List, Optional

from sqlalchemy import ForeignKey
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.api.chatbot.association import ChatbotVectorDB
from src.api.report.models import Report
from src.core.model import Model


class Chatbot(Model):
    __tablename__ = "chatbot"
    __table_args__ = {"comment": "챗봇 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "user.id",
            ondelete="RESTRICT",
            onupdate="RESTRICT",
        ),
        nullable=True,
        comment="사용자 아아디"
    )
    call_path: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=10),
        nullable=False,
        comment="호출 경로. user, api"
    )
    vectordb_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "vectordb.id",
            ondelete="RESTRICT",
            onupdate="RESTRICT",
        ),
        nullable=True,
        comment="벡터디비 아이디"
    )
    question_content: Mapped[str] = mapped_column(
        mysql.TEXT,
        nullable=False,
        comment="질문 내용"
    )
    answer_content: Mapped[Optional[str]] = mapped_column(
        mysql.TEXT,
        nullable=True,
        comment="답변 내용"
    )
    dgstfn: Mapped[Optional[Decimal]] = mapped_column(
        mysql.DECIMAL(precision=2, scale=1),
        nullable=True,
        comment="만족도"
    )
    report: Mapped[List["Report"]] = relationship()
    chatbot_vectordb: Mapped[List["ChatbotVectorDB"]] = relationship()
