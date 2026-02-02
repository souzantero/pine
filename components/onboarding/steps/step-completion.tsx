"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles, Search, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";
import type { OnboardingState } from "@/lib/hooks/use-onboarding";

interface StepCompletionProps {
  state: OnboardingState;
}

export function StepCompletion({ state }: StepCompletionProps) {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGoToChat = async () => {
    setIsNavigating(true);
    // Limpa flag do wizard
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("onboarding_wizard_active");
    }
    // Atualiza a sessão para incluir a nova organização
    await refreshSession();
    router.push("/chat");
  };

  const hasLLM = !!state.llmProvider && !!state.llmApiKey;
  const hasSearch = !!state.searchApiKey;
  const inviteCount = state.inviteEmails.length;

  return (
    <div className="space-y-8">
      {/* Ícone e título */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 bg-green-100 dark:bg-green-950/50 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold">Tudo Pronto!</h2>
        <p className="text-muted-foreground">
          Sua organização foi configurada com sucesso
        </p>
      </div>

      {/* Resumo */}
      <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
        {/* Organização */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Organização</p>
            <p className="text-sm text-muted-foreground">
              {state.organizationName}
            </p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>

        {/* Provedor LLM */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Modelo de IA</p>
            <p className="text-sm text-muted-foreground">
              {hasLLM ? state.llmProvider : "Não configurado"}
            </p>
          </div>
          {hasLLM ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
          )}
        </div>

        {/* Busca na Web */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Busca na Web</p>
            <p className="text-sm text-muted-foreground">
              {hasSearch ? "Tavily habilitado" : "Não configurado"}
            </p>
          </div>
          {hasSearch ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
          )}
        </div>

        {/* Convites */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Equipe</p>
            <p className="text-sm text-muted-foreground">
              {inviteCount > 0
                ? `${inviteCount} convite${inviteCount > 1 ? "s" : ""} criado${inviteCount > 1 ? "s" : ""}`
                : "Nenhum convite criado"}
            </p>
          </div>
          {inviteCount > 0 ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
          )}
        </div>
      </div>

      {/* Botão */}
      <Button onClick={handleGoToChat} size="lg" className="w-full" disabled={isNavigating}>
        {isNavigating ? "Carregando..." : "Ir para o Chat"}
      </Button>
    </div>
  );
}
