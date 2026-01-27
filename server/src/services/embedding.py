"""Servico de embedding e processamento de texto."""

import io
import logging
from dataclasses import dataclass

from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader

logger = logging.getLogger(__name__)


@dataclass
class ChunkWithEmbedding:
    """Chunk de texto com seu embedding."""

    content: str
    embedding: list[float]
    chunk_index: int
    metadata: dict


class EmbeddingService:
    """Servico para extracao de texto e geracao de embeddings."""

    def __init__(
        self,
        api_key: str,
        model: str = "text-embedding-ada-002",
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        """Inicializa o servico de embedding.

        Args:
            api_key: API key da OpenAI
            model: Modelo de embedding (default: text-embedding-ada-002)
            chunk_size: Tamanho maximo de cada chunk em caracteres
            chunk_overlap: Sobreposicao entre chunks para manter contexto
        """
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=api_key,
            model=model,
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
        self.model = model

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extrai texto de um arquivo PDF.

        Args:
            pdf_bytes: Conteudo do PDF em bytes

        Returns:
            Texto extraido do PDF

        Raises:
            Exception: Se houver erro na extracao
        """
        try:
            pdf_file = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)

            text_parts = []
            for page_num, page in enumerate(reader.pages, start=1):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"[Página {page_num}]\n{page_text}")

            full_text = "\n\n".join(text_parts)
            logger.info(f"Texto extraido: {len(full_text)} caracteres de {len(reader.pages)} paginas")
            return full_text
        except Exception as e:
            logger.error(f"Erro ao extrair texto do PDF: {e}")
            raise

    def chunk_text(self, text: str) -> list[str]:
        """Divide o texto em chunks menores.

        Args:
            text: Texto completo a ser dividido

        Returns:
            Lista de chunks de texto
        """
        chunks = self.text_splitter.split_text(text)
        logger.info(f"Texto dividido em {len(chunks)} chunks")
        return chunks

    def generate_embeddings(self, chunks: list[str]) -> list[list[float]]:
        """Gera embeddings para uma lista de chunks.

        Args:
            chunks: Lista de textos para gerar embeddings

        Returns:
            Lista de embeddings (vetores de floats)

        Raises:
            Exception: Se houver erro na geracao
        """
        try:
            embeddings = self.embeddings.embed_documents(chunks)
            logger.info(f"Gerados {len(embeddings)} embeddings")
            return embeddings
        except Exception as e:
            logger.error(f"Erro ao gerar embeddings: {e}")
            raise

    def process_pdf(self, pdf_bytes: bytes) -> list[ChunkWithEmbedding]:
        """Processa um PDF completo: extrai texto, divide em chunks e gera embeddings.

        Args:
            pdf_bytes: Conteudo do PDF em bytes

        Returns:
            Lista de ChunkWithEmbedding com texto e embedding

        Raises:
            Exception: Se houver erro em qualquer etapa
        """
        # 1. Extrair texto
        text = self.extract_text_from_pdf(pdf_bytes)

        if not text.strip():
            logger.warning("PDF sem texto extraivel")
            return []

        # 2. Dividir em chunks
        chunks = self.chunk_text(text)

        if not chunks:
            logger.warning("Nenhum chunk gerado")
            return []

        # 3. Gerar embeddings
        embeddings = self.generate_embeddings(chunks)

        # 4. Combinar chunks com embeddings
        results = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            results.append(
                ChunkWithEmbedding(
                    content=chunk,
                    embedding=embedding,
                    chunk_index=i,
                    metadata={"chunk_index": i, "total_chunks": len(chunks)},
                )
            )

        logger.info(f"PDF processado: {len(results)} chunks com embeddings")
        return results
