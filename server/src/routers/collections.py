"""Router para gerenciamento de colecoes de documentos."""

import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select, func

from src.auth import CurrentUser, check_permission
from src.database import DatabaseSession
from src.entities import DocumentCollection, Document, Permission

from src.schemas import (
    CreateCollectionRequest,
    UpdateCollectionRequest,
    CollectionResponse,
    CollectionListResponse,
    CollectionDetailResponse,
)

router = APIRouter(
    prefix="/organizations/{organization_id}/collections",
    tags=["collections"],
)


def collection_to_response(collection: DocumentCollection, document_count: int = 0) -> CollectionResponse:
    """Converte entidade para response."""
    return CollectionResponse(
        id=collection.id,
        name=collection.name,
        description=collection.description,
        document_count=document_count,
        created_at=collection.created_at,
        updated_at=collection.updated_at,
    )


@router.get("", response_model=CollectionListResponse)
def list_collections(
    organization_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Lista todas as colecoes da organizacao (requer COLLECTIONS_READ)."""
    if not check_permission(db, current_user.id, organization_id, Permission.COLLECTIONS_READ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao COLLECTIONS_READ necessaria",
        )

    # Busca colecoes com contagem de documentos
    statement = (
        select(
            DocumentCollection,
            func.count(Document.id).label("document_count"),
        )
        .outerjoin(Document, Document.collection_id == DocumentCollection.id)
        .where(DocumentCollection.organization_id == organization_id)
        .group_by(DocumentCollection.id)
        .order_by(DocumentCollection.updated_at.desc())
    )

    results = db.exec(statement).all()

    collections = [
        collection_to_response(collection, document_count)
        for collection, document_count in results
    ]

    return CollectionListResponse(collections=collections)


@router.get("/{collection_id}", response_model=CollectionDetailResponse)
def get_collection(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Retorna detalhes de uma colecao (requer COLLECTIONS_READ)."""
    if not check_permission(db, current_user.id, organization_id, Permission.COLLECTIONS_READ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao COLLECTIONS_READ necessaria",
        )

    statement = (
        select(
            DocumentCollection,
            func.count(Document.id).label("document_count"),
        )
        .outerjoin(Document, Document.collection_id == DocumentCollection.id)
        .where(
            DocumentCollection.id == collection_id,
            DocumentCollection.organization_id == organization_id,
        )
        .group_by(DocumentCollection.id)
    )

    result = db.exec(statement).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Colecao nao encontrada",
        )

    collection, document_count = result

    return CollectionDetailResponse(
        id=collection.id,
        name=collection.name,
        description=collection.description,
        document_count=document_count,
        created_at=collection.created_at,
        updated_at=collection.updated_at,
    )


@router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
def create_collection(
    organization_id: uuid.UUID,
    payload: CreateCollectionRequest,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Cria uma nova colecao (requer COLLECTIONS_CREATE)."""
    if not check_permission(db, current_user.id, organization_id, Permission.COLLECTIONS_CREATE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao COLLECTIONS_CREATE necessaria",
        )

    # Valida nome
    if not payload.name or not payload.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nome da colecao e obrigatorio",
        )

    collection = DocumentCollection(
        organization_id=organization_id,
        name=payload.name.strip(),
        description=payload.description.strip() if payload.description else None,
    )

    db.add(collection)
    db.commit()
    db.refresh(collection)

    return collection_to_response(collection, 0)


@router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    payload: UpdateCollectionRequest,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Atualiza uma colecao (requer COLLECTIONS_UPDATE)."""
    if not check_permission(db, current_user.id, organization_id, Permission.COLLECTIONS_UPDATE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao COLLECTIONS_UPDATE necessaria",
        )

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

    if payload.name is not None:
        if not payload.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nome da colecao nao pode ser vazio",
            )
        collection.name = payload.name.strip()

    if payload.description is not None:
        collection.description = payload.description.strip() if payload.description else None

    db.add(collection)
    db.commit()
    db.refresh(collection)

    # Conta documentos
    count_statement = select(func.count(Document.id)).where(Document.collection_id == collection_id)
    document_count = db.exec(count_statement).one()

    return collection_to_response(collection, document_count)


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(
    organization_id: uuid.UUID,
    collection_id: uuid.UUID,
    current_user: CurrentUser,
    db: DatabaseSession,
):
    """Remove uma colecao e todos os seus documentos (requer COLLECTIONS_DELETE)."""
    if not check_permission(db, current_user.id, organization_id, Permission.COLLECTIONS_DELETE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissao COLLECTIONS_DELETE necessaria",
        )

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

    # Remove arquivos do S3 para cada documento
    # Nota: Em producao, isso deveria ser feito em background
    from src.services import DocumentProcessor, DocumentProcessorError

    try:
        processor = DocumentProcessor(db, organization_id)
        for document in collection.documents:
            try:
                processor.delete_document_files(document)
            except DocumentProcessorError:
                pass  # Ignora erros de remocao de arquivos
    except DocumentProcessorError:
        pass  # S3 nao configurado, ignora

    # Remove colecao (cascade remove documentos e chunks)
    db.delete(collection)
    db.commit()
