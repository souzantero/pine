"""add organization billing table

Revision ID: p0k1l2m3n4o5
Revises: o9j0k1l2m3n4
Create Date: 2026-02-01
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "p0k1l2m3n4o5"
down_revision: Union[str, None] = "o9j0k1l2m3n4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Criar enum organizationplan (se nao existir)
    organization_plan = postgresql.ENUM("FREE", "TEAM", name="organizationplan", create_type=False)
    organization_plan.create(op.get_bind(), checkfirst=True)

    # Criar tabela organization_billing
    op.create_table(
        "organization_billing",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("organization_id", sa.UUID(), nullable=False),
        sa.Column(
            "plan",
            postgresql.ENUM("FREE", "TEAM", name="organizationplan", create_type=False),
            nullable=False,
            server_default="FREE",
        ),
        sa.Column("stripe_customer_id", sa.String(), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(), nullable=True),
        sa.Column("tool_calls_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "tool_calls_reset_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("storage_used_bytes", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.UniqueConstraint("organization_id"),
    )

    # Criar indices
    op.create_index(
        "ix_organization_billing_organization_id",
        "organization_billing",
        ["organization_id"],
    )
    op.create_index(
        "ix_organization_billing_stripe_customer_id",
        "organization_billing",
        ["stripe_customer_id"],
    )
    op.create_index(
        "ix_organization_billing_stripe_subscription_id",
        "organization_billing",
        ["stripe_subscription_id"],
    )

    # Criar registro de billing para organizacoes existentes
    op.execute(
        """
        INSERT INTO organization_billing (id, organization_id, plan, tool_calls_count, tool_calls_reset_at, storage_used_bytes, created_at, updated_at)
        SELECT gen_random_uuid(), id, 'FREE', 0, now(), 0, now(), now()
        FROM organizations
        WHERE id NOT IN (SELECT organization_id FROM organization_billing)
        """
    )


def downgrade() -> None:
    op.drop_index("ix_organization_billing_stripe_subscription_id", table_name="organization_billing")
    op.drop_index("ix_organization_billing_stripe_customer_id", table_name="organization_billing")
    op.drop_index("ix_organization_billing_organization_id", table_name="organization_billing")
    op.drop_table("organization_billing")

    organization_plan = postgresql.ENUM("FREE", "TEAM", name="organizationplan", create_type=False)
    organization_plan.drop(op.get_bind(), checkfirst=True)
