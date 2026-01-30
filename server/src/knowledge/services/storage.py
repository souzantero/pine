"""Servico de armazenamento para documentos."""

import logging
import uuid

from src.core.storage import S3Service

logger = logging.getLogger(__name__)


class StorageService:
    """Servico para upload e download de documentos no S3."""

    def __init__(self, s3_service: S3Service):
        """Inicializa o servico de armazenamento.

        Args:
            s3_service: Instancia configurada do S3Service
        """
        self.s3 = s3_service

    def upload(
        self,
        content: bytes,
        filename: str,
        content_type: str,
        organization_id: uuid.UUID,
    ) -> str:
        """Faz upload de um arquivo para o S3.

        Args:
            content: Conteudo do arquivo em bytes
            filename: Nome original do arquivo
            content_type: MIME type do arquivo
            organization_id: ID da organizacao

        Returns:
            file_key: Chave do arquivo no S3
        """
        file_key = self.s3.upload_file(
            content=content,
            filename=filename,
            content_type=content_type,
            organization_id=organization_id,
        )
        logger.info(f"Documento enviado: {file_key}")
        return file_key

    def download(self, file_key: str) -> bytes:
        """Faz download de um arquivo do S3.

        Args:
            file_key: Chave do arquivo no S3

        Returns:
            Conteudo do arquivo em bytes
        """
        content = self.s3.download_file(file_key)
        logger.info(f"Documento baixado: {file_key} ({len(content)} bytes)")
        return content

    def delete(self, file_key: str) -> None:
        """Remove um arquivo do S3.

        Args:
            file_key: Chave do arquivo no S3
        """
        self.s3.delete_file(file_key)
        logger.info(f"Documento removido: {file_key}")

    def get_download_url(self, file_key: str, expiration: int = 3600) -> str:
        """Gera uma URL pre-assinada para download do arquivo.

        Args:
            file_key: Chave do arquivo no S3
            expiration: Tempo de expiracao em segundos (default: 1 hora)

        Returns:
            URL pre-assinada para download
        """
        return self.s3.generate_presigned_url(file_key, expiration)
