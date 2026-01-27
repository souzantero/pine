"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useProviders, useConfigs } from "@/lib/hooks";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Check, AlertCircle } from "lucide-react";

interface KnowledgeConfig {
  storage?: {
    bucket?: string;
    region?: string;
  };
  embedding?: {
    provider?: string;
    model?: string;
  };
}

const EMBEDDING_MODELS = [
  { value: "text-embedding-ada-002", label: "text-embedding-ada-002 (OpenAI)" },
  { value: "text-embedding-3-small", label: "text-embedding-3-small (OpenAI)" },
  { value: "text-embedding-3-large", label: "text-embedding-3-large (OpenAI)" },
];

export default function KnowledgePage() {
  const router = useRouter();
  const { isLoading: authLoading, hasPermission } = useSession();
  const { isLoading: providersLoading, getProvidersByType } = useProviders();
  const {
    isLoading: configsLoading,
    getConfig,
    createConfig,
    updateConfig,
  } = useConfigs("FEATURE");

  // Estados locais do form, null significa "usar valor da config"
  const [localBucket, setLocalBucket] = useState<string | null>(null);
  const [localRegion, setLocalRegion] = useState<string | null>(null);
  const [localEmbeddingModel, setLocalEmbeddingModel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canManage = hasPermission("ORGANIZATION_MANAGE");

  // Busca os providers configurados
  const s3Provider = getProvidersByType("STORAGE").find(
    (p) => p.provider === "AWS_S3"
  );
  const embeddingProvider = getProvidersByType("EMBEDDING").find(
    (p) => p.provider === "OPENAI"
  );

  // Busca a config de conhecimento existente
  const knowledgeConfig = getConfig("FEATURE", "KNOWLEDGE");

  // Valores derivados: usa local se modificado, senao usa config
  const configData = useMemo(() => {
    return (knowledgeConfig?.config as KnowledgeConfig) || {};
  }, [knowledgeConfig]);

  const bucket = localBucket ?? configData.storage?.bucket ?? "";
  const region = localRegion ?? configData.storage?.region ?? "";
  const embeddingModel = localEmbeddingModel ?? configData.embedding?.model ?? "text-embedding-ada-002";

  // Redirect se sem permissão
  useEffect(() => {
    if (!authLoading && !canManage) {
      router.push("/");
    }
  }, [authLoading, canManage, router]);

  const handleSave = async () => {
    if (!bucket.trim()) {
      setError("O bucket é obrigatório");
      return;
    }
    if (!region.trim()) {
      setError("A região é obrigatória");
      return;
    }

    if (!s3Provider) {
      setError("Configure primeiro as credenciais do S3 na página de Provedores");
      return;
    }

    if (!embeddingProvider) {
      setError("Configure primeiro as credenciais de Embedding na página de Provedores");
      return;
    }

    setSaving(true);
    setError(null);

    const config: KnowledgeConfig = {
      storage: {
        bucket: bucket.trim(),
        region: region.trim(),
      },
      embedding: {
        provider: "OPENAI",
        model: embeddingModel,
      },
    };

    // Se já existe config, atualiza; senão, cria nova
    const result = knowledgeConfig
      ? await updateConfig("FEATURE", "KNOWLEDGE", true, config as Record<string, unknown>)
      : await createConfig("FEATURE", "KNOWLEDGE", true, config as Record<string, unknown>);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Limpa estados locais para usar valores da config atualizada
      setLocalBucket(null);
      setLocalRegion(null);
      setLocalEmbeddingModel(null);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  };

  const isLoading = authLoading || providersLoading || configsLoading;

  if (isLoading || !canManage) {
    return null;
  }

  const hasS3Credentials = !!s3Provider;
  const hasEmbeddingCredentials = !!embeddingProvider;
  const canSave = hasS3Credentials && hasEmbeddingCredentials;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Conhecimento</h1>
            <p className="text-muted-foreground">
              Configure o armazenamento e processamento de documentos
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Alertas de credenciais faltando */}
          {(!hasS3Credentials || !hasEmbeddingCredentials) && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Credenciais necessárias
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 list-disc list-inside">
                  {!hasS3Credentials && (
                    <li>AWS S3 (Armazenamento)</li>
                  )}
                  {!hasEmbeddingCredentials && (
                    <li>OpenAI (Embeddings)</li>
                  )}
                </ul>
                <button
                  onClick={() => router.push("/settings/providers")}
                  className="text-sm text-amber-800 dark:text-amber-200 underline hover:no-underline mt-2"
                >
                  Configurar na página de Provedores
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/50 rounded-md flex items-center gap-2">
              <Check className="h-4 w-4" />
              Configurações salvas com sucesso!
            </div>
          )}

          {/* Card de Armazenamento */}
          <Card>
            <CardHeader>
              <CardTitle>Armazenamento</CardTitle>
              <CardDescription>
                Configure onde os arquivos dos documentos serão armazenados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bucket">Bucket S3</Label>
                <Input
                  id="bucket"
                  placeholder="meu-bucket"
                  value={bucket}
                  onChange={(e) => setLocalBucket(e.target.value)}
                  disabled={!hasS3Credentials || saving}
                />
                <p className="text-xs text-muted-foreground">
                  Nome do bucket S3 onde os documentos serão armazenados
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Região AWS</Label>
                <Input
                  id="region"
                  placeholder="us-east-1"
                  value={region}
                  onChange={(e) => setLocalRegion(e.target.value)}
                  disabled={!hasS3Credentials || saving}
                />
                <p className="text-xs text-muted-foreground">
                  Região AWS onde o bucket está localizado
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card de Embedding */}
          <Card>
            <CardHeader>
              <CardTitle>Vetorização</CardTitle>
              <CardDescription>
                Configure como os documentos serão processados e indexados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embedding-model">Modelo de Embedding</Label>
                <Select
                  value={embeddingModel}
                  onValueChange={setLocalEmbeddingModel}
                  disabled={!hasEmbeddingCredentials || saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMBEDDING_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Modelo usado para converter texto em vetores para busca semântica
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            disabled={!canSave || saving || (!bucket && !region)}
            className="w-full"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
