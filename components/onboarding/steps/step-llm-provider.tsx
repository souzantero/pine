"use client";

import { useState } from "react";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Provider } from "@/lib/types";
import { PROVIDER_TYPES } from "@/lib/types";

interface StepLLMProviderProps {
  provider: Provider | null;
  apiKey: string;
  onProviderChange: (provider: Provider | null) => void;
  onApiKeyChange: (apiKey: string) => void;
  error: string | null;
}

export function StepLLMProvider({
  provider,
  apiKey,
  onProviderChange,
  onApiKeyChange,
  error,
}: StepLLMProviderProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  // Pega os provedores LLM disponíveis
  const llmProviderType = PROVIDER_TYPES.find((pt) => pt.value === "LLM");
  const llmProviders = llmProviderType?.providers || [];

  const selectedProviderInfo = llmProviders.find((p) => p.value === provider);

  return (
    <div className="space-y-6">
      {/* Ícone e título */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-primary/10 rounded-full">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Configure um Provedor de IA</h2>
        <p className="text-muted-foreground">
          Adicione sua API Key para usar modelos de linguagem
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
          <Label htmlFor="llm-provider">Provedor</Label>
          <Select
            value={provider || ""}
            onValueChange={(value) =>
              onProviderChange(value ? (value as Provider) : null)
            }
          >
            <SelectTrigger id="llm-provider">
              <SelectValue placeholder="Selecione um provedor" />
            </SelectTrigger>
            <SelectContent>
              {llmProviders.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {provider && (
          <div className="space-y-2">
            <Label htmlFor="llm-apikey">API Key</Label>
            <div className="relative">
              <Input
                id="llm-apikey"
                type={showApiKey ? "text" : "password"}
                placeholder={selectedProviderInfo?.placeholder || "sk-..."}
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
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-sm text-muted-foreground text-center">
        Você pode configurar isso depois em Configurações &gt; Provedores
      </p>
    </div>
  );
}
