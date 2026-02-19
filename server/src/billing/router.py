"""Endpoints de billing."""

import uuid

from fastapi import APIRouter, HTTPException, status

from src.auth import CurrentUserDependency, check_permission
from src.database.dependencies import DatabaseDependency
from src.database.entities import Permission

from .limits import get_usage
from .schemas import UsageResponse

router = APIRouter(prefix="/organizations/{organization_id}/billing", tags=["billing"])


def _check_permission(db, user_id, organization_id, permission):
    if not check_permission(db, user_id, organization_id, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permissão {permission.value} necessária",
        )


@router.get("/usage", response_model=UsageResponse)
def get_billing_usage(
    organization_id: uuid.UUID,
    current_user: CurrentUserDependency,
    db: DatabaseDependency,
):
    """Retorna uso atual e limites do plano."""
    _check_permission(db, current_user.id, organization_id, Permission.ORGANIZATION_MANAGE)
    return get_usage(db, organization_id)
