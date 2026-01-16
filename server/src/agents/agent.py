import uuid
from dataclasses import dataclass
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.postgres.base import BaseCheckpointSaver

from src.database import Database
from src.entities import Provider
from src.env import openrouter_base_url
from src.schemas import RunConfig
from src.agents.tools.web_search import create_web_search_tool


TEMPERATURE = 0.7
SYSTEM_PROMPT = "Voce e um assistente virtual de inteligencia artificial."

@dataclass
class AgentContext:
    pass

def get_model(
    provider: Provider,
    api_key: str,
    model: str,
):
    """Cria o modelo de LLM baseado no provedor."""
    if provider == Provider.OPENAI:
        return ChatOpenAI(
            model=model,
            temperature=TEMPERATURE,
            openai_api_key=api_key,
        )
    elif provider == Provider.OPENROUTER:
        return ChatOpenAI(
            model=model,
            temperature=TEMPERATURE,
            openai_api_key=api_key,
            openai_api_base=openrouter_base_url,
        )
    else:
        raise ValueError(f"Provedor {provider} nao suportado")

def build_agent(
    db: Database,
    organization_id: uuid.UUID,
    provider: Provider,
    api_key: str,
    config: RunConfig,
    checkpointer: BaseCheckpointSaver | None = None,
):
    """Constroi o agente com modelo e configuracoes especificas."""
    model = get_model(
        provider=provider,
        api_key=api_key,
        model=config.model,
    )

    # Cria ferramentas disponiveis para o agente
    tools = []

    web_search_tool = create_web_search_tool(db, organization_id)
    if web_search_tool:
        tools.append(web_search_tool)

    return create_agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        tools=tools,
        checkpointer=checkpointer,
        context_schema=AgentContext
    )
