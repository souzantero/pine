"use client";

import { Settings, PanelRightClose, PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

export interface ProviderOption {
  value: string;
  label: string;
}

// Mapeamento de nomes de provedores para labels amigaveis
const PROVIDER_LABELS: Record<string, string> = {
  OPENAI: "OpenAI",
  OPENROUTER: "OpenRouter",
  ANTHROPIC: "Anthropic",
  GOOGLE: "Google AI",
};

interface SettingsContentProps {
  model: string;
  onModelChange: (model: string) => void;
  temperature: number;
  onTemperatureChange: (temperature: number) => void;
  availableModels: ModelOption[];
  systemPrompts: SystemPrompt[];
  selectedPromptId: string | null;
  onPromptChange: (promptId: string | null) => void;
  selectedProvider: string | null;
  configuredProviders: string[];
  onProviderChange: (provider: string) => void;
}

// Conteúdo compartilhado das configurações
function SettingsContent({ model, onModelChange, temperature, onTemperatureChange, availableModels, systemPrompts, selectedPromptId, onPromptChange, selectedProvider, configuredProviders, onProviderChange }: SettingsContentProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Seletor de Provedor */}
      {configuredProviders.length > 0 && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Provedor</label>
            <Select value={selectedProvider ?? ""} onValueChange={onProviderChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um provedor" />
              </SelectTrigger>
              <SelectContent>
                {configuredProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {PROVIDER_LABELS[provider] || provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
        </>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Modelo</label>
        {availableModels.length > 0 ? (
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex flex-col">
                    <span>{m.name}</span>
                    {m.description && (
                      <span className="text-xs text-muted-foreground">{m.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            Configure um provedor de IA nas configurações da organização
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="text-sm font-medium">System Prompt</label>
        <Select
          value={selectedPromptId ?? "none"}
          onValueChange={(value) => onPromptChange(value === "none" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um prompt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            {systemPrompts.map((prompt) => (
              <SelectItem key={prompt.id} value={prompt.id}>
                {prompt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Define o comportamento e contexto inicial do assistente.
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Temperatura</label>
          <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
        </div>
        <Slider
          value={[temperature]}
          onValueChange={(value) => onTemperatureChange(value[0])}
          min={0}
          max={2}
          step={0.1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Valores baixos = respostas mais focadas. Valores altos = mais criatividade.
        </p>
      </div>
    </div>
  );
}

interface ChatSettingsProps extends SettingsContentProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

// Desktop Settings Panel
export function ChatSettings({ model, onModelChange, temperature, onTemperatureChange, availableModels, systemPrompts, selectedPromptId, onPromptChange, selectedProvider, configuredProviders, onProviderChange, expanded, onExpandedChange }: ChatSettingsProps) {
  return (
    <aside
      className={cn(
        "border-l bg-muted/20 flex flex-col h-full transition-all duration-300",
        expanded ? "w-64" : "w-12"
      )}
    >
      <div className={cn("p-2 border-b", expanded ? "flex justify-between items-center" : "flex justify-center")}>
        {expanded && (
          <div className="flex items-center gap-2 text-sm font-medium px-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExpandedChange(!expanded)}
          title={expanded ? "Esconder painel" : "Mostrar configurações"}
        >
          {expanded ? (
            <PanelRightClose className="h-5 w-5" />
          ) : (
            <PanelRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="flex-1 overflow-y-auto">
          <SettingsContent
            model={model}
            onModelChange={onModelChange}
            temperature={temperature}
            onTemperatureChange={onTemperatureChange}
            availableModels={availableModels}
            systemPrompts={systemPrompts}
            selectedPromptId={selectedPromptId}
            onPromptChange={onPromptChange}
            selectedProvider={selectedProvider}
            configuredProviders={configuredProviders}
            onProviderChange={onProviderChange}
          />
        </div>
      )}

      {!expanded && (
        <div className="flex-1 flex flex-col items-center pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExpandedChange(true)}
            title="Mostrar configurações"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      )}
    </aside>
  );
}

interface MobileChatSettingsProps extends SettingsContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mobile Settings (Sheet/Drawer)
export function MobileChatSettings({ model, onModelChange, temperature, onTemperatureChange, availableModels, systemPrompts, selectedPromptId, onPromptChange, selectedProvider, configuredProviders, onProviderChange, open, onOpenChange }: MobileChatSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </SheetTitle>
        </SheetHeader>
        <SettingsContent
          model={model}
          onModelChange={onModelChange}
          temperature={temperature}
          onTemperatureChange={onTemperatureChange}
          availableModels={availableModels}
          systemPrompts={systemPrompts}
          selectedPromptId={selectedPromptId}
          onPromptChange={onPromptChange}
          selectedProvider={selectedProvider}
          configuredProviders={configuredProviders}
          onProviderChange={onProviderChange}
        />
      </SheetContent>
    </Sheet>
  );
}
