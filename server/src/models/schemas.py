from typing import List

from src.core.schemas import CamelCaseModel


class ModelInfo(CamelCaseModel):
    id: str
    name: str
    description: str | None = None


class ModelsResponse(CamelCaseModel):
    models: List[ModelInfo]
    configured_providers: List[str]
