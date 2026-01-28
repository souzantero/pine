import uuid
from datetime import datetime
from typing import List

from src.core.schemas import CamelCaseModel


class RoleResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    description: str | None


class CreateRoleRequest(CamelCaseModel):
    name: str
    description: str | None = None
    permissions: List[str]


class UpdateRoleRequest(CamelCaseModel):
    name: str | None = None
    description: str | None = None
    permissions: List[str] | None = None


class RoleDetailResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    is_system_role: bool
    permissions: List[str]
    created_at: datetime
