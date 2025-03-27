from datetime import datetime

from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class Model(Base):
    __abstract__ = True

    creation_id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        nullable=False,
        comment="생성 아이디"
    )
    update_id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        nullable=False,
        comment="갱신 아이디"
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
