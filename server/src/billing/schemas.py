"""Schemas de billing."""

from src.core.schemas import CamelCaseModel


class UsageItem(CamelCaseModel):
    """Item de uso com valor atual e limite."""

    current: int
    limit: int | None


class ToolCallsUsage(CamelCaseModel):
    """Uso de chamadas de ferramentas."""

    current: int
    limit: int | None
    resets_at: str


class StorageUsage(CamelCaseModel):
    """Uso de armazenamento."""

    current: int
    limit: int | None


class UsageResponse(CamelCaseModel):
    """Resposta com uso atual e limites."""

    plan: str
    members: UsageItem
    collections: UsageItem
    threads: UsageItem
    tool_calls: ToolCallsUsage
    storage: StorageUsage


class CheckoutRequest(CamelCaseModel):
    """Request para criar sessao de checkout."""

    success_url: str
    cancel_url: str


class CheckoutResponse(CamelCaseModel):
    """Resposta com URL do checkout."""

    url: str


class PortalRequest(CamelCaseModel):
    """Request para criar sessao do portal."""

    return_url: str


class PortalResponse(CamelCaseModel):
    """Resposta com URL do portal."""

    url: str
