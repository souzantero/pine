import secrets
import uuid
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from src.auth import CurrentUser, check_permission
from src.database import get_session
from src.entities import Organization, OrganizationInvite, OrganizationMember, Permission, Role
from src.schemas import (
    CreateInviteRequest,
    InviteInfoResponse,
    InviteResponse,
    OrganizationResponse,
    RoleResponse,
)

router = APIRouter(tags=["invites"])

SessionDep = Annotated[Session, Depends(get_session)]


def generate_invite_token() -> str:
    """Gera um token unico para o convite."""
    return secrets.token_urlsafe(32)


@router.post(
    "/organizations/{organization_id}/invites",
    response_model=InviteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_invite(
    organization_id: uuid.UUID,
    payload: CreateInviteRequest,
    current_user: CurrentUser,
    session: SessionDep,
):
    """Cria um convite para a organizacao (requer MEMBERS_INVITE)."""
    # Verifica permissao
    if not check_permission(session, current_user.id, organization_id, Permission.MEMBERS_INVITE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao MEMBERS_INVITE necessaria",
        )

    # Verifica se a organizacao existe
    organization = session.get(Organization, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizacao nao encontrada",
        )

    # Verifica se a role existe e pertence a organizacao
    role = session.get(Role, payload.role_id)
    if not role or role.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role nao encontrada nesta organizacao",
        )

    # Cria o convite
    invite = OrganizationInvite(
        organization_id=organization_id,
        role_id=payload.role_id,
        token=generate_invite_token(),
        created_by_id=current_user.id,
        expires_at=datetime.now(UTC) + timedelta(days=payload.expires_in_days),
    )
    session.add(invite)
    session.commit()
    session.refresh(invite)

    return InviteResponse(
        id=invite.id,
        token=invite.token,
        organization=OrganizationResponse(
            id=organization.id,
            name=organization.name,
            slug=organization.slug,
            created_at=organization.created_at,
        ),
        role=RoleResponse(
            id=role.id,
            name=role.name,
            description=role.description,
        ),
        expires_at=invite.expires_at,
        created_at=invite.created_at,
    )


@router.get("/invites/{token}", response_model=InviteInfoResponse)
def get_invite_info(token: str, session: SessionDep):
    """Retorna informacoes publicas do convite (para pagina de aceite)."""
    # Busca o convite pelo token
    statement = select(OrganizationInvite).where(OrganizationInvite.token == token)
    invite = session.exec(statement).first()

    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Convite nao encontrado",
        )

    # Carrega relacionamentos
    session.refresh(invite, ["organization", "role"])

    now = datetime.now(UTC)
    # Compara como naive datetime se expires_at nao tem timezone
    expires_at = invite.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    is_expired = expires_at < now
    is_used = invite.used_at is not None

    return InviteInfoResponse(
        organization_name=invite.organization.name,
        organization_slug=invite.organization.slug,
        role_name=invite.role.name,
        expires_at=invite.expires_at,
        is_expired=is_expired,
        is_used=is_used,
    )


@router.post("/invites/{token}/accept", status_code=status.HTTP_201_CREATED)
def accept_invite(token: str, current_user: CurrentUser, session: SessionDep):
    """Aceita um convite e adiciona o usuario a organizacao."""
    # Busca o convite pelo token
    statement = select(OrganizationInvite).where(OrganizationInvite.token == token)
    invite = session.exec(statement).first()

    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Convite nao encontrado",
        )

    # Verifica se ja foi usado
    if invite.used_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Convite ja foi utilizado",
        )

    # Verifica se expirou
    now = datetime.now(UTC)
    expires_at = invite.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if expires_at < now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Convite expirado",
        )

    # Verifica se usuario ja e membro
    member_statement = select(OrganizationMember).where(
        OrganizationMember.user_id == current_user.id,
        OrganizationMember.organization_id == invite.organization_id,
    )
    existing_member = session.exec(member_statement).first()

    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voce ja e membro desta organizacao",
        )

    # Cria o membership
    member = OrganizationMember(
        user_id=current_user.id,
        organization_id=invite.organization_id,
        role_id=invite.role_id,
        is_owner=False,
    )
    session.add(member)

    # Marca convite como usado
    invite.used_at = now
    invite.used_by_id = current_user.id
    session.add(invite)

    session.commit()

    return {"message": "Convite aceito com sucesso"}
