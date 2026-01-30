"""Servico de extracao de texto de documentos."""

import io
import logging

from pypdf import PdfReader

logger = logging.getLogger(__name__)


class ExtractionError(Exception):
    """Erro durante extracao de texto."""

    pass


class ExtractionService:
    """Servico para extracao de texto de documentos."""

    SUPPORTED_MIME_TYPES = ["application/pdf"]

    def extract_text(self, content: bytes, mime_type: str) -> str:
        """Extrai texto de um documento baseado no mime type.

        Args:
            content: Conteudo do arquivo em bytes
            mime_type: MIME type do arquivo

        Returns:
            Texto extraido do documento

        Raises:
            ExtractionError: Se o mime type nao for suportado ou houver erro na extracao
        """
        if mime_type == "application/pdf":
            return self.extract_pdf(content)

        raise ExtractionError(f"Tipo de arquivo nao suportado: {mime_type}")

    def extract_pdf(self, pdf_bytes: bytes) -> str:
        """Extrai texto de um arquivo PDF.

        Args:
            pdf_bytes: Conteudo do PDF em bytes

        Returns:
            Texto extraido do PDF

        Raises:
            ExtractionError: Se houver erro na extracao
        """
        try:
            pdf_file = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)

            text_parts = []
            for page_num, page in enumerate(reader.pages, start=1):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"[Pagina {page_num}]\n{page_text}")

            full_text = "\n\n".join(text_parts)
            logger.info(
                f"Texto extraido: {len(full_text)} caracteres de {len(reader.pages)} paginas"
            )
            return full_text

        except Exception as e:
            logger.error(f"Erro ao extrair texto do PDF: {e}")
            raise ExtractionError(f"Erro ao extrair texto do PDF: {e}") from e
