"""chatbot_vectordb table data init

Revision ID: 3a83c26debe1
Revises: 4b0243608cd7
Create Date: 2024-11-19 02:16:34.779581

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '3a83c26debe1'
down_revision: Union[str, None] = '4b0243608cd7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        INSERT INTO chatbot_vectordb (chatbot_id, vectordb_id) 
        SELECT id, vectordb_id FROM chatbot;
    """)


def downgrade() -> None:
    pass
