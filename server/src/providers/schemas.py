import uuid
from datetime import datetime
from typing import List

from src.core.schemas import CamelCaseModel


class CreateProviderRequest(CamelCaseModel):
    type: str  # LLM, WEB_SEARCH, STORAGE, EMBEDDING
    provider: str  # OPENAI, TAVILY, AWS_S3, etc.
    credentials: dict  # Credenciais do provedor (apiKey, accessKeyId, secretAccessKey, etc)


class ProviderResponse(CamelCaseModel):
    id: uuid.UUID
    type: str
    provider: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ProvidersListResponse(CamelCaseModel):
    providers: List[ProviderResponse]
