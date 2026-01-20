"""add WEB_FETCH to configkey enum

Revision ID: e9f0a1b2c3d4
Revises: d8e9f0a1b2c3
Create Date: 2026-01-19 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'e9f0a1b2c3d4'
down_revision: Union[str, Sequence[str], None] = 'd8e9f0a1b2c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Adiciona WEB_FETCH ao enum configkey."""
    op.execute("ALTER TYPE configkey ADD VALUE 'WEB_FETCH'")


def downgrade() -> None:
    """Remove WEB_FETCH do enum configkey (requer recriar o enum)."""
    # PostgreSQL nao permite remover valores de enum diretamente
    # Para downgrade completo, seria necessario recriar o enum
    pass
