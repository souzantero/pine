"""add knowledge config key

Revision ID: i3d4e5f6g7h8
Revises: h2c3d4e5f6g7
Create Date: 2025-01-26

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "i3d4e5f6g7h8"
down_revision: Union[str, None] = "h2c3d4e5f6g7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adicionar novo valor KNOWLEDGE ao enum configkey
    op.execute("ALTER TYPE configkey ADD VALUE IF NOT EXISTS 'KNOWLEDGE'")


def downgrade() -> None:
    # Nota: Nao e possivel remover valores de enum no PostgreSQL facilmente
    pass
