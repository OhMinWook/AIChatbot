from typing import List, Optional

from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, relationship, mapped_column

from src.api.chatbot.models import Chatbot
from src.core.model import Model


class User(Model):
    __tablename__ = "user"
    __table_args__ = {"comment": "사용자 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    hospital_code: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=10),
        nullable=False,
        comment="병원 코드"
    )
    login_id: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=False,
        comment="로그인 아이디"
    )
    password: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=False,
        comment="비밀번호"
    )
    name: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=True,
        comment="이름"
    )
    hospital_name: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=True,
        comment="병원 이름"
    )
    dept_name: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=True,
        comment="부서 이름"
    )
    login_token: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=500),
        nullable=True,
        comment="로그인 토큰"
    )
    chatbot: Mapped[List["Chatbot"]] = relationship()

    UniqueConstraint(hospital_code, login_id, name="UQ_user_2")
