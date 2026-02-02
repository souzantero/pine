"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";
import type { BillingUsage } from "@/lib/types";

interface UseBillingReturn {
  usage: BillingUsage | null;
  isLoading: boolean;
  error: string | null;
  createCheckout: () => Promise<{ url?: string; error?: string }>;
  openPortal: () => Promise<{ url?: string; error?: string }>;
  refresh: () => Promise<void>;
}

export function useBilling(): UseBillingReturn {
  const { currentMembership } = useSession();
  const orgId = currentMembership?.organizationId;

  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsage = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await api.get<BillingUsage>(
        `/organizations/${orgId}/billing/usage`
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setUsage(response.data);
      }
    } catch {
      setError("Erro ao carregar informações de billing");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  const createCheckout = useCallback(async () => {
    if (!orgId) return { error: "Organização não selecionada" };

    const response = await api.post<{ url: string }>(
      `/organizations/${orgId}/billing/checkout`,
      {
        successUrl: `${window.location.origin}/chat/settings/billing?success=true`,
        cancelUrl: `${window.location.origin}/chat/settings/billing?canceled=true`,
      }
    );

    if (response.error) return { error: response.error };
    return { url: response.data?.url };
  }, [orgId]);

  const openPortal = useCallback(async () => {
    if (!orgId) return { error: "Organização não selecionada" };

    const response = await api.post<{ url: string }>(
      `/organizations/${orgId}/billing/portal`,
      {
        returnUrl: `${window.location.origin}/chat/settings/billing`,
      }
    );

    if (response.error) return { error: response.error };
    return { url: response.data?.url };
  }, [orgId]);

  return {
    usage,
    isLoading,
    error,
    createCheckout,
    openPortal,
    refresh: loadUsage,
  };
}
