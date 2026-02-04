"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/lib/session";
import { useCollections, useDocuments } from "@/lib/hooks";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type { Document, DocumentStatus } from "@/lib/types";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  PENDING: { label: "Pendente", icon: Clock, className: "text-yellow-600" },
  PROCESSING: { label: "Processando", icon: Loader2, className: "text-blue-600 animate-spin" },
  COMPLETED: { label: "Concluído", icon: CheckCircle, className: "text-green-600" },
  FAILED: { label: "Falhou", icon: XCircle, className: "text-red-600" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading: authLoading, hasPermission } = useSession();
  const { collections, isLoading: collectionsLoading } = useCollections();
  const {
    documents,
    isLoading: documentsLoading,
    error,
    uploadDocument,
    deleteDocument,
    refresh,
  } = useDocuments(collectionId);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canRead = hasPermission("DOCUMENTS_READ");
  const canCreate = hasPermission("DOCUMENTS_CREATE");
  const canDelete = hasPermission("DOCUMENTS_DELETE");

  // Encontrar a coleção atual
  const collection = collections.find((c) => c.id === collectionId);

  // Redirect se sem permissão
  useEffect(() => {
    if (!authLoading && !canRead) {
      router.push("/chat");
    }
  }, [authLoading, canRead, router]);

  // Polling para atualizar status dos documentos em processamento
  useEffect(() => {
    const hasProcessing = documents.some((d) => d.status === "PENDING" || d.status === "PROCESSING");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [documents, refresh]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (file.type !== "application/pdf") {
      setUploadError("Apenas arquivos PDF são aceitos");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("O arquivo deve ter no máximo 50 MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const result = await uploadDocument(file);

    if (result.error) {
      setUploadError(result.error);
    }

    setUploading(false);

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    setDeleting(true);
    setDeleteError(null);

    const result = await deleteDocument(selectedDocument.id);

    if (result.error) {
      setDeleteError(result.error);
    } else {
      setShowDeleteDialog(false);
      setSelectedDocument(null);
    }

    setDeleting(false);
  };

  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteError(null);
    setShowDeleteDialog(true);
  };

  const isLoading = authLoading || collectionsLoading || documentsLoading;

  // Redireciona se sem permissao (apos loading)
  if (!authLoading && !canRead) {
    return null;
  }

  if (!collection && !isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center py-12">
            <h2 className="text-lg font-medium mb-2">Coleção não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              A coleção que você está procurando não existe ou foi removida.
            </p>
            <Button onClick={() => router.push("/chat/collections")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Coleções
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout loading={isLoading}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/chat/collections")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{collection?.name}</h1>
            {collection?.description && (
              <p className="text-muted-foreground">{collection.description}</p>
            )}
          </div>
        </div>

        {/* Upload Area */}
        {canCreate && (
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Faça upload de um documento PDF</p>
                  <p className="text-sm text-muted-foreground">
                    Máximo 50 MB por arquivo
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </>
                  )}
                </Button>
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Documentos ({documents.length})
          </h2>

          {documents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum documento</h3>
                <p className="text-muted-foreground">
                  Faça upload de PDFs para começar a construir sua base de conhecimento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => {
                const statusConfig = STATUS_CONFIG[doc.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={doc.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.name}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            {doc.status === "COMPLETED" && (
                              <span>{doc.chunkCount} chunks</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1.5 ${statusConfig.className}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm">{statusConfig.label}</span>
                          </div>
                          {doc.status === "FAILED" && doc.errorMessage && (
                            <span
                              className="text-xs text-red-500 max-w-[200px] truncate"
                              title={doc.errorMessage}
                            >
                              {doc.errorMessage}
                            </span>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(doc)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Dialog de Excluir Documento */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o documento &quot;{selectedDocument?.name}&quot;?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {deleteError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                {deleteError}
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
