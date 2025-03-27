"""add set_id

Revision ID: d495ad7efac1
Revises: cd399c60dc8f
Create Date: 2024-09-29 16:17:34.753020

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'd495ad7efac1'
down_revision: Union[str, None] = 'cd399c60dc8f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'preprocessing',
        sa.Column(
            'set_id',
            mysql.INTEGER,
            nullable=False,
            comment='세트 아이디'
        )
    )


def downgrade() -> None:
    op.drop_column(
        'preprocessing',
        'set_id'
    )

