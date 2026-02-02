"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboarding, ONBOARDING_STEPS } from "@/lib/hooks/use-onboarding";
import { WizardProgress } from "./wizard-progress";
import { WizardNavigation } from "./wizard-navigation";
import { StepOrganization } from "./steps/step-organization";
import { StepLLMProvider } from "./steps/step-llm-provider";
import { StepSearchTools } from "./steps/step-search-tools";
import { StepInviteMembers } from "./steps/step-invite-members";
import { StepCompletion } from "./steps/step-completion";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const {
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
  } = useOnboarding();

  // Direção da animação para o slide
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const handleNext = async () => {
    setDirection("forward");
    await goNext();
  };

  const handleBack = () => {
    setDirection("backward");
    goBack();
  };

  const handleSkip = () => {
    setDirection("forward");
    skip();
  };

  // Renderiza o step atual
  const renderStep = () => {
    const stepId = ONBOARDING_STEPS[currentStep]?.id;

    switch (stepId) {
      case "organization":
        return (
          <StepOrganization
            name={state.organizationName}
            slug={state.organizationSlug}
            userName={userName}
            onNameChange={(v) => updateField("organizationName", v)}
            onSlugChange={(v) => updateField("organizationSlug", v)}
            error={error}
          />
        );

      case "llm":
        return (
          <StepLLMProvider
            provider={state.llmProvider}
            apiKey={state.llmApiKey}
            onProviderChange={(v) => updateField("llmProvider", v)}
            onApiKeyChange={(v) => updateField("llmApiKey", v)}
            error={error}
          />
        );

      case "search":
        return (
          <StepSearchTools
            apiKey={state.searchApiKey}
            onApiKeyChange={(v) => updateField("searchApiKey", v)}
            error={error}
          />
        );

      case "invite":
        return (
          <StepInviteMembers
            emails={state.inviteEmails}
            onEmailsChange={(v) => updateField("inviteEmails", v)}
            error={error}
          />
        );

      case "completion":
        return <StepCompletion state={state} />;

      default:
        return null;
    }
  };

  const isCompletionStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="pt-6">
        {/* Progress */}
        <WizardProgress currentStep={currentStep} progress={progress} />

        {/* Step Content com animação */}
        <div
          key={`step-${currentStep}`}
          className={cn(
            "mt-8 animate-in fade-in duration-300",
            direction === "forward"
              ? "slide-in-from-right-4"
              : "slide-in-from-left-4"
          )}
        >
          {renderStep()}
        </div>

        {/* Navigation - não mostra no step de completion */}
        {!isCompletionStep && (
          <WizardNavigation
            onBack={handleBack}
            onSkip={handleSkip}
            onNext={handleNext}
            canBack={canGoBack}
            canSkip={canSkip}
            isLast={isLastStep}
            loading={isSubmitting}
          />
        )}
      </CardContent>
    </Card>
  );
}
