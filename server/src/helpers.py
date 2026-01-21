from typing import Any, List
from langchain_core.messages import BaseMessage
from langchain_core.messages import (
    AIMessageChunk,
)

from src.schemas import AgentMessageResponse


def get_config(thread_id: str):
    return {"configurable": {"thread_id": thread_id}}


def chunk_to_text(chunk: Any) -> str:
    """Extrai string utilizável a partir de pedaços do modelo."""
    if isinstance(chunk, AIMessageChunk):
        content = chunk.content
        if isinstance(content, list):
            parts: List[str] = []
            for item in content:
                if isinstance(item, dict):
                    parts.append(str(item.get("text", "")))
                else:
                    parts.append(str(item))
            return "".join(parts)
        if isinstance(content, str):
            return content
    if hasattr(chunk, "content"):
        value = getattr(chunk, "content")
        if isinstance(value, str):
            return value
    return str(chunk)


def agent_message_to_response(msg: BaseMessage) -> AgentMessageResponse:
    """Converte BaseMessage para AgentMessageResponse (camelCase)."""
    created = getattr(msg, "created_at", None)
    return AgentMessageResponse(
        id=getattr(msg, "id", None),
        type=getattr(msg, "type", None),
        content=getattr(msg, "content", None),
        response_metadata=getattr(msg, "response_metadata", None),
        tool_calls=getattr(msg, "tool_calls", None),
        additional_kwargs=getattr(msg, "additional_kwargs", None),
        created_at=str(created) if created is not None else None,
    )


def agent_messages_to_list(msgs: List[BaseMessage]) -> List[AgentMessageResponse]:
    """Converte lista de BaseMessage para lista de AgentMessageResponse."""
    return [agent_message_to_response(m) for m in msgs]
