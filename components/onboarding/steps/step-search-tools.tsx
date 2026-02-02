"use client";

import { useState } from "react";
import { Search, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepSearchToolsProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
  error: string | null;
}

export function StepSearchTools({
  apiKey,
  onApiKeyChange,
  error,
}: StepSearchToolsProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="space-y-6">
      {/* Ícone e título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-primary/10 rounded-full">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Habilite Busca na Web</h2>
        <p className="text-muted-foreground">
          Permita que o agente busque informações atualizadas na internet
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
          <Label htmlFor="search-provider">Provedor de Busca</Label>
          <Input
            id="search-provider"
            type="text"
            value="Tavily"
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Tavily é o provedor de busca recomendado para IA
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-apikey">API Key do Tavily</Label>
          <div className="relative">
            <Input
              id="search-apikey"
              type={showApiKey ? "text" : "password"}
              placeholder="tvly-..."
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Obtenha sua API Key em{" "}
            <a
              href="https://tavily.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              tavily.com
            </a>
          </p>
        </div>
      </div>

      {/* Hint */}
      <p className="text-sm text-muted-foreground text-center">
        Você pode habilitar isso depois em Configurações &gt; Ferramentas
      </p>
    </div>
  );
}
