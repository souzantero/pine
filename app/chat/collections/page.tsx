"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useCollections } from "@/lib/hooks";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Brain, Plus, FileText, Trash2, Pencil } from "lucide-react";

export default function CollectionsPage() {
  const router = useRouter();
  const { isLoading: authLoading, hasPermission } = useSession();
  const {
    collections,
    isLoading: collectionsLoading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    refresh,
  } = useCollections();

  // Estados para dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<{ id: string; name: string; description: string | null } | null>(null);

  // Estados do form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canRead = hasPermission("COLLECTIONS_READ");
  const canCreate = hasPermission("COLLECTIONS_CREATE");
  const canUpdate = hasPermission("COLLECTIONS_UPDATE");
  const canDelete = hasPermission("COLLECTIONS_DELETE");

  // Redirect se sem permissão
  useEffect(() => {
    if (!authLoading && !canRead) {
      router.push("/chat");
    }
  }, [authLoading, canRead, router]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setFormError("O nome é obrigatório");
      return;
    }

    setSaving(true);
    setFormError(null);

    const result = await createCollection(name.trim(), description.trim() || undefined);

    if (result.error) {
      setFormError(result.error);
    } else {
      setShowCreateDialog(false);
      setName("");
      setDescription("");
    }

    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!selectedCollection || !name.trim()) {
      setFormError("O nome é obrigatório");
      return;
    }

    setSaving(true);
    setFormError(null);

    const result = await updateCollection(selectedCollection.id, {
      name: name.trim(),
      description: description.trim() || undefined,
    });

    if (result.error) {
      setFormError(result.error);
    } else {
      setShowEditDialog(false);
      setSelectedCollection(null);
      setName("");
      setDescription("");
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedCollection) return;

    setSaving(true);
    const result = await deleteCollection(selectedCollection.id);

    if (result.error) {
      setFormError(result.error);
    } else {
      setShowDeleteDialog(false);
      setSelectedCollection(null);
    }

    setSaving(false);
  };

  const openEditDialog = (collection: { id: string; name: string; description: string | null }) => {
    setSelectedCollection(collection);
    setName(collection.name);
    setDescription(collection.description || "");
    setFormError(null);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (collection: { id: string; name: string; description: string | null }) => {
    setSelectedCollection(collection);
    setFormError(null);
    setShowDeleteDialog(true);
  };

  const isLoading = authLoading || collectionsLoading;

  if (isLoading || !canRead) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Conhecimento</h1>
              <p className="text-muted-foreground">
                Gerencie suas coleções de documentos
              </p>
            </div>
          </div>

          {canCreate && (
            <Button onClick={() => {
              setName("");
              setDescription("");
              setFormError(null);
              setShowCreateDialog(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Coleção
            </Button>
          )}
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md mb-4">
            {error}
          </div>
        )}

        {collections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma coleção</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira coleção para organizar seus documentos.
              </p>
              {canCreate && (
                <Button onClick={() => {
                  setName("");
                  setDescription("");
                  setFormError(null);
                  setShowCreateDialog(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Coleção
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((collection) => (
              <Card
                key={collection.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => router.push(`/chat/collections/${collection.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(collection)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(collection)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {collection.description && (
                    <CardDescription>{collection.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{collection.documentCount} documento{collection.documentCount !== 1 ? "s" : ""}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Criar */}
        <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Nova Coleção</AlertDialogTitle>
              <AlertDialogDescription>
                Crie uma nova coleção para organizar seus documentos.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              {formError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Nome da coleção"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Descrição da coleção"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Criando..." : "Criar"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de Editar */}
        <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Coleção</AlertDialogTitle>
              <AlertDialogDescription>
                Atualize as informações da coleção.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              {formError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  placeholder="Nome da coleção"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição (opcional)</Label>
                <Input
                  id="edit-description"
                  placeholder="Descrição da coleção"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdate} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de Excluir */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Coleção</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a coleção &quot;{selectedCollection?.name}&quot;?
                Esta ação não pode ser desfeita e todos os documentos serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {formError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                {formError}
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={saving}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {saving ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
