"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardNavigationProps {
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
  canBack: boolean;
  canSkip: boolean;
  isLast: boolean;
  loading: boolean;
}

export function WizardNavigation({
  onBack,
  onSkip,
  onNext,
  canBack,
  canSkip,
  isLast,
  loading,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6">
      {/* Botão Voltar */}
      <div className="w-24">
        {canBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={loading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
      </div>

      {/* Botão Pular (centro) */}
      <div className="flex-1 flex justify-center">
        {canSkip && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            Pular esta etapa
          </Button>
        )}
      </div>

      {/* Botão Continuar/Finalizar */}
      <div className="w-24 flex justify-end">
        <Button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            "Salvando..."
          ) : isLast ? (
            "Finalizar"
          ) : (
            <>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
