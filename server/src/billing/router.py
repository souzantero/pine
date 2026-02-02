"""Endpoints de billing."""

import uuid

import stripe
from fastapi import APIRouter, HTTPException, Request, status

from src.auth import CurrentUserDependency, check_permission
from src.core import env
from src.database.dependencies import DatabaseDependency
from src.database.entities import Permission

from .limits import get_usage
from .schemas import (
    CheckoutRequest,
    CheckoutResponse,
    PortalRequest,
    PortalResponse,
    UsageResponse,
)
from .service import (
    create_checkout_session,
    create_portal_session,
    handle_checkout_completed,
    handle_subscription_deleted,
)

router = APIRouter(prefix="/organizations/{organization_id}/billing", tags=["billing"])
webhook_router = APIRouter(prefix="/webhooks", tags=["webhooks"])


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


@router.post("/checkout", response_model=CheckoutResponse)
def create_checkout(
    organization_id: uuid.UUID,
    payload: CheckoutRequest,
    current_user: CurrentUserDependency,
    db: DatabaseDependency,
):
    """Cria sessao de checkout para upgrade."""
    _check_permission(db, current_user.id, organization_id, Permission.ORGANIZATION_MANAGE)

    url = create_checkout_session(
        db=db,
        organization_id=organization_id,
        success_url=payload.success_url,
        cancel_url=payload.cancel_url,
    )

    return CheckoutResponse(url=url)


@router.post("/portal", response_model=PortalResponse)
def create_billing_portal(
    organization_id: uuid.UUID,
    payload: PortalRequest,
    current_user: CurrentUserDependency,
    db: DatabaseDependency,
):
    """Cria sessao do portal de billing para gerenciar assinatura."""
    _check_permission(db, current_user.id, organization_id, Permission.ORGANIZATION_MANAGE)

    url = create_portal_session(
        db=db,
        organization_id=organization_id,
        return_url=payload.return_url,
    )

    return PortalResponse(url=url)


@webhook_router.post("/stripe")
async def stripe_webhook(request: Request, db: DatabaseDependency):
    """Webhook do Stripe para processar eventos."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, env.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        handle_checkout_completed(event["data"]["object"], db)
    elif event["type"] == "customer.subscription.deleted":
        handle_subscription_deleted(event["data"]["object"], db)

    return {"status": "ok"}
