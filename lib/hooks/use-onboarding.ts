"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { setCurrentOrgId } from "@/lib/storage";
import type { Provider, ProviderType, Organization } from "@/lib/types";

// Estado do wizard de onboarding
export interface OnboardingState {
  // Step 1: Organização
  organizationName: string;
  organizationSlug: string;
  // Step 2: Provedor LLM
  llmProvider: Provider | null;
  llmApiKey: string;
  // Interno
  createdOrgId: string | null;
}

export interface OnboardingStep {
  id: string;
  label: string;
  required: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "organization", label: "Organização", required: true },
  { id: "llm", label: "Modelo de IA", required: false },
  { id: "completion", label: "Pronto", required: true },
];

const initialState: OnboardingState = {
  organizationName: "",
  organizationSlug: "",
  llmProvider: null,
  llmApiKey: "",
  createdOrgId: null,
};

interface UseOnboardingReturn {
  state: OnboardingState;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
  updateField: <K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K]
  ) => void;
  goNext: () => Promise<boolean>;
  goBack: () => void;
  skip: () => void;
  canGoBack: boolean;
  canSkip: boolean;
  isLastStep: boolean;
  progress: number;
  totalSteps: number;
}

export function useOnboarding(): UseOnboardingReturn {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = ONBOARDING_STEPS.length;
  const currentStepInfo = ONBOARDING_STEPS[currentStep];
  const canGoBack = currentStep > 0 && currentStep < totalSteps - 1;
  const canSkip = !currentStepInfo?.required && currentStep < totalSteps - 1;
  const isLastStep = currentStep === totalSteps - 1;

  // Calcula progresso (0-100)
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  const updateField = useCallback(
    <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    []
  );

  // Gera slug a partir do nome
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Validação do step atual
  const validateCurrentStep = (): string | null => {
    switch (currentStep) {
      case 0: // Organização
        if (!state.organizationName.trim()) {
          return "Nome da organização é obrigatório";
        }
        if (!state.organizationSlug.trim()) {
          return "Identificador é obrigatório";
        }
        if (state.organizationSlug.length < 3) {
          return "Identificador deve ter pelo menos 3 caracteres";
        }
        break;
      case 1: // LLM Provider
        if (state.llmProvider && !state.llmApiKey.trim()) {
          return "API Key é obrigatória quando um provedor está selecionado";
        }
        break;
    }
    return null;
  };

  // Cria organização (Step 1)
  const createOrganization = async (): Promise<boolean> => {
    const response = await api.post<Organization>("/organizations", {
      name: state.organizationName.trim(),
      slug: state.organizationSlug.trim(),
    });

    if (response.error) {
      setError(response.error);
      return false;
    }

    if (response.data) {
      const orgId = response.data.id;
      setState((prev) => ({ ...prev, createdOrgId: orgId }));
      setCurrentOrgId(orgId);
      // Não chamamos refreshSession aqui para evitar redirect durante o wizard
    }

    return true;
  };

  // Adiciona provedor (Step 2 e 3)
  const addProvider = async (
    type: ProviderType,
    provider: Provider,
    apiKey: string
  ): Promise<boolean> => {
    const orgId = state.createdOrgId;
    if (!orgId) {
      setError("Organização não encontrada");
      return false;
    }

    const response = await api.post(`/organizations/${orgId}/providers`, {
      type,
      provider,
      credentials: { apiKey },
    });

    if (response.error) {
      setError(response.error);
      return false;
    }

    return true;
  };

  // Executa ação do step atual
  const executeStepAction = async (): Promise<boolean> => {
    switch (currentStep) {
      case 0: // Organização
        return await createOrganization();

      case 1: // LLM Provider
        if (state.llmProvider && state.llmApiKey.trim()) {
          return await addProvider("LLM", state.llmProvider, state.llmApiKey);
        }
        return true;

      default:
        return true;
    }
  };

  const goNext = useCallback(async (): Promise<boolean> => {
    setError(null);

    // Validar step atual
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return false;
    }

    // Executar ação do step
    setIsSubmitting(true);
    try {
      const success = await executeStepAction();
      if (!success) {
        return false;
      }

      // Avançar para próximo step
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, state, totalSteps]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    if (canSkip) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
    }
  }, [canSkip]);

  return {
    state,
    currentStep,
    isSubmitting,
    error,
    updateField,
    goNext,
    goBack,
    skip,
    canGoBack,
    canSkip,
    isLastStep,
    progress,
    totalSteps,
  };
}

// Helper para gerar nome sugerido
export function getSuggestedOrgName(userName: string): string {
  if (!userName) return "";
  const firstName = userName.split(" ")[0];
  return `${firstName}'s Workspace`;
}

// Helper para gerar slug a partir do nome
export function generateOrgSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
