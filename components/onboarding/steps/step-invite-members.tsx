"use client";

import { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface StepInviteMembersProps {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
  error: string | null;
}

export function StepInviteMembers({
  emails,
  onEmailsChange,
  error,
}: StepInviteMembersProps) {
  const [inputEmail, setInputEmail] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    const email = inputEmail.trim().toLowerCase();

    if (!email) {
      return;
    }

    if (!isValidEmail(email)) {
      setInputError("Email inválido");
      return;
    }

    if (emails.includes(email)) {
      setInputError("Este email já foi adicionado");
      return;
    }

    onEmailsChange([...emails, email]);
    setInputEmail("");
    setInputError(null);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    onEmailsChange(emails.filter((e) => e !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <div className="space-y-6">
      {/* Ícone e título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-primary/10 rounded-full">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Convide sua Equipe</h2>
        <p className="text-muted-foreground">
          Adicione membros para colaborar na organização
        </p>
      </div>

      {/* Erro global */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email do membro</Label>
          <div className="flex gap-2">
            <Input
              id="invite-email"
              type="email"
              placeholder="colega@empresa.com"
              value={inputEmail}
              onChange={(e) => {
                setInputEmail(e.target.value);
                setInputError(null);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddEmail}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {inputError && (
            <p className="text-xs text-red-500">{inputError}</p>
          )}
        </div>

        {/* Lista de emails */}
        {emails.length > 0 && (
          <div className="space-y-2">
            <Label>Membros a convidar ({emails.length})</Label>
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-sm text-muted-foreground text-center">
        Você pode convidar membros depois em Configurações &gt; Membros
      </p>
    </div>
  );
}
