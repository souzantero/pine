"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";
import type {
  ModelProviderConfig,
  ModelProviderType,
  ApiModelProvidersResponse,
  MutationResult,
} from "@/lib/types";

interface UseModelProvidersReturn {
  providers: ModelProviderConfig[];
  isLoading: boolean;
  error: string | null;
  addProvider: (provider: ModelProviderType, apiKey: string) => Promise<MutationResult>;
  removeProvider: (id: string) => Promise<MutationResult>;
  refresh: () => Promise<void>;
}

export function useModelProviders(): UseModelProvidersReturn {
  const { currentMembership } = useSession();
  const orgId = currentMembership?.organizationId;

  const [providers, setProviders] = useState<ModelProviderConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProviders = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await api.get<ApiModelProvidersResponse>(
        `/organizations/${orgId}/model-providers`
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setProviders(response.data.providers);
      }
    } catch (err) {
      console.error("Erro ao carregar provedores:", err);
      setError("Erro ao carregar provedores");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const addProvider = useCallback(
    async (provider: ModelProviderType, apiKey: string): Promise<MutationResult> => {
      if (!orgId) {
        return { error: "Organização não selecionada" };
      }

      try {
        const response = await api.post<ModelProviderConfig>(
          `/organizations/${orgId}/model-providers`,
          { provider, apiKey }
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar provedores após adição
        await loadProviders();

        return {};
      } catch {
        return { error: "Erro ao adicionar provedor" };
      }
    },
    [orgId, loadProviders]
  );

  const removeProvider = useCallback(
    async (id: string): Promise<MutationResult> => {
      if (!orgId) {
        return { error: "Organização não selecionada" };
      }

      try {
        const response = await api.delete(
          `/organizations/${orgId}/model-providers/${id}`
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar provedores após remoção
        await loadProviders();

        return {};
      } catch {
        return { error: "Erro ao remover provedor" };
      }
    },
    [orgId, loadProviders]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadProviders();
  }, [loadProviders]);

  return {
    providers,
    isLoading,
    error,
    addProvider,
    removeProvider,
    refresh,
  };
}
