from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class Report(Base):
    __tablename__ = "report"
    __table_args__ = {"comment": "사용자 리포트 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    chatbot_id: Mapped[int] = mapped_column(
        ForeignKey(
            'chatbot.id',
            ondelete='RESTRICT',
            onupdate='RESTRICT'
        ),
        comment="챗봇 아이디"
    )
    report_content: Mapped[str] = mapped_column(
        mysql.TEXT,
        nullable=False,
        comment="보고 내용"
    )
    creation_id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        nullable=False,
        comment="생성 아이디"
    )
    creation_dt: Mapped[datetime] = mapped_column(
        mysql.DATETIME,
        nullable=False,
        comment="생성 일시"
    )
