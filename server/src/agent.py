from langchain.agents import create_agent
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.postgres.base import BaseCheckpointSaver

from src.entities import ModelProvider
from src.env import openrouter_base_url
from src.schemas import RunConfig


def get_model(
    provider: ModelProvider,
    api_key: str,
    model: str,
    temperature: float = 0.7,
):
    """Cria o modelo de LLM baseado no provedor."""
    if provider == ModelProvider.OPENAI:
        return ChatOpenAI(
            model=model,
            temperature=temperature,
            openai_api_key=api_key,
        )
    elif provider == ModelProvider.OPENROUTER:
        return ChatOpenAI(
            model=model,
            temperature=temperature,
            openai_api_key=api_key,
            openai_api_base=openrouter_base_url,
        )
    else:
        raise ValueError(f"Provedor {provider} nao suportado para execucao de agentes")


search = DuckDuckGoSearchRun()


def build_agent(
    provider: ModelProvider,
    api_key: str,
    config: RunConfig,
    checkpointer: BaseCheckpointSaver | None = None,
    system_prompt: str | None = None,
):
    """Constroi o agente com modelo e configuracoes especificas."""
    model = get_model(
        provider=provider,
        api_key=api_key,
        model=config.model,
        temperature=config.temperature,
    )

    # Usa system_prompt passado ou default
    prompt = system_prompt or "Voce e um assistente virtual de inteligencia artificial."

    return create_agent(
        model=model,
        system_prompt=prompt,
        tools=[search],
        checkpointer=checkpointer,
    )
