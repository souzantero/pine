import uuid
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel import Session, select

from src.core.database import DatabaseSession
from src.core.entities import OrganizationMember, Permission, RolePermission, User

from .utils import bearer_scheme, decode_token


# Dependency para obter o usuario atual
async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    db: DatabaseSession,
) -> User:
    """Dependency que retorna o usuario autenticado ou 401."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalido ou expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(credentials.credentials)
    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.get(User, uuid.UUID(user_id))
    if user is None:
        raise credentials_exception

    return user


# Type alias para usar como dependency
CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_membership(
    organization_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
) -> OrganizationMember:
    """Dependency que retorna o membership do usuario na organizacao ou 403."""
    statement = select(OrganizationMember).where(
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.organization_id == organization_id,
    )
    membership = db.exec(statement).first()

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Voce nao e membro desta organizacao",
        )

    return membership


# Type alias para membership
CurrentMembership = Annotated[OrganizationMember, Depends(get_current_membership)]


def get_user_permissions(db: Session, user_id: uuid.UUID, organization_id: uuid.UUID) -> set[Permission]:
    """Retorna o conjunto de permissoes do usuario na organizacao."""
    member_statement = select(OrganizationMember).where(
        OrganizationMember.user_id == user_id,
        OrganizationMember.organization_id == organization_id,
    )
    member = db.exec(member_statement).first()

    if not member:
        return set()

    permissions_statement = select(RolePermission).where(RolePermission.role_id == member.role_id)
    role_permissions = db.exec(permissions_statement).all()

    return {rp.permission for rp in role_permissions}


def check_permission(
    db: Session,
    user_id: uuid.UUID,
    organization_id: uuid.UUID,
    required_permission: Permission,
) -> bool:
    """Verifica se o usuario tem a permissao na organizacao."""
    permissions = get_user_permissions(db, user_id, organization_id)
    return required_permission in permissions


def require_permission(required_permission: Permission):
    """
    Factory de dependency que verifica se o usuario tem a permissao.
    Uso: Depends(require_permission(Permission.THREADS_WRITE))
    """

    async def permission_checker(
        current_user: CurrentUser,
        db: DatabaseSession,
        organization_id: uuid.UUID,
    ) -> User:
        if not check_permission(db, current_user.id, organization_id, required_permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permissao {required_permission.value} necessaria",
            )
        return current_user

    return permission_checker
