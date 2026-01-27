"""add knowledge permissions to existing admin roles

Revision ID: j4e5f6g7h8i9
Revises: i3d4e5f6g7h8
Create Date: 2025-01-26

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "j4e5f6g7h8i9"
down_revision: Union[str, None] = "i3d4e5f6g7h8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Novas permissoes a serem adicionadas
NEW_ADMIN_PERMISSIONS = [
    "COLLECTIONS_READ",
    "COLLECTIONS_CREATE",
    "COLLECTIONS_UPDATE",
    "COLLECTIONS_DELETE",
    "DOCUMENTS_READ",
    "DOCUMENTS_CREATE",
    "DOCUMENTS_UPDATE",
    "DOCUMENTS_DELETE",
]

NEW_MEMBER_PERMISSIONS = [
    "COLLECTIONS_READ",
    "DOCUMENTS_READ",
]


def upgrade() -> None:
    # Conexao para executar queries
    conn = op.get_bind()

    # Busca todas as roles Admin (system roles)
    admin_roles = conn.execute(
        sa.text(
            "SELECT id FROM roles WHERE name = 'Admin' AND is_system_role = true"
        )
    ).fetchall()

    # Adiciona permissoes para cada role Admin
    for (role_id,) in admin_roles:
        for permission in NEW_ADMIN_PERMISSIONS:
            # Verifica se a permissao ja existe para evitar duplicatas
            exists = conn.execute(
                sa.text(
                    "SELECT 1 FROM role_permissions WHERE role_id = :role_id AND permission = :permission"
                ),
                {"role_id": role_id, "permission": permission},
            ).fetchone()

            if not exists:
                conn.execute(
                    sa.text(
                        "INSERT INTO role_permissions (id, role_id, permission, created_at) "
                        "VALUES (gen_random_uuid(), :role_id, :permission, NOW())"
                    ),
                    {"role_id": role_id, "permission": permission},
                )

    # Busca todas as roles Membro (system roles)
    member_roles = conn.execute(
        sa.text(
            "SELECT id FROM roles WHERE name = 'Membro' AND is_system_role = true"
        )
    ).fetchall()

    # Adiciona permissoes para cada role Membro
    for (role_id,) in member_roles:
        for permission in NEW_MEMBER_PERMISSIONS:
            # Verifica se a permissao ja existe para evitar duplicatas
            exists = conn.execute(
                sa.text(
                    "SELECT 1 FROM role_permissions WHERE role_id = :role_id AND permission = :permission"
                ),
                {"role_id": role_id, "permission": permission},
            ).fetchone()

            if not exists:
                conn.execute(
                    sa.text(
                        "INSERT INTO role_permissions (id, role_id, permission, created_at) "
                        "VALUES (gen_random_uuid(), :role_id, :permission, NOW())"
                    ),
                    {"role_id": role_id, "permission": permission},
                )


def downgrade() -> None:
    conn = op.get_bind()

    # Remove permissoes das roles Admin
    admin_roles = conn.execute(
        sa.text(
            "SELECT id FROM roles WHERE name = 'Admin' AND is_system_role = true"
        )
    ).fetchall()

    for (role_id,) in admin_roles:
        for permission in NEW_ADMIN_PERMISSIONS:
            conn.execute(
                sa.text(
                    "DELETE FROM role_permissions WHERE role_id = :role_id AND permission = :permission"
                ),
                {"role_id": role_id, "permission": permission},
            )

    # Remove permissoes das roles Membro
    member_roles = conn.execute(
        sa.text(
            "SELECT id FROM roles WHERE name = 'Membro' AND is_system_role = true"
        )
    ).fetchall()

    for (role_id,) in member_roles:
        for permission in NEW_MEMBER_PERMISSIONS:
            conn.execute(
                sa.text(
                    "DELETE FROM role_permissions WHERE role_id = :role_id AND permission = :permission"
                ),
                {"role_id": role_id, "permission": permission},
            )
