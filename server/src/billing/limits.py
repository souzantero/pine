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


# Duracao do trial do plano Free em dias
FREE_TRIAL_DAYS = 7

# Limites por plano
PLAN_LIMITS = {
    OrganizationPlan.FREE: {
        "members": 1,
        "collections": 1,
        "threads": 50,
        "tool_calls_per_month": 200,
        "storage_bytes": 100 * 1024 * 1024,  # 100MB
        "max_file_size": 10 * 1024 * 1024,  # 10MB
    },
    OrganizationPlan.TEAM: {
        "members": 10,
        "collections": 10,
        "threads": 1000,  # Por mês
        "tool_calls_per_month": 5000,
        "storage_bytes": 5 * 1024 * 1024 * 1024,  # 5GB
        "max_file_size": 50 * 1024 * 1024,  # 50MB
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


def get_trial_end_date(billing: OrganizationBilling) -> datetime | None:
    """Retorna a data de fim do trial para planos Free, ou None para planos pagos."""
    if billing.plan != OrganizationPlan.FREE:
        return None

    created_at = billing.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=UTC)

    return created_at + relativedelta(days=FREE_TRIAL_DAYS)


def is_trial_expired(billing: OrganizationBilling) -> bool:
    """Verifica se o trial do plano Free expirou."""
    trial_end = get_trial_end_date(billing)
    if trial_end is None:
        return False

    return datetime.now(UTC) >= trial_end


def check_trial_expired(db: Session, organization_id: uuid.UUID) -> None:
    """Verifica se o trial expirou e bloqueia o uso."""
    billing = get_or_create_billing(db, organization_id)

    if is_trial_expired(billing):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Seu período de teste de 7 dias expirou. Faça upgrade para o plano Team para continuar usando.",
        )


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
        if billing.plan == OrganizationPlan.FREE:
            msg = f"Limite de {max_members} membro(s) atingido. Faça upgrade para o plano Team para adicionar mais membros."
        else:
            msg = f"Limite de {max_members} membro(s) do plano {billing.plan.value} atingido."
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=msg)


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
        if billing.plan == OrganizationPlan.FREE:
            msg = f"Limite de {max_collections} coleção(ões) atingido. Faça upgrade para o plano Team para criar mais coleções."
        else:
            msg = f"Limite de {max_collections} coleções do plano {billing.plan.value} atingido."
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=msg)


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
        if billing.plan == OrganizationPlan.FREE:
            msg = f"Limite de {max_threads} conversas atingido. Faça upgrade para o plano Team para mais conversas."
        else:
            msg = f"Limite de {max_threads} conversas/mês do plano {billing.plan.value} atingido."
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=msg)


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
        if billing.plan == OrganizationPlan.FREE:
            msg = f"Limite de armazenamento de {max_mb:.0f}MB atingido (usado: {used_mb:.1f}MB). Faça upgrade para o plano Team para 5GB de armazenamento."
        else:
            max_gb = max_storage / (1024 * 1024 * 1024)
            msg = f"Limite de armazenamento de {max_gb:.0f}GB do plano {billing.plan.value} atingido (usado: {used_mb:.1f}MB)."
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=msg)


def check_file_size_limit(db: Session, organization_id: uuid.UUID, file_size: int) -> None:
    """Verifica se o arquivo excede o tamanho maximo permitido pelo plano."""
    billing = get_or_create_billing(db, organization_id)
    limits = get_limits(billing.plan)
    max_file_size = limits["max_file_size"]

    if max_file_size is None:
        return

    if file_size > max_file_size:
        max_mb = max_file_size // (1024 * 1024)
        if billing.plan == OrganizationPlan.FREE:
            msg = f"Arquivo muito grande. Tamanho máximo no plano Free: {max_mb}MB. Faça upgrade para o plano Team para enviar arquivos maiores."
        else:
            msg = f"Arquivo muito grande. Tamanho máximo: {max_mb}MB."
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)


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
        if billing.plan == OrganizationPlan.FREE:
            msg = f"Limite de {max_calls} chamadas de ferramentas/mês atingido. Faça upgrade para o plano Team para mais chamadas."
        else:
            msg = f"Limite de {max_calls} chamadas de ferramentas/mês do plano {billing.plan.value} atingido."
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=msg)


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

    # Info do trial para plano Free
    trial_end = get_trial_end_date(billing)
    trial_expired = is_trial_expired(billing)

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
        "trial": {
            "endsAt": trial_end.isoformat() if trial_end else None,
            "expired": trial_expired,
        },
    }
