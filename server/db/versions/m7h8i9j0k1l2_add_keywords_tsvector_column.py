"""add keywords tsvector column

Revision ID: m7h8i9j0k1l2
Revises: l6g7h8i9j0k1
Create Date: 2025-01-30

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import TSVECTOR

# revision identifiers, used by Alembic.
revision: str = "m7h8i9j0k1l2"
down_revision: Union[str, None] = "l6g7h8i9j0k1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adiciona coluna keywords como generated column
    op.add_column(
        "document_chunks",
        sa.Column(
            "keywords",
            TSVECTOR,
            sa.Computed("to_tsvector('portuguese', coalesce(content, ''))", persisted=True),
        ),
    )
    # Cria indice GIN para busca full-text rapida
    op.create_index(
        "ix_document_chunks_keywords",
        "document_chunks",
        ["keywords"],
        postgresql_using="gin",
    )


def downgrade() -> None:
    op.drop_index("ix_document_chunks_keywords", table_name="document_chunks")
    op.drop_column("document_chunks", "keywords")
