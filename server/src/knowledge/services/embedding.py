"""Servico de geracao de embeddings."""

import logging
from dataclasses import dataclass

from langchain_openai import OpenAIEmbeddings

logger = logging.getLogger(__name__)


@dataclass
class EmbeddingConfig:
    """Configuracao do servico de embedding."""

    api_key: str
    model: str = "text-embedding-ada-002"


class EmbeddingError(Exception):
    """Erro durante geracao de embeddings."""

    pass


class EmbeddingService:
    """Servico para geracao de embeddings de texto."""

    def __init__(self, config: EmbeddingConfig):
        """Inicializa o servico de embedding.

        Args:
            config: Configuracao com api_key e modelo
        """
        self.config = config
        self.client = OpenAIEmbeddings(
            openai_api_key=config.api_key,
            model=config.model,
        )

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Gera embeddings para uma lista de textos.

        Args:
            texts: Lista de textos para gerar embeddings

        Returns:
            Lista de embeddings (vetores de floats)

        Raises:
            EmbeddingError: Se houver erro na geracao
        """
        if not texts:
            return []

        try:
            embeddings = self.client.embed_documents(texts)
            logger.info(f"Gerados {len(embeddings)} embeddings")
            return embeddings
        except Exception as e:
            logger.error(f"Erro ao gerar embeddings: {e}")
            raise EmbeddingError(f"Erro ao gerar embeddings: {e}") from e

    def embed_single(self, text: str) -> list[float]:
        """Gera embedding para um unico texto.

        Args:
            text: Texto para gerar embedding

        Returns:
            Vetor de embedding

        Raises:
            EmbeddingError: Se houver erro na geracao
        """
        try:
            embedding = self.client.embed_query(text)
            return embedding
        except Exception as e:
            logger.error(f"Erro ao gerar embedding: {e}")
            raise EmbeddingError(f"Erro ao gerar embedding: {e}") from e
