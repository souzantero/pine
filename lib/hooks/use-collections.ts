"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";
import type { Collection, MutationResult } from "@/lib/types";

interface UseCollectionsReturn {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  createCollection: (
    name: string,
    description?: string
  ) => Promise<MutationResult<Collection>>;
  updateCollection: (
    collectionId: string,
    data: { name?: string; description?: string }
  ) => Promise<MutationResult>;
  deleteCollection: (collectionId: string) => Promise<MutationResult>;
  refresh: () => Promise<void>;
}

export function useCollections(): UseCollectionsReturn {
  const { currentMembership } = useSession();
  const orgId = currentMembership?.organizationId;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await api.get<{ collections: Collection[] }>(
        `/organizations/${orgId}/collections`
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setCollections(response.data.collections);
      }
    } catch (err) {
      console.error("Erro ao carregar coleções:", err);
      setError("Erro ao carregar coleções");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const createCollection = useCallback(
    async (
      name: string,
      description?: string
    ): Promise<MutationResult<Collection>> => {
      if (!orgId) {
        return { error: "Organização não selecionada" };
      }

      try {
        const response = await api.post<Collection>(
          `/organizations/${orgId}/collections`,
          { name, description }
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar coleções após criação
        await loadCollections();

        return { data: response.data! };
      } catch {
        return { error: "Erro ao criar coleção" };
      }
    },
    [orgId, loadCollections]
  );

  const updateCollection = useCallback(
    async (
      collectionId: string,
      data: { name?: string; description?: string }
    ): Promise<MutationResult> => {
      if (!orgId) {
        return { error: "Organização não selecionada" };
      }

      try {
        const response = await api.put(
          `/organizations/${orgId}/collections/${collectionId}`,
          data
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar coleções após atualização
        await loadCollections();

        return {};
      } catch {
        return { error: "Erro ao atualizar coleção" };
      }
    },
    [orgId, loadCollections]
  );

  const deleteCollection = useCallback(
    async (collectionId: string): Promise<MutationResult> => {
      if (!orgId) {
        return { error: "Organização não selecionada" };
      }

      try {
        const response = await api.delete(
          `/organizations/${orgId}/collections/${collectionId}`
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar coleções após remoção
        await loadCollections();

        return {};
      } catch {
        return { error: "Erro ao excluir coleção" };
      }
    },
    [orgId, loadCollections]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadCollections();
  }, [loadCollections]);

  return {
    collections,
    isLoading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    refresh,
  };
}
