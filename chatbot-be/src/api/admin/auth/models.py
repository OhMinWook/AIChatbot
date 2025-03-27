from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.model import Model


class BoAuthMenu(Model):
    __tablename__ = "bo_auth_menu"
    __table_args__ = {"comment": "백오피스 권한 메뉴 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    upper_menu_name: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=False,
        comment="상위 메뉴 이름"
    )
    lower_menu_name: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=False,
        comment="하위 메뉴 이름"
    )
    UniqueConstraint(lower_menu_name, name="UQ_bo_auth_menu_1")
