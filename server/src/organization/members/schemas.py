import uuid
from datetime import datetime

from src.roles.schemas import RoleResponse
from src.core.schemas import CamelCaseModel


class MemberUserResponse(CamelCaseModel):
    id: uuid.UUID
    email: str
    name: str


class MemberDetailResponse(CamelCaseModel):
    id: uuid.UUID
    user: MemberUserResponse
    role: RoleResponse
    is_owner: bool
    created_at: datetime


class UpdateMemberRoleRequest(CamelCaseModel):
    role_id: uuid.UUID
