"""Servico de integracao com Stripe."""

import uuid

import stripe
from fastapi import HTTPException, status
from sqlmodel import Session, select

from src.core import env
from src.database.entities import Organization, OrganizationBilling, OrganizationPlan

from .limits import get_or_create_billing

# Configuracao Stripe
stripe.api_key = env.stripe_secret_key


def create_checkout_session(
    db: Session,
    organization_id: uuid.UUID,
    success_url: str,
    cancel_url: str,
) -> str:
    """Cria sessao de checkout do Stripe e retorna URL."""
    org = db.get(Organization, organization_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada")

    billing = get_or_create_billing(db, organization_id)

    if billing.plan == OrganizationPlan.TEAM:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organização já possui plano Team",
        )

    # Cria ou reutiliza customer do Stripe
    if billing.stripe_customer_id:
        customer_id = billing.stripe_customer_id
    else:
        customer = stripe.Customer.create(
            name=org.name,
            metadata={"organization_id": str(org.id)},
        )
        billing.stripe_customer_id = customer.id
        db.add(billing)
        db.commit()
        customer_id = customer.id

    # Cria sessao de checkout
    checkout_session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[
            {
                "price": env.stripe_team_price_id,
                "quantity": 1,
            }
        ],
        mode="subscription",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"organization_id": str(org.id)},
    )

    return checkout_session.url


def handle_checkout_completed(session: dict, db: Session) -> None:
    """Processa evento checkout.session.completed."""
    org_id = session.get("metadata", {}).get("organization_id")
    subscription_id = session.get("subscription")

    if not org_id:
        return

    billing = get_or_create_billing(db, uuid.UUID(org_id))
    billing.plan = OrganizationPlan.TEAM
    billing.stripe_subscription_id = subscription_id
    db.add(billing)
    db.commit()


def handle_subscription_deleted(subscription: dict, db: Session) -> None:
    """Processa evento customer.subscription.deleted (cancelamento)."""
    subscription_id = subscription.get("id")

    statement = select(OrganizationBilling).where(
        OrganizationBilling.stripe_subscription_id == subscription_id
    )
    billing = db.exec(statement).first()

    if billing:
        billing.plan = OrganizationPlan.FREE
        billing.stripe_subscription_id = None
        db.add(billing)
        db.commit()


def create_portal_session(
    db: Session, organization_id: uuid.UUID, return_url: str
) -> str:
    """Cria sessao do portal do cliente para gerenciar assinatura."""
    billing = get_or_create_billing(db, organization_id)

    if not billing.stripe_customer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organização não possui assinatura ativa",
        )

    portal_session = stripe.billing_portal.Session.create(
        customer=billing.stripe_customer_id,
        return_url=return_url,
    )

    return portal_session.url
