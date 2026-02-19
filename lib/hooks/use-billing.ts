"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";
import type { BillingUsage } from "@/lib/types";

interface UseBillingReturn {
  usage: BillingUsage | null;
  isLoading: boolean;
  error: string | null;
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

  return {
    usage,
    isLoading,
    error,
    refresh: loadUsage,
  };
}
