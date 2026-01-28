from typing import List

from langchain_core.messages import HumanMessage
from pydantic import BaseModel, ConfigDict


def to_camel(string: str) -> str:
    """Converte snake_case para camelCase."""
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class CamelCaseModel(BaseModel):
    """Base model que serializa campos em camelCase."""

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
        serialize_by_alias=True,
    )


# =============================================================================
# Agent Schemas
# =============================================================================


class MessageInput(CamelCaseModel):
    content: str

    def to_agent(self):
        return HumanMessage(content=self.content)


class RunInput(CamelCaseModel):
    messages: List[MessageInput]


class RunConfig(CamelCaseModel):
    """Configuracao de execucao."""

    provider: str  # OPENAI, OPENROUTER
    model: str


class RunRequest(CamelCaseModel):
    input: RunInput
    config: RunConfig


