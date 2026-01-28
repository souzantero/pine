import uuid
from datetime import datetime
from typing import List

from src.core.schemas import CamelCaseModel


class CreateOrgConfigRequest(CamelCaseModel):
    type: str  # TOOL, FEATURE, etc.
    key: str  # WEB_SEARCH, etc.
    is_enabled: bool = True
    config: dict = {}  # Configuracoes especificas


class UpdateOrgConfigRequest(CamelCaseModel):
    is_enabled: bool | None = None
    config: dict | None = None  # Configuracoes especificas


class OrgConfigResponse(CamelCaseModel):
    id: uuid.UUID
    type: str
    key: str
    is_enabled: bool
    config: dict
    created_at: datetime
    updated_at: datetime


class OrgConfigsListResponse(CamelCaseModel):
    configs: List[OrgConfigResponse]
