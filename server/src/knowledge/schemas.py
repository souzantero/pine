import uuid
from datetime import datetime
from typing import List

from src.core.schemas import CamelCaseModel


# =============================================================================
# Collection Schemas
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
