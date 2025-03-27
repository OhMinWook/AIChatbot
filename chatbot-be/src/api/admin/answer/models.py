from typing import Optional

from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.model import Model


class BOAnswer(Model):
    __tablename__ = "bo_answer"
    __table_args__ = {"comment": "백오피스 답변관리 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    answer_content: Mapped[Optional[str]] = mapped_column(
        mysql.TEXT,
        nullable=True,
        comment="답변 내용"
    )
