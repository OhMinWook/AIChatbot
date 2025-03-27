from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy.dialects import mysql
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class UsageQuantity(Base):
    __tablename__ = "usage_quantity"
    __table_args__ = {"comment": "사용량 테이블"}

    id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        primary_key=True,
        autoincrement=True,
        nullable=False,
        comment="아이디"
    )
    usqty_type: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=1),
        nullable=False,
        comment="사용량 유형. 0:전처리,1:임베딩,2:사용자"
    )
    type_id: Mapped[int] = mapped_column(
        mysql.INTEGER,
        nullable=False,
        comment="유형 아이디"
    )
    crud_type: Mapped[str] = mapped_column(
        mysql.VARCHAR(length=1),
        nullable=False,
        comment="crud 유형. c:insert,u:update"
    )
    question_token_cnt: Mapped[Optional[int]] = mapped_column(
        mysql.INTEGER,
        nullable=True,
        comment="질문 토큰 수"
    )
    answer_token_cnt: Mapped[Optional[int]] = mapped_column(
        mysql.INTEGER,
        nullable=True,
        comment="답변 토큰 수"
    )
    use_token_cnt: Mapped[Optional[int]] = mapped_column(
        mysql.INTEGER,
        nullable=True,
        comment="사용 토큰 수"
    )
    use_amount: Mapped[Optional[Decimal]] = mapped_column(
        mysql.DECIMAL(precision=34, scale=18),
        nullable=True,
        comment="사용 금액"
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
