from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class Preprocessing(Base):
    __tablename__ = "preprocessing"
    __table_args__ = {"comment": "전처리 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    set_id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        nullable=False,
        comment="세트 아이디"
    )
    preprocessing_pattern: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=True,
        comment="전처리 패턴"
    )
    manual_name: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=100),
        nullable=False,
        comment="설명서 이름"
    )
    prompt_content: Mapped[Optional[str]] = mapped_column(
        mysql.TEXT,
        nullable=True,
        comment="프롬프트 내용"
    )
    screen_id: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=100),
        nullable=True,
        comment="화면 아이디"
    )
    subject: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=True,
        comment="주제"
    )
    content: Mapped[Optional[str]] = mapped_column(
        mysql.TEXT,
        nullable=True,
        comment="내용"
    )
    image_path: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=True,
        comment="이미지 경로"
    )
    creation_id: Mapped[int] = mapped_column(
        ForeignKey(
            "bo_user.id",
            ondelete="RESTRICT",
            onupdate="RESTRICT"
        ),
        comment="생성 아이디"
    )
    creation_dt: Mapped[datetime] = mapped_column(
        mysql.DATETIME,
        nullable=False,
        comment="생성 일시"
    )
    update_dt: Mapped[datetime] = mapped_column(
        mysql.DATETIME,
        nullable=False,
        comment="갱신 일시"
    )
