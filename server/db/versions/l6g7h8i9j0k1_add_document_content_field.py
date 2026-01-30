"""add document content field

Revision ID: l6g7h8i9j0k1
Revises: k5f6g7h8i9j0
Create Date: 2025-01-30

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "l6g7h8i9j0k1"
down_revision: Union[str, None] = "k5f6g7h8i9j0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("documents", sa.Column("content", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("documents", "content")
