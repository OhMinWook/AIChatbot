from typing import List, Optional

from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.api.preprocessing.models import Preprocessing
from src.core.model import Model


class BOUser(Model):
    __tablename__ = "bo_user"
    __table_args__ = {"comment": "백오피스 사용자 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
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
    dept_name: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=True,
        comment="부서 이름"
    )
    tel_no: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=20),
        nullable=True,
        comment="전화 번호"
    )
    auth_menu_list: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=255),
        nullable=True,
        comment="권한 메뉴 리스트"
    )
    login_token: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=500),
        nullable=True,
        comment="로그인 토큰"
    )
    preprocessing: Mapped[List["Preprocessing"]] = relationship()
    UniqueConstraint(login_id, name="UQ_user_1")
