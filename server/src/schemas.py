import uuid
from datetime import datetime
from typing import List

from langchain_core.messages import HumanMessage
from pydantic import BaseModel, ConfigDict


def to_camel(string: str) -> str:
    """Converte snake_case para camelCase."""
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class CamelCaseModel(BaseModel):
    """Base model que serializa campos em camelCase."""

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
        serialize_by_alias=True,
    )


# =============================================================================
# Agent Schemas
# =============================================================================


class MessageInput(CamelCaseModel):
    content: str

    def to_agent(self):
        return HumanMessage(content=self.content)


class RunInput(CamelCaseModel):
    messages: List[MessageInput]


class RunConfig(CamelCaseModel):
    """Configuracao de execucao."""

    provider: str  # OPENAI, OPENROUTER
    model: str


class RunRequest(CamelCaseModel):
    input: RunInput
    config: RunConfig


# =============================================================================
# Thread Schemas
# =============================================================================


class CreateThreadRequest(CamelCaseModel):
    title: str | None = None


class UpdateThreadRequest(CamelCaseModel):
    title: str | None = None


class ThreadResponse(CamelCaseModel):
    id: uuid.UUID
    title: str | None
    last_message_at: datetime | None
    last_message_preview: str | None
    created_by_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class AgentMessageResponse(CamelCaseModel):
    """Mensagem do agente serializada em camelCase."""
    id: str | None = None
    type: str | None = None
    content: str | None = None
    response_metadata: dict | None = None
    tool_calls: List[dict] | None = None
    additional_kwargs: dict | None = None
    created_at: str | None = None


class ThreadMessagesResponse(CamelCaseModel):
    """Resposta com lista de mensagens da thread."""
    messages: List[AgentMessageResponse]


# =============================================================================
# Provider Schemas
# =============================================================================


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


# =============================================================================
# Models Schemas
# =============================================================================


class ModelInfo(CamelCaseModel):
    id: str
    name: str
    description: str | None = None


class ModelsResponse(CamelCaseModel):
    models: List[ModelInfo]
    configured_providers: List[str]


# =============================================================================
# Organization Config Schemas
# =============================================================================


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


# =============================================================================
# Document Collection Schemas
# =============================================================================


class CreateCollectionRequest(CamelCaseModel):
    name: str
    description: str | None = None


class UpdateCollectionRequest(CamelCaseModel):
    name: str | None = None
    description: str | None = None


class CollectionResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    document_count: int = 0
    created_at: datetime
    updated_at: datetime


class CollectionListResponse(CamelCaseModel):
    collections: List[CollectionResponse]


class CollectionDetailResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    document_count: int
    created_at: datetime
    updated_at: datetime


# =============================================================================
# Document Schemas
# =============================================================================


class DocumentResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    file_size: int
    mime_type: str
    status: str  # PENDING, PROCESSING, COMPLETED, FAILED
    error_message: str | None
    chunk_count: int
    created_at: datetime
    updated_at: datetime


class DocumentListResponse(CamelCaseModel):
    documents: List[DocumentResponse]


class DocumentDetailResponse(CamelCaseModel):
    id: uuid.UUID
    name: str
    file_size: int
    mime_type: str
    status: str
    error_message: str | None
    chunk_count: int
    download_url: str | None = None  # URL pre-assinada para download
    created_at: datetime
    updated_at: datetime
