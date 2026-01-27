"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/session";
import { api } from "@/lib/api";
import type { Document, DocumentDetail, MutationResult } from "@/lib/types";

interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  uploadDocument: (file: File) => Promise<MutationResult<Document>>;
  getDocument: (documentId: string) => Promise<MutationResult<DocumentDetail>>;
  deleteDocument: (documentId: string) => Promise<MutationResult>;
  refresh: () => Promise<void>;
}

export function useDocuments(collectionId: string | null): UseDocumentsReturn {
  const { currentMembership } = useSession();
  const orgId = currentMembership?.organizationId;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!orgId || !collectionId) {
      setIsLoading(false);
      setDocuments([]);
      return;
    }

    try {
      setError(null);
      const response = await api.get<{ documents: Document[] }>(
        `/organizations/${orgId}/collections/${collectionId}/documents`
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setDocuments(response.data.documents);
      }
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
      setError("Erro ao carregar documentos");
    } finally {
      setIsLoading(false);
    }
  }, [orgId, collectionId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const uploadDocument = useCallback(
    async (file: File): Promise<MutationResult<Document>> => {
      if (!orgId || !collectionId) {
        return { error: "Organização ou coleção não selecionada" };
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.upload<Document>(
          `/organizations/${orgId}/collections/${collectionId}/documents`,
          formData
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar documentos após upload
        await loadDocuments();

        return { data: response.data! };
      } catch {
        return { error: "Erro ao fazer upload do documento" };
      }
    },
    [orgId, collectionId, loadDocuments]
  );

  const getDocument = useCallback(
    async (documentId: string): Promise<MutationResult<DocumentDetail>> => {
      if (!orgId || !collectionId) {
        return { error: "Organização ou coleção não selecionada" };
      }

      try {
        const response = await api.get<DocumentDetail>(
          `/organizations/${orgId}/collections/${collectionId}/documents/${documentId}`
        );

        if (response.error) {
          return { error: response.error };
        }

        return { data: response.data! };
      } catch {
        return { error: "Erro ao carregar documento" };
      }
    },
    [orgId, collectionId]
  );

  const deleteDocument = useCallback(
    async (documentId: string): Promise<MutationResult> => {
      if (!orgId || !collectionId) {
        return { error: "Organização ou coleção não selecionada" };
      }

      try {
        const response = await api.delete(
          `/organizations/${orgId}/collections/${collectionId}/documents/${documentId}`
        );

        if (response.error) {
          return { error: response.error };
        }

        // Recarregar documentos após remoção
        await loadDocuments();

        return {};
      } catch {
        return { error: "Erro ao excluir documento" };
      }
    },
    [orgId, collectionId, loadDocuments]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadDocuments();
  }, [loadDocuments]);

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    getDocument,
    deleteDocument,
    refresh,
  };
}
