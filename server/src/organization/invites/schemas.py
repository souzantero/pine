import uuid
from datetime import datetime
from typing import List

from src.organization.schemas import OrganizationResponse
from src.roles.schemas import RoleResponse
from src.schemas import CamelCaseModel


class CreateInviteRequest(CamelCaseModel):
    role_id: uuid.UUID
    expires_in_days: int = 7


class InviteResponse(CamelCaseModel):
    id: uuid.UUID
    token: str
    invite_link: str
    organization: OrganizationResponse
    role: RoleResponse
    expires_at: datetime
    created_at: datetime


class InviteInfoOrganization(CamelCaseModel):
    """Organizacao do convite (info publica)."""
    name: str
    slug: str


class InviteInfoRole(CamelCaseModel):
    """Role do convite (info publica)."""
    name: str


class InviteInfoCreatedBy(CamelCaseModel):
    """Usuario que criou o convite (info publica)."""
    name: str


class InviteInfoResponse(CamelCaseModel):
    """Informacoes publicas do convite (para pagina de aceite)."""
    organization: InviteInfoOrganization
    role: InviteInfoRole
    created_by: InviteInfoCreatedBy
    expires_at: datetime
    is_expired: bool
    is_used: bool


class InviteCreatedByResponse(CamelCaseModel):
    """Informacoes do usuario que criou o convite."""
    id: uuid.UUID
    name: str
    email: str


class InviteListItemResponse(CamelCaseModel):
    """Item da listagem de convites pendentes."""
    id: uuid.UUID
    token: str
    invite_link: str
    role: RoleResponse
    created_by: InviteCreatedByResponse
    expires_at: datetime
    created_at: datetime
