"use client";

import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSuggestedOrgName,
  generateOrgSlug,
} from "@/lib/hooks/use-onboarding";

interface StepOrganizationProps {
  name: string;
  slug: string;
  userName: string;
  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  error: string | null;
}

export function StepOrganization({
  name,
  slug,
  userName,
  onNameChange,
  onSlugChange,
  error,
}: StepOrganizationProps) {
  // Sugerir nome baseado no usuário no primeiro render
  useEffect(() => {
    if (!name && userName) {
      const suggested = getSuggestedOrgName(userName);
      onNameChange(suggested);
      onSlugChange(generateOrgSlug(suggested));
    }
  }, [userName]);

  const handleNameChange = (value: string) => {
    onNameChange(value);
    onSlugChange(generateOrgSlug(value));
  };

  return (
    <div className="space-y-6">
      {/* Ícone e título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-primary/10 rounded-full">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Crie sua Organização</h2>
        <p className="text-muted-foreground">
          Uma organização é seu espaço de trabalho no PineAI
        </p>
      </div>

      {/* Erro */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Nome da Organização</Label>
          <Input
            id="org-name"
            type="text"
            placeholder="Minha Empresa"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-slug">Identificador (slug)</Label>
          <Input
            id="org-slug"
            type="text"
            placeholder="minha-empresa"
            value={slug}
            onChange={(e) =>
              onSlugChange(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
              )
            }
          />
          <p className="text-xs text-muted-foreground">
            Apenas letras minúsculas, números e hífens. Será usado na URL.
          </p>
        </div>
      </div>
    </div>
  );
}
