"""migrate storage configs to knowledge

Revision ID: k5f6g7h8i9j0
Revises: j4e5f6g7h8i9
Create Date: 2025-01-26

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "k5f6g7h8i9j0"
down_revision: Union[str, None] = "j4e5f6g7h8i9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove registros antigos com key='STORAGE' (foram migrados manualmente para KNOWLEDGE)
    op.execute(
        "DELETE FROM organization_configs WHERE key = 'STORAGE'"
    )


def downgrade() -> None:
    # Reverte KNOWLEDGE para STORAGE
    op.execute(
        "UPDATE organization_configs SET key = 'STORAGE' WHERE key = 'KNOWLEDGE'"
    )
