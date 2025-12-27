"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Link } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystemRole: boolean;
}

interface CreateInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onCreateInvite: (roleId: string) => Promise<{ inviteLink?: string; error?: string }>;
}

export function CreateInviteDialog({
  open,
  onOpenChange,
  roles,
  onCreateInvite,
}: CreateInviteDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Filtrar para não mostrar Owner nas opções
  const availableRoles = roles.filter((r) => r.name !== "Owner");

  const handleCreate = async () => {
    if (!selectedRoleId) {
      setError("Selecione uma função");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await onCreateInvite(selectedRoleId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setInviteLink(result.inviteLink || null);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setSelectedRoleId("");
    setInviteLink(null);
    setError(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-[90vw] md:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            {inviteLink ? "Link de Convite Criado" : "Criar Link de Convite"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {inviteLink
              ? "Compartilhe este link com a pessoa que deseja convidar. O link expira em 7 dias."
              : "Crie um link de convite para adicionar novos membros à organização."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!inviteLink ? (
          <>
            <div className="space-y-4 py-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Função do convidado</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span>{role.name}</span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AlertDialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={loading || !selectedRoleId}>
                {loading ? "Criando..." : "Criar Link"}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link">Link de convite</Label>
                <div className="flex gap-2">
                  <Input
                    id="link"
                    value={inviteLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    title="Copiar link"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <Button onClick={handleClose}>Fechar</Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
