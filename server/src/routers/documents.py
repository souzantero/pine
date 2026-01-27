"""Router para gerenciamento de documentos."""

import uuid
import logging

from fastapi import APIRouter, HTTPException, status, UploadFile, File
from sqlmodel import select

from src.auth import CurrentUser, check_permission
from src.database import DatabaseSession
from src.entities import DocumentCollection, Document, DocumentStatus, Permission
from src.services import DocumentProcessor, DocumentProcessorError
from src.schemas import (
    DocumentResponse,
    DocumentListResponse,
    DocumentDetailResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/organizations/{organization_id}/collections/{collection_id}/documents",
    tags=["documents"],
)

# Limite de tamanho de arquivo: 50 MB
MAX_FILE_SIZE = 50 * 1024 * 1024
ALLOWED_MIME_TYPES = ["application/pdf"]


def document_to_response(document: Document) -> DocumentResponse:
    """Converte entidade para response."""
    return DocumentResponse(
        id=document.id,
        name=document.name,
        file_size=document.file_size,
        mime_type=document.mime_type,
        status=document.status.value,
        error_message=document.error_message,
        chunk_count=document.chunk_count,
        created_at=document.created_at,
        updated_at=document.updated_at,
    )


def get_collection_or_404(
    db: DatabaseSession,
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
) -> DocumentCollection:
    """Busca colecao ou levanta 404."""
    statement = select(DocumentCollection).where(
        DocumentCollection.id == collection_id,
        DocumentCollection.organization_id == organization_id,
    )
    collection = db.exec(statement).first()

    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Colecao nao encontrada",
        )

    return collection


@router.get("", response_model=DocumentListResponse)
def list_documents(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Lista todos os documentos de uma colecao (requer DOCUMENTS_READ)."""
    if not check_permission(db, current_user.id, organization_id, Permission.DOCUMENTS_READ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao DOCUMENTS_READ necessaria",
        )

    # Verifica se colecao existe
    get_collection_or_404(db, organization_id, collection_id)

    statement = (
        select(Document)
        .where(Document.collection_id == collection_id)
        .order_by(Document.created_at.desc())
    )
    documents = db.exec(statement).all()

    return DocumentListResponse(documents=[document_to_response(d) for d in documents])


@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    document_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Retorna detalhes de um documento com URL de download (requer DOCUMENTS_READ)."""
    if not check_permission(db, current_user.id, organization_id, Permission.DOCUMENTS_READ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao DOCUMENTS_READ necessaria",
        )

    # Verifica se colecao existe
    get_collection_or_404(db, organization_id, collection_id)

    statement = select(Document).where(
        Document.id == document_id,
        Document.collection_id == collection_id,
    )
    document = db.exec(statement).first()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento nao encontrado",
        )

    # Gera URL de download
    download_url = None
    try:
        processor = DocumentProcessor(db, organization_id)
        s3 = processor._get_s3_service()
        download_url = s3.generate_presigned_url(document.file_key, expiration=3600)
    except DocumentProcessorError as e:
        logger.warning(f"Nao foi possivel gerar URL de download: {e}")

    return DocumentDetailResponse(
        id=document.id,
        name=document.name,
        file_size=document.file_size,
        mime_type=document.mime_type,
        status=document.status.value,
        error_message=document.error_message,
        chunk_count=document.chunk_count,
        download_url=download_url,
        created_at=document.created_at,
        updated_at=document.updated_at,
    )


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
    file: UploadFile = File(...),
):
    """Upload de documento PDF (requer DOCUMENTS_CREATE).

    O documento e enviado para o S3 e processado de forma sincrona:
    - Extrai texto do PDF
    - Divide em chunks
    - Gera embeddings
    - Salva no banco
    """
    if not check_permission(db, current_user.id, organization_id, Permission.DOCUMENTS_CREATE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao DOCUMENTS_CREATE necessaria",
        )

    # Verifica se colecao existe
    get_collection_or_404(db, organization_id, collection_id)

    # Valida tipo de arquivo
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de arquivo nao suportado: {file.content_type}. Apenas PDF e aceito.",
        )

    # Le conteudo do arquivo
    content = await file.read()
    file_size = len(content)

    # Valida tamanho
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Arquivo muito grande. Tamanho maximo: {MAX_FILE_SIZE // (1024*1024)} MB",
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo vazio",
        )

    # Inicializa processador
    try:
        processor = DocumentProcessor(db, organization_id)
        s3 = processor._get_s3_service()
    except DocumentProcessorError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Upload para S3
    try:
        file_key = s3.upload_file(
            content=content,
            filename=file.filename or "document.pdf",
            content_type=file.content_type or "application/pdf",
            organization_id=organization_id,
        )
    except Exception as e:
        logger.error(f"Erro ao enviar arquivo para S3: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao enviar arquivo para armazenamento",
        )

    # Cria registro do documento
    document = Document(
        collection_id=collection_id,
        name=file.filename or "document.pdf",
        file_key=file_key,
        file_size=file_size,
        mime_type=file.content_type or "application/pdf",
        status=DocumentStatus.PENDING,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Processa documento (sincrono)
    try:
        processor.process_document(document)
        db.refresh(document)
    except DocumentProcessorError as e:
        logger.error(f"Erro ao processar documento: {e}")
        # Documento ja foi marcado como FAILED pelo processor
        db.refresh(document)

    return document_to_response(document)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    document_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Remove um documento e seus chunks (requer DOCUMENTS_DELETE)."""
    if not check_permission(db, current_user.id, organization_id, Permission.DOCUMENTS_DELETE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao DOCUMENTS_DELETE necessaria",
        )

    # Verifica se colecao existe
    get_collection_or_404(db, organization_id, collection_id)

    statement = select(Document).where(
        Document.id == document_id,
        Document.collection_id == collection_id,
    )
    document = db.exec(statement).first()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento nao encontrado",
        )

    # Remove arquivo do S3
    try:
        processor = DocumentProcessor(db, organization_id)
        processor.delete_document_files(document)
    except DocumentProcessorError:
        pass  # S3 nao configurado ou erro, ignora

    # Remove documento (cascade remove chunks)
    db.delete(document)
    db.commit()
