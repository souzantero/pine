"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/hooks/use-onboarding";

interface WizardProgressProps {
  currentStep: number;
  progress: number;
}

export function WizardProgress({ currentStep, progress }: WizardProgressProps) {
  // Não mostra no último step (completion)
  if (currentStep === ONBOARDING_STEPS.length - 1) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Barra de progresso */}
      <Progress value={progress} className="h-1.5" />

      {/* Steps */}
      <div className="flex justify-between">
        {ONBOARDING_STEPS.slice(0, -1).map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5">
              {/* Círculo do step */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  isCompleted &&
                    "bg-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Label do step */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors hidden sm:block",
                  isCurrent && "text-foreground",
                  !isCurrent && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
