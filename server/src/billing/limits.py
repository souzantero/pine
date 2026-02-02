"""Definicoes de limites por plano e funcoes de verificacao."""

import uuid
from datetime import UTC, datetime

from dateutil.relativedelta import relativedelta
from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from src.database.entities import (
    DocumentCollection,
    Organization,
    OrganizationBilling,
    OrganizationMember,
    OrganizationPlan,
    Thread,
)


# Limites por plano
PLAN_LIMITS = {
    OrganizationPlan.FREE: {
        "members": 1,
        "collections": 1,
        "threads": 50,
        "tool_calls_per_month": 200,
        "storage_bytes": 100 * 1024 * 1024,  # 100MB
    },
    OrganizationPlan.TEAM: {
        "members": 10,
        "collections": None,  # Ilimitado
        "threads": None,  # Ilimitado
        "tool_calls_per_month": None,  # Ilimitado
        "storage_bytes": 5 * 1024 * 1024 * 1024,  # 5GB
    },
}


def get_limits(plan: OrganizationPlan) -> dict:
    """Retorna limites do plano."""
    return PLAN_LIMITS.get(plan, PLAN_LIMITS[OrganizationPlan.FREE])


def get_or_create_billing(db: Session, organization_id: uuid.UUID) -> OrganizationBilling:
    """Busca ou cria registro de billing para a organizacao."""
    statement = select(OrganizationBilling).where(
        OrganizationBilling.organization_id == organization_id
    )
    billing = db.exec(statement).first()

    if not billing:
        billing = OrganizationBilling(organization_id=organization_id)
        db.add(billing)
        db.commit()
        db.refresh(billing)

    return billing


def check_member_limit(db: Session, organization_id: uuid.UUID) -> None:
    """Verifica se pode adicionar mais membros."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)
    max_members = limits["members"]

    if max_members is None:
        return

    count = db.exec(
        select(func.count(OrganizationMember.id)).where(
            OrganizationMember.organization_id == organization_id
        )
    ).one()

    if count >= max_members:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Limite de {max_members} membro(s) atingido. Faça upgrade para o plano Team para adicionar mais membros.",
        )


def check_collection_limit(db: Session, organization_id: uuid.UUID) -> None:
    """Verifica se pode criar mais colecoes."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)
    max_collections = limits["collections"]

    if max_collections is None:
        return

    count = db.exec(
        select(func.count(DocumentCollection.id)).where(
            DocumentCollection.organization_id == organization_id
        )
    ).one()

    if count >= max_collections:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Limite de {max_collections} coleção(ões) atingido. Faça upgrade para o plano Team para criar mais coleções.",
        )


def check_thread_limit(db: Session, organization_id: uuid.UUID) -> None:
    """Verifica se pode criar mais threads."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)
    max_threads = limits["threads"]

    if max_threads is None:
        return

    count = db.exec(
        select(func.count(Thread.id)).where(Thread.organization_id == organization_id)
    ).one()

    if count >= max_threads:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Limite de {max_threads} conversas atingido. Faça upgrade para o plano Team para conversas ilimitadas.",
        )


def check_storage_limit(db: Session, organization_id: uuid.UUID, file_size: int) -> None:
    """Verifica se pode fazer upload de arquivo com o tamanho especificado."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)
    max_storage = limits["storage_bytes"]

    if max_storage is None:
        return

    new_total = billing.storage_used_bytes + file_size

    if new_total > max_storage:
        max_mb = max_storage / (1024 * 1024)
        used_mb = billing.storage_used_bytes / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Limite de armazenamento de {max_mb:.0f}MB atingido (usado: {used_mb:.1f}MB). Faça upgrade para o plano Team para 5GB de armazenamento.",
        )


def check_tool_calls_limit(db: Session, organization_id: uuid.UUID) -> None:
    """Verifica se pode fazer mais chamadas de ferramentas."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)
    max_calls = limits["tool_calls_per_month"]

    if max_calls is None:
        return

    # Reseta contador se passou do mes
    now = datetime.now(UTC)
    reset_at = billing.tool_calls_reset_at
    if reset_at.tzinfo is None:
        reset_at = reset_at.replace(tzinfo=UTC)

    if now >= reset_at:
        billing.tool_calls_count = 0
        billing.tool_calls_reset_at = now + relativedelta(months=1)
        db.add(billing)
        db.commit()
        db.refresh(billing)

    if billing.tool_calls_count >= max_calls:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Limite de {max_calls} chamadas de ferramentas/mês atingido. Faça upgrade para o plano Team para chamadas ilimitadas.",
        )


def increment_tool_calls(db: Session, organization_id: uuid.UUID, count: int = 1) -> None:
    """Incrementa contador de chamadas de ferramentas."""
    billing = get_or_create_billing(db, organization_id)
    billing.tool_calls_count += count
    db.add(billing)
    db.commit()


def update_storage_used(db: Session, organization_id: uuid.UUID, delta_bytes: int) -> None:
    """Atualiza uso de storage (positivo para adicionar, negativo para remover)."""
    billing = get_or_create_billing(db, organization_id)
    billing.storage_used_bytes = max(0, billing.storage_used_bytes + delta_bytes)
    db.add(billing)
    db.commit()


def get_usage(db: Session, organization_id: uuid.UUID) -> dict:
    """Retorna uso atual da organizacao."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)

    members_count = db.exec(
        select(func.count(OrganizationMember.id)).where(
            OrganizationMember.organization_id == organization_id
        )
    ).one()

    collections_count = db.exec(
        select(func.count(DocumentCollection.id)).where(
            DocumentCollection.organization_id == organization_id
        )
    ).one()

    threads_count = db.exec(
        select(func.count(Thread.id)).where(Thread.organization_id == organization_id)
    ).one()

    return {
        "plan": billing.plan.value,
        "members": {"current": members_count, "limit": limits["members"]},
        "collections": {"current": collections_count, "limit": limits["collections"]},
        "threads": {"current": threads_count, "limit": limits["threads"]},
        "toolCalls": {
            "current": billing.tool_calls_count,
            "limit": limits["tool_calls_per_month"],
            "resetsAt": billing.tool_calls_reset_at.isoformat(),
        },
        "storage": {
            "current": billing.storage_used_bytes,
            "limit": limits["storage_bytes"],
        },
    }
