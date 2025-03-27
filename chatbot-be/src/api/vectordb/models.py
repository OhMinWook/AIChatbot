from typing import List, Optional

from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.api.chatbot.association import ChatbotVectorDB
from src.api.chatbot.models import Chatbot
from src.core.model import Model


class VectorDB(Model):
    __tablename__ = "vectordb"
    __table_args__ = {"comment": "벡터디비 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=False,
        nullable=False,
        comment="아이디"
    )
    hash_id: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=36),
        nullable=False,
        comment="해시 아이디"
    )
    screen_id: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=100),
        nullable=True,
        comment="화면 아이디. source"
    )
    manual_name: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=100),
        nullable=False,
        comment="설명서 이름"
    )
    manual_path: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=False,
        comment="설명서 경로"
    )
    subject: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=True,
        comment="주제"
    )
    content: Mapped[str] = mapped_column(
        mysql.TEXT,
        nullable=False,
        comment="내용"
    )
    image_path: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=True,
        comment="이미지 경로"
    )
    data_status: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=1),
        nullable=False,
        default="Y",
        comment="데이터 상태. Y:정상, N(삭제)"
    )
    chatbot: Mapped[List["Chatbot"]] = relationship()
    chatbot_vectordb: Mapped[List["ChatbotVectorDB"]] = relationship()
    UniqueConstraint(hash_id, name="UQ_vectordb_1")
