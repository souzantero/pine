"""Ferramenta de busca na web usando Tavily API."""

import asyncio
import logging
import uuid

from datetime import datetime
from typing import List, Literal
from pydantic import BaseModel
from langchain_core.tools import tool, InjectedToolCallId
from langchain_core.messages import HumanMessage, ToolMessage
from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from typing_extensions import Annotated
from langgraph.types import Command
from sqlmodel import select
from tavily import AsyncTavilyClient

from src.entities import (
    OrganizationConfig,
    OrganizationProvider,
    ConfigType,
    ConfigKey,
    ProviderType,
    Provider,
)
from src.database import Database


# Prompt para sumarizacao de paginas web
SUMMARIZE_WEBPAGE_PROMPT = """Voce deve resumir o conteudo bruto de uma pagina web obtida de uma busca. Seu objetivo e criar um resumo que preserve as informacoes mais importantes da pagina original. Este resumo sera usado por um agente de pesquisa, entao e crucial manter os detalhes chave sem perder informacoes essenciais.

Aqui esta o conteudo bruto da pagina:

<webpage_content>
{webpage_content}
</webpage_content>

Siga estas diretrizes para criar seu resumo:

1. Identifique e preserve o topico principal ou proposito da pagina.
2. Mantenha fatos, estatisticas e dados que sao centrais para a mensagem do conteudo.
3. Preserve citacoes importantes de fontes credíveis ou especialistas.
4. Mantenha a ordem cronologica dos eventos se o conteudo for sensivel ao tempo ou historico.
5. Preserve listas ou instrucoes passo a passo se presentes.
6. Inclua datas, nomes e locais relevantes que sao cruciais para entender o conteudo.
7. Resuma explicacoes longas mantendo a mensagem central intacta.

Ao lidar com diferentes tipos de conteudo:

- Para noticias: Foque em quem, o que, quando, onde, por que e como.
- Para conteudo cientifico: Preserve metodologia, resultados e conclusoes.
- Para artigos de opiniao: Mantenha os argumentos principais e pontos de apoio.
- Para paginas de produtos: Mantenha recursos principais, especificacoes e diferenciais.

Seu resumo deve ser significativamente mais curto que o conteudo original, mas abrangente o suficiente para funcionar como fonte de informacao. Mire em cerca de 25-30% do tamanho original, a menos que o conteudo ja seja conciso.

Apresente seu resumo no seguinte formato:

```
{{
   "summary": "Seu resumo aqui, estruturado com paragrafos ou bullet points conforme necessario",
   "key_excerpts": "Primeira citacao ou trecho importante, Segunda citacao, Terceira citacao, ...Adicione mais trechos conforme necessario, ate no maximo 5"
}}
```

Aqui estao dois exemplos de bons resumos:

Exemplo 1 (para uma noticia):
```json
{{
   "summary": "Em 15 de julho de 2023, a NASA lancou com sucesso a missao Artemis II do Kennedy Space Center. Esta e a primeira missao tripulada a Lua desde a Apollo 17 em 1972. A tripulacao de quatro pessoas, liderada pela Comandante Jane Smith, orbitara a Lua por 10 dias antes de retornar a Terra. Esta missao e um passo crucial nos planos da NASA de estabelecer presenca humana permanente na Lua ate 2030.",
   "key_excerpts": "Artemis II representa uma nova era na exploracao espacial, disse o Administrador da NASA John Doe. A missao testara sistemas criticos para futuras estadias de longa duracao na Lua, explicou a Engenheira Chefe Sarah Johnson. Nao estamos apenas voltando a Lua, estamos avancando para a Lua, declarou a Comandante Jane Smith durante a coletiva de imprensa pre-lancamento."
}}
```

Exemplo 2 (para um artigo cientifico):
```json
{{
   "summary": "Um novo estudo publicado na Nature Climate Change revela que os niveis globais do mar estao subindo mais rapido do que se pensava anteriormente. Pesquisadores analisaram dados de satelite de 1993 a 2022 e descobriram que a taxa de elevacao do nivel do mar acelerou 0,08 mm/ano nas ultimas tres decadas. Essa aceleracao e atribuida principalmente ao derretimento das calotas polares na Groenlandia e Antartica. O estudo projeta que, se as tendencias atuais continuarem, os niveis globais do mar podem subir ate 2 metros ate 2100, representando riscos significativos para comunidades costeiras em todo o mundo.",
   "key_excerpts": "Nossas descobertas indicam uma clara aceleracao na elevacao do nivel do mar, o que tem implicacoes significativas para o planejamento costeiro e estrategias de adaptacao, afirmou a autora principal Dra. Emily Brown. A taxa de derretimento das calotas polares na Groenlandia e Antartica triplicou desde os anos 1990, relata o estudo. Sem reducoes imediatas e substanciais nas emissoes de gases de efeito estufa, estamos olhando para uma elevacao potencialmente catastrofica do nivel do mar ate o final deste seculo, alertou o coautor Professor Michael Green."
}}
```

Lembre-se, seu objetivo e criar um resumo que possa ser facilmente entendido e utilizado por um agente de pesquisa, preservando as informacoes mais criticas da pagina original.

A data de hoje e {date}.
"""


class Summary(BaseModel):
    """Resumo de pesquisa com descobertas principais."""

    summary: str
    key_excerpts: str


def get_today_str() -> str:
    """Retorna a data atual formatada para exibicao."""
    now = datetime.now()
    return f"{now:%a} {now:%b} {now.day}, {now:%Y}"


def get_provider_api_key(
    db: Database,
    organization_id: uuid.UUID,
    provider_type: ProviderType,
    provider: Provider,
) -> str | None:
    """Busca a API key de um provider especifico na organizacao."""
    statement = select(OrganizationProvider).where(
        OrganizationProvider.organization_id == organization_id,
        OrganizationProvider.type == provider_type,
        OrganizationProvider.provider == provider,
        OrganizationProvider.is_active == True,
    )
    org_provider = db.exec(statement).first()
    return org_provider.api_key if org_provider else None


def get_web_search_config(
    db: Database,
    organization_id: uuid.UUID,
) -> OrganizationConfig | None:
    """Busca a configuracao de web search da organizacao."""
    statement = select(OrganizationConfig).where(
        OrganizationConfig.organization_id == organization_id,
        OrganizationConfig.type == ConfigType.TOOL,
        OrganizationConfig.key == ConfigKey.WEB_SEARCH,
        OrganizationConfig.is_enabled == True,
    )
    return db.exec(statement).first()


async def tavily_search_async(
    tavily_api_key: str,
    search_queries: List[str],
    max_results: int = 5,
    topic: Literal["general", "news", "finance"] = "general",
    include_raw_content: bool = True,
) -> List[dict]:
    """Executa multiplas buscas no Tavily de forma assincrona.

    Args:
        tavily_api_key: API key do Tavily
        search_queries: Lista de queries de busca
        max_results: Numero maximo de resultados por query
        topic: Categoria do topico para filtrar resultados
        include_raw_content: Se deve incluir conteudo completo da pagina

    Returns:
        Lista de dicionarios com resultados da busca
    """
    tavily_client = AsyncTavilyClient(api_key=tavily_api_key)

    search_tasks = [
        tavily_client.search(
            query,
            max_results=max_results,
            include_raw_content=include_raw_content,
            topic=topic,
        )
        for query in search_queries
    ]

    search_results = await asyncio.gather(*search_tasks)
    return search_results


async def summarize_webpage(model: BaseChatModel, webpage_content: str) -> str:
    """Sumariza o conteudo de uma pagina web usando modelo de IA.

    Args:
        model: Modelo de chat configurado para sumarizacao
        webpage_content: Conteudo bruto da pagina web

    Returns:
        Resumo formatado com excertos principais, ou conteudo original se falhar
    """
    try:
        prompt_content = SUMMARIZE_WEBPAGE_PROMPT.format(
            webpage_content=webpage_content, date=get_today_str()
        )

        summary = await asyncio.wait_for(
            model.ainvoke([HumanMessage(content=prompt_content)]),
            timeout=60.0,
        )

        formatted_summary = (
            f"<summary>\n{summary.summary}\n</summary>\n\n"
            f"<key_excerpts>\n{summary.key_excerpts}\n</key_excerpts>"
        )

        return formatted_summary

    except asyncio.TimeoutError:
        logging.warning(
            "Sumarizacao excedeu timeout de 60 segundos, retornando conteudo original"
        )
        return webpage_content
    except Exception as e:
        logging.warning(
            f"Sumarizacao falhou com erro: {str(e)}, retornando conteudo original"
        )
        return webpage_content


def create_web_search_tool(db: Database, organization_id: uuid.UUID):
    """Cria a ferramenta de busca na web para uma organizacao especifica.

    Args:
        db: Sessao do banco de dados
        organization_id: ID da organizacao

    Returns:
        Ferramenta de busca configurada ou None se nao houver configuracao
    """
    # Busca configuracao de web search
    web_search_config = get_web_search_config(db, organization_id)
    if not web_search_config:
        logging.warning(f"Web search nao configurado para organizacao {organization_id}")
        return None

    config = web_search_config.config

    # Busca provider de busca (ex: TAVILY)
    search_provider_str = config.get("provider")
    if not search_provider_str:
        logging.warning("Provider de busca nao configurado")
        return None

    try:
        search_provider = Provider(search_provider_str)
    except ValueError:
        logging.warning(f"Provider de busca invalido: {search_provider_str}")
        return None

    # Busca API key do provider de busca
    search_api_key = get_provider_api_key(
        db, organization_id, ProviderType.WEB_SEARCH, search_provider
    )
    if not search_api_key:
        logging.warning(f"API key nao encontrada para provider {search_provider_str}")
        return None

    # Configuracoes de sumarizacao (opcional)
    summarization_provider_str = config.get("summarizationProvider")
    summarization_model_name = config.get("summarizationModel")
    summarization_max_tokens = config.get("summarizationMaxTokens", 1000)
    max_content_length = config.get("maxContentLength", 10000)
    max_output_retries = config.get("maxOutputRetries", 3)

    # Busca API key do provider de sumarizacao se configurado
    summarization_api_key = None
    if summarization_provider_str and summarization_model_name:
        try:
            summarization_provider = Provider(summarization_provider_str)
            summarization_api_key = get_provider_api_key(
                db, organization_id, ProviderType.LLM, summarization_provider
            )
        except ValueError:
            logging.warning(
                f"Provider de sumarizacao invalido: {summarization_provider_str}"
            )

    @tool
    async def web_search(
        queries: List[str],
        tool_call_id: Annotated[str, InjectedToolCallId],
        max_results: int = 5,
        topic: Literal["general", "news", "finance"] = "general",
    ) -> Command:
        """Busca informacoes na web usando Tavily.

        Use esta ferramenta quando precisar buscar informacoes atualizadas na internet.
        Voce pode passar multiplas queries para buscar diferentes aspectos de um topico.

        Args:
            queries: Lista de queries de busca (ex: ["python async programming", "asyncio tutorial"])
            max_results: Numero maximo de resultados por query (padrao: 5)
            topic: Categoria da busca - "general", "news" ou "finance" (padrao: "general")

        Returns:
            Resultados formatados com sumarios e fontes
        """
        # Executa as buscas
        search_results = await tavily_search_async(
            tavily_api_key=search_api_key,
            search_queries=queries,
            max_results=max_results,
            topic=topic,
            include_raw_content=summarization_api_key is not None,
        )

        # Deduplica resultados por URL
        unique_results = {}
        for response in search_results:
            for result in response.get("results", []):
                url = result.get("url")
                if url and url not in unique_results:
                    unique_results[url] = {**result, "query": response.get("query", "")}

        # Configura modelo de sumarizacao se disponivel
        summarization_model = None
        if summarization_api_key and summarization_model_name:
            try:
                summarization_model = (
                    init_chat_model(
                        model=summarization_model_name,
                        max_tokens=summarization_max_tokens,
                        api_key=summarization_api_key,
                    )
                    .with_structured_output(Summary)
                    .with_retry(stop_after_attempt=max_output_retries)
                )
            except Exception as e:
                logging.warning(f"Falha ao inicializar modelo de sumarizacao: {e}")

        # Cria tarefas de sumarizacao
        async def noop():
            return None

        if summarization_model:
            summarization_tasks = [
                (
                    noop()
                    if not result.get("raw_content")
                    else summarize_webpage(
                        summarization_model, result["raw_content"][:max_content_length]
                    )
                )
                for result in unique_results.values()
            ]
            summaries = await asyncio.gather(*summarization_tasks)
        else:
            summaries = [None] * len(unique_results)

        # Combina resultados com sumarios
        summarized_results = {
            url: {
                "title": result.get("title", ""),
                "content": (
                    result.get("content", "") if summary is None else summary
                ),
            }
            for url, result, summary in zip(
                unique_results.keys(), unique_results.values(), summaries
            )
        }

        # Formata saida
        if not summarized_results:
            return Command(
                update={
                    "messages": [
                        ToolMessage(
                            "Nenhum resultado encontrado. Tente queries diferentes.",
                            tool_call_id=tool_call_id,
                        )
                    ]
                }
            )

        formatted_output = "Resultados da busca:\n\n"
        for i, (url, result) in enumerate(summarized_results.items()):
            formatted_output += f"\n--- FONTE {i + 1}: {result['title']} ---\n"
            formatted_output += f"URL: {url}\n\n"
            formatted_output += f"CONTEUDO:\n{result['content']}\n"
            formatted_output += "\n" + "-" * 80 + "\n"

        return Command(
            update={
                "messages": [
                    ToolMessage(formatted_output, tool_call_id=tool_call_id)
                ]
            }
        )

    return web_search
