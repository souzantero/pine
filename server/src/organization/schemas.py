import uuid
from datetime import datetime

from src.core.schemas import CamelCaseModel


class OrganizationResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    slug: str
    created_at: datetime


class CreateOrganizationRequest(CamelCaseModel):
    name: str
    slug: str


class UpdateOrganizationRequest(CamelCaseModel):
    name: str | None = None
    slug: str | None = None


class OrganizationDetailResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    slug: str
    created_at: datetime
    updated_at: datetime
