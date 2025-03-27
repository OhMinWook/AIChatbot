"""init auth_menu data

Revision ID: b63cbaeadefb
Revises: 3adc12734225
Create Date: 2024-09-03 07:08:48.805487

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

from src.core import utils

# revision identifiers, used by Alembic.
revision: str = 'b63cbaeadefb'
down_revision: Union[str, None] = '3adc12734225'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bo_auth_menu = sa.table(
        'bo_auth_menu',
        sa.column('upper_menu_name', mysql.VARCHAR(length=50)),
        sa.column('lower_menu_name', mysql.VARCHAR(length=50)),
        sa.column('creation_id', mysql.INTEGER()),
        sa.column('update_id', mysql.INTEGER()),
        sa.column('creation_dt', mysql.DATETIME()),
        sa.column('update_dt', mysql.DATETIME()),
    )

    op.bulk_insert(bo_auth_menu, [
        {"upper_menu_name": "SuperAdmin", "lower_menu_name": "최고관리자", "creation_id": 0, "update_id": 0,
         "creation_dt": utils.now(), "update_dt": utils.now()},
        {"upper_menu_name": "Manual", "lower_menu_name": "매뉴얼관리", "creation_id": 0, "update_id": 0,
         "creation_dt": utils.now(), "update_dt": utils.now()},
        {"upper_menu_name": "Answer", "lower_menu_name": "답변관리", "creation_id": 0, "update_id": 0,
         "creation_dt": utils.now(), "update_dt": utils.now()},
        {"upper_menu_name": "TokenDashboard", "lower_menu_name": "사용량대시보드", "creation_id": 0, "update_id": 0,
         "creation_dt": utils.now(), "update_dt": utils.now()},
    ])


def downgrade() -> None:
    bo_auth_menu = sa.table(
        'bo_auth_menu',
        sa.column('upper_menu_name', mysql.VARCHAR(length=50))
    )
    stmt = (
        sa.delete(bo_auth_menu)
        .where(bo_auth_menu.c.upper_menu_name.in_(
            ["SuperAdmin", "Manual", "Answer", "TokenDashboard"]
        )
        )
    )
    op.execute(stmt)
