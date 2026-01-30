"""Factory functions para criacao de servicos do knowledge."""

import logging
import uuid

from sqlmodel import Session, select

from src.core.storage import S3Service
from src.database.entities import (
    OrganizationConfig,
    OrganizationProvider,
    ConfigType,
    ConfigKey,
    ProviderType,
    Provider,
)
from .services import (
    StorageService,
    ExtractionService,
    ChunkingService,
    ChunkingConfig,
    EmbeddingService,
    EmbeddingConfig,
)

logger = logging.getLogger(__name__)


class ConfigurationError(Exception):
    """Erro de configuracao."""

    pass


def get_knowledge_config(db: Session, organization_id: uuid.UUID) -> dict | None:
    """Obtem a configuracao de knowledge da organizacao.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        Dict com configuracoes ou None se nao configurado
    """
    statement = select(OrganizationConfig).where(
        OrganizationConfig.organization_id == organization_id,
        OrganizationConfig.type == ConfigType.FEATURE,
        OrganizationConfig.key == ConfigKey.KNOWLEDGE,
        OrganizationConfig.is_enabled == True,
    )
    config = db.exec(statement).first()

    if not config:
        logger.warning(f"Knowledge nao configurado para organizacao {organization_id}")
        return None

    return config.config


def get_storage_service(db: Session, organization_id: uuid.UUID) -> StorageService:
    """Cria um StorageService configurado para a organizacao.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        StorageService configurado

    Raises:
        ConfigurationError: Se as credenciais ou config nao estiverem configuradas
    """
    # Busca credenciais do provider S3
    statement = select(OrganizationProvider).where(
        OrganizationProvider.organization_id == organization_id,
        OrganizationProvider.type == ProviderType.STORAGE,
        OrganizationProvider.provider == Provider.AWS_S3,
        OrganizationProvider.is_active == True,
    )
    provider = db.exec(statement).first()

    if not provider:
        raise ConfigurationError("Provider S3 nao configurado")

    credentials = provider.credentials
    access_key_id = credentials.get("accessKeyId")
    secret_access_key = credentials.get("apiKey")

    if not access_key_id or not secret_access_key:
        raise ConfigurationError("Credenciais S3 incompletas")

    # Busca config de knowledge
    knowledge_config = get_knowledge_config(db, organization_id)
    if not knowledge_config:
        raise ConfigurationError("Configuracao de knowledge nao encontrada")

    storage_settings = knowledge_config.get("storage", {})
    bucket = storage_settings.get("bucket")
    region = storage_settings.get("region")

    if not bucket or not region:
        raise ConfigurationError("Bucket ou region nao configurados")

    s3_service = S3Service(
        access_key_id=access_key_id,
        secret_access_key=secret_access_key,
        region=region,
        bucket=bucket,
    )

    return StorageService(s3_service)


def get_extraction_service() -> ExtractionService:
    """Cria um ExtractionService.

    Returns:
        ExtractionService (nao requer configuracao)
    """
    return ExtractionService()


def get_chunking_config(db: Session, organization_id: uuid.UUID) -> ChunkingConfig:
    """Obtem a configuracao de chunking da organizacao.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        ChunkingConfig com valores da config ou defaults
    """
    knowledge_config = get_knowledge_config(db, organization_id)

    if not knowledge_config:
        return ChunkingConfig()

    embedding_settings = knowledge_config.get("embedding", {})
    return ChunkingConfig(
        chunk_size=embedding_settings.get("chunkSize", 1000),
        chunk_overlap=embedding_settings.get("chunkOverlap", 200),
    )


def get_chunking_service(db: Session, organization_id: uuid.UUID) -> ChunkingService:
    """Cria um ChunkingService configurado para a organizacao.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        ChunkingService configurado
    """
    config = get_chunking_config(db, organization_id)
    return ChunkingService(config)


def get_embedding_config(db: Session, organization_id: uuid.UUID) -> EmbeddingConfig | None:
    """Obtem a configuracao de embedding da organizacao.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        EmbeddingConfig ou None se nao configurado
    """
    knowledge_config = get_knowledge_config(db, organization_id)
    if not knowledge_config:
        return None

    embedding_settings = knowledge_config.get("embedding", {})
    provider_str = embedding_settings.get("provider", "OPENAI")
    model = embedding_settings.get("model", "text-embedding-ada-002")

    # Converte string para enum
    try:
        provider_enum = Provider(provider_str)
    except ValueError:
        logger.warning(f"Provider de embedding invalido: {provider_str}")
        return None

    # Busca credenciais do provider
    statement = select(OrganizationProvider).where(
        OrganizationProvider.organization_id == organization_id,
        OrganizationProvider.type == ProviderType.EMBEDDING,
        OrganizationProvider.provider == provider_enum,
        OrganizationProvider.is_active == True,
    )
    provider = db.exec(statement).first()

    if not provider:
        logger.warning(f"Provider de embedding {provider_str} nao configurado")
        return None

    api_key = provider.credentials.get("apiKey")
    if not api_key:
        logger.warning("API key de embedding nao encontrada")
        return None

    return EmbeddingConfig(api_key=api_key, model=model)


def get_embedding_service(db: Session, organization_id: uuid.UUID) -> EmbeddingService | None:
    """Cria um EmbeddingService configurado para a organizacao.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        EmbeddingService ou None se nao configurado
    """
    config = get_embedding_config(db, organization_id)
    if not config:
        return None
    return EmbeddingService(config)
