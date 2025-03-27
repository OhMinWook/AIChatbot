from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import ForeignKey
from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class Model(Base):
    __tablename__ = "model"
    __table_args__ = {"comment": "모델 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    name: Mapped[Optional[str]] = mapped_column(
        mysql.VARCHAR(length=50),
        nullable=True,
        comment="이름"
    )
    amount: Mapped[Optional[Decimal]] = mapped_column(
        mysql.DECIMAL(precision=34, scale=18),
        nullable=True,
        comment="금액"
    )
