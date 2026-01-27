"""add collections feature

Revision ID: h2c3d4e5f6g7
Revises: g1b2c3d4e5f6
Create Date: 2025-01-26

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "h2c3d4e5f6g7"
down_revision: Union[str, None] = "g1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Habilitar extensao pgvector
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # 2. Criar enum DocumentStatus
    op.execute(
        "CREATE TYPE documentstatus AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')"
    )

    # 3. Adicionar novas permissoes ao enum permission
    permissions = [
        "COLLECTIONS_READ",
        "COLLECTIONS_CREATE",
        "COLLECTIONS_UPDATE",
        "COLLECTIONS_DELETE",
        "DOCUMENTS_READ",
        "DOCUMENTS_CREATE",
        "DOCUMENTS_UPDATE",
        "DOCUMENTS_DELETE",
    ]
    for perm in permissions:
        op.execute(f"ALTER TYPE permission ADD VALUE IF NOT EXISTS '{perm}'")

    # 4. Criar tabela document_collections
    op.create_table(
        "document_collections",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("organization_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_document_collections_organization_id",
        "document_collections",
        ["organization_id"],
    )

    # 5. Criar tabela documents
    op.create_table(
        "documents",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("collection_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("file_key", sa.String(), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("mime_type", sa.String(), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
                name="documentstatus",
                create_type=False,
            ),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column("error_message", sa.String(), nullable=True),
        sa.Column("chunk_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["collection_id"],
            ["document_collections.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_documents_collection_id", "documents", ["collection_id"])

    # 6. Criar tabela document_chunks com coluna de embedding vetorial
    op.create_table(
        "document_chunks",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("document_id", sa.UUID(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(1536), nullable=True),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("chunk_metadata", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["documents.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_document_chunks_document_id", "document_chunks", ["document_id"])

    # 7. Criar indice HNSW para busca vetorial eficiente
    op.execute(
        """
        CREATE INDEX ix_document_chunks_embedding
        ON document_chunks USING hnsw (embedding vector_cosine_ops)
        """
    )


def downgrade() -> None:
    # Remover indice HNSW
    op.execute("DROP INDEX IF EXISTS ix_document_chunks_embedding")

    # Remover tabelas na ordem correta (dependencias primeiro)
    op.drop_table("document_chunks")
    op.drop_table("documents")
    op.drop_table("document_collections")

    # Remover enum DocumentStatus
    op.execute("DROP TYPE IF EXISTS documentstatus")

    # Nota: Nao removemos as permissoes do enum pois PostgreSQL nao suporta
    # remocao de valores de enum facilmente
