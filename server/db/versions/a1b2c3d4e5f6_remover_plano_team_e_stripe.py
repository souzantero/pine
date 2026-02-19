"""Remover plano Team e Stripe, manter Free + Enterprise

Revision ID: a1b2c3d4e5f6
Revises: 30dbadf5a3ef
Create Date: 2026-02-19 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '30dbadf5a3ef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Renomeia TEAM -> ENTERPRISE no enum e remove colunas Stripe."""
    # Renomear valor do enum organizationplan
    op.execute("ALTER TYPE organizationplan RENAME VALUE 'TEAM' TO 'ENTERPRISE'")

    # Remover indices das colunas Stripe
    op.drop_index('ix_organization_billing_stripe_customer_id', table_name='organization_billing')
    op.drop_index('ix_organization_billing_stripe_subscription_id', table_name='organization_billing')

    # Remover colunas Stripe
    op.drop_column('organization_billing', 'stripe_customer_id')
    op.drop_column('organization_billing', 'stripe_subscription_id')


def downgrade() -> None:
    """Restaura colunas Stripe e renomeia ENTERPRISE -> TEAM."""
    import sqlalchemy as sa

    op.add_column('organization_billing', sa.Column('stripe_customer_id', sa.VARCHAR(), nullable=True))
    op.add_column('organization_billing', sa.Column('stripe_subscription_id', sa.VARCHAR(), nullable=True))
    op.create_index('ix_organization_billing_stripe_customer_id', 'organization_billing', ['stripe_customer_id'])
    op.create_index('ix_organization_billing_stripe_subscription_id', 'organization_billing', ['stripe_subscription_id'])

    op.execute("ALTER TYPE organizationplan RENAME VALUE 'ENTERPRISE' TO 'TEAM'")
