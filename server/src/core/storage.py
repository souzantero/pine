"""Servico de armazenamento S3."""

import uuid
import logging
from datetime import datetime, UTC

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class S3Service:
    """Servico para upload/download de arquivos no S3."""

    def __init__(
        self,
        access_key_id: str,
        secret_access_key: str,
        region: str,
        bucket: str,
    ):
        """Inicializa o cliente S3.

        Args:
            access_key_id: AWS Access Key ID
            secret_access_key: AWS Secret Access Key
            region: Regiao AWS (ex: us-east-1)
            bucket: Nome do bucket S3
        """
        self.bucket = bucket
        self.region = region
        self.client = boto3.client(
            "s3",
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            region_name=region,
        )

    def _generate_file_key(self, organization_id: uuid.UUID, filename: str) -> str:
        """Gera uma chave unica para o arquivo no S3.

        Args:
            organization_id: ID da organizacao
            filename: Nome original do arquivo

        Returns:
            Chave do arquivo no formato: org_id/YYYY/MM/uuid_filename
        """
        now = datetime.now(UTC)
        unique_id = uuid.uuid4().hex[:8]
        # Sanitiza o filename removendo caracteres problematicos
        safe_filename = "".join(c if c.isalnum() or c in ".-_" else "_" for c in filename)
        return f"{organization_id}/{now.year}/{now.month:02d}/{unique_id}_{safe_filename}"

    def upload_file(
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

        Raises:
            ClientError: Se houver erro no upload
        """
        file_key = self._generate_file_key(organization_id, filename)

        try:
            self.client.put_object(
                Bucket=self.bucket,
                Key=file_key,
                Body=content,
                ContentType=content_type,
            )
            logger.info(f"Arquivo enviado para S3: {file_key}")
            return file_key
        except ClientError as e:
            logger.error(f"Erro ao enviar arquivo para S3: {e}")
            raise

    def download_file(self, file_key: str) -> bytes:
        """Faz download de um arquivo do S3.

        Args:
            file_key: Chave do arquivo no S3

        Returns:
            Conteudo do arquivo em bytes

        Raises:
            ClientError: Se houver erro no download
        """
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=file_key)
            content = response["Body"].read()
            logger.info(f"Arquivo baixado do S3: {file_key}")
            return content
        except ClientError as e:
            logger.error(f"Erro ao baixar arquivo do S3: {e}")
            raise

    def delete_file(self, file_key: str) -> None:
        """Remove um arquivo do S3.

        Args:
            file_key: Chave do arquivo no S3

        Raises:
            ClientError: Se houver erro na remocao
        """
        try:
            self.client.delete_object(Bucket=self.bucket, Key=file_key)
            logger.info(f"Arquivo removido do S3: {file_key}")
        except ClientError as e:
            logger.error(f"Erro ao remover arquivo do S3: {e}")
            raise

    def generate_presigned_url(self, file_key: str, expiration: int = 3600) -> str:
        """Gera uma URL pre-assinada para download do arquivo.

        Args:
            file_key: Chave do arquivo no S3
            expiration: Tempo de expiracao em segundos (default: 1 hora)

        Returns:
            URL pre-assinada para download

        Raises:
            ClientError: Se houver erro na geracao da URL
        """
        try:
            url = self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket, "Key": file_key},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            logger.error(f"Erro ao gerar URL pre-assinada: {e}")
            raise
