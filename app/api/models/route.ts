import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ModelProvider } from "@/lib/generated/prisma/client";
import { validateSession, authError } from "@/lib/api-auth";

// Definicao dos modelos disponiveis por provedor
const MODELS_BY_PROVIDER: Record<ModelProvider, { id: string; name: string; description?: string }[]> = {
  OPENAI: [
    { id: "gpt-4o", name: "GPT-4o", description: "Modelo mais avançado e rápido" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Versão menor e mais econômica" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Modelo poderoso com contexto estendido" },
    { id: "gpt-4", name: "GPT-4", description: "Modelo original GPT-4" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Rápido e econômico" },
  ],
  OPENROUTER: [
    { id: "openai/gpt-4o", name: "GPT-4o", description: "OpenAI GPT-4o via OpenRouter" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", description: "OpenAI GPT-4o Mini via OpenRouter" },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", description: "Anthropic Claude 3.5 Sonnet" },
    { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", description: "Anthropic Claude 3 Opus" },
    { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", description: "Google Gemini Pro 1.5" },
    { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B", description: "Meta Llama 3.1 405B" },
    { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", description: "Meta Llama 3.1 70B" },
  ],
  ANTHROPIC: [
    { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", description: "Modelo mais recente e balanceado" },
    { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku", description: "Rápido e econômico" },
    { id: "claude-3-opus-latest", name: "Claude 3 Opus", description: "Modelo mais poderoso" },
  ],
  GOOGLE: [
    { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", description: "Modelo experimental mais recente" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Modelo avançado com contexto longo" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Rápido e eficiente" },
  ],
};

// GET - Retornar modelos disponiveis baseado no provedor
export async function GET(request: NextRequest) {
  const auth = await validateSession();
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  if (!currentMembership) {
    return NextResponse.json(
      { error: "Sessão inválida" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const requestedProvider = searchParams.get("provider") as ModelProvider | null;

  // Buscar o provedor padrao e provedores ativos da organizacao
  const organization = await prisma.organization.findUnique({
    where: { id: currentMembership.organizationId },
    select: {
      defaultModelProvider: true,
      modelProviders: {
        where: { isActive: true },
        select: { provider: true },
        orderBy: { provider: "asc" },
      },
    },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organização não encontrada" },
      { status: 404 }
    );
  }

  const configuredProviders = organization.modelProviders.map((p) => p.provider);

  // Determinar qual provedor usar: o solicitado (se ativo) ou o padrao
  let activeProvider: ModelProvider | null = null;

  if (requestedProvider && configuredProviders.includes(requestedProvider)) {
    activeProvider = requestedProvider;
  } else if (organization.defaultModelProvider && configuredProviders.includes(organization.defaultModelProvider)) {
    activeProvider = organization.defaultModelProvider;
  } else if (configuredProviders.length > 0) {
    // Se nao tem padrao mas tem provedores configurados, usa o primeiro
    activeProvider = configuredProviders[0];
  }

  const models = activeProvider ? MODELS_BY_PROVIDER[activeProvider] || [] : [];

  return NextResponse.json({
    defaultProvider: organization.defaultModelProvider,
    selectedProvider: activeProvider,
    models,
    configuredProviders,
  });
}
