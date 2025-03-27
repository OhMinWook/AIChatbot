"""admin init

Revision ID: bb09ab34d404
Revises: 59cd25e39e7e
Create Date: 2024-10-29 06:43:23.028999

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql
from sqlalchemy.sql import exists

from src.core import utils

# revision identifiers, used by Alembic.
revision: str = 'bb09ab34d404'
down_revision: Union[str, None] = '59cd25e39e7e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    bo_user = sa.table(
        'bo_user',
        sa.column('id', mysql.INTEGER()),
        sa.column('login_id', mysql.VARCHAR(length=50)),
        sa.column('password', mysql.VARCHAR(length=255)),
        sa.column('auth_menu_list', mysql.VARCHAR(length=255)),
        sa.column('creation_id', mysql.INTEGER()),
        sa.column('update_id', mysql.INTEGER()),
        sa.column('creation_dt', mysql.DATETIME()),
        sa.column('update_dt', mysql.DATETIME()),
    )
    user = sa.table(
        'user',
        sa.column('id', mysql.INTEGER()),
        sa.column('login_id', mysql.VARCHAR(length=50)),
        sa.column('password', mysql.VARCHAR(length=255)),
        sa.column('hospital_code', mysql.VARCHAR(length=10)),
        sa.column('creation_id', mysql.INTEGER()),
        sa.column('update_id', mysql.INTEGER()),
        sa.column('creation_dt', mysql.DATETIME()),
        sa.column('update_dt', mysql.DATETIME()),
    )

    bo_user_exists = bind.execute(
        exists().where(bo_user.c.login_id == 'admin').select()
    ).scalar()
    if not bo_user_exists:
        op.bulk_insert(bo_user, [
            {
                "id": 1,
                "login_id": "admin",
                "password": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
                "auth_menu_list": "1,2,3,4",
                "creation_id": 1,
                "update_id": 1,
                "creation_dt": utils.now(),
                "update_dt": utils.now()
            }
        ])

    user_exists = bind.execute(
        exists().where(user.c.login_id == 'admin').select()
    ).scalar()
    if not user_exists:
        op.bulk_insert(user, [
            {
                "id": 1,
                "login_id": "admin",
                "password": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
                "hospital_code": "admin",
                "creation_id": 1,
                "update_id": 1,
                "creation_dt": utils.now(),
                "update_dt": utils.now()
            }
        ])


def downgrade() -> None:
    bo_user = sa.table(
        'bo_user',
        sa.column('login_id', mysql.VARCHAR(length=50))
    )
    user = sa.table(
        'user',
        sa.column('login_id', mysql.VARCHAR(length=50))
    )
    stmt1 = (sa.delete(bo_user).where(bo_user.c.login_id == "admin"))
    op.execute(stmt1)
    stmt2 = (sa.delete(user).where(user.c.login_id == "admin"))
    op.execute(stmt2)
