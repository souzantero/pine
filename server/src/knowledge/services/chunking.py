"""Servico de divisao de texto em chunks."""

import logging
from dataclasses import dataclass, field

from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)


@dataclass
class ChunkingConfig:
    """Configuracao do servico de chunking."""

    chunk_size: int = 1000
    chunk_overlap: int = 200


@dataclass
class TextChunk:
    """Representa um chunk de texto."""

    content: str
    index: int
    metadata: dict = field(default_factory=dict)


class ChunkingService:
    """Servico para divisao de texto em chunks."""

    def __init__(self, config: ChunkingConfig | None = None):
        """Inicializa o servico de chunking.

        Args:
            config: Configuracao de chunking (usa defaults se None)
        """
        self.config = config or ChunkingConfig()
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.config.chunk_size,
            chunk_overlap=self.config.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    def split(self, text: str) -> list[TextChunk]:
        """Divide o texto em chunks.

        Args:
            text: Texto completo a ser dividido

        Returns:
            Lista de TextChunks
        """
        if not text or not text.strip():
            logger.warning("Texto vazio recebido para chunking")
            return []

        chunks_text = self.splitter.split_text(text)

        chunks = [
            TextChunk(
                content=chunk,
                index=i,
                metadata={"chunk_index": i, "total_chunks": len(chunks_text)},
            )
            for i, chunk in enumerate(chunks_text)
        ]

        logger.info(f"Texto dividido em {len(chunks)} chunks")
        return chunks
