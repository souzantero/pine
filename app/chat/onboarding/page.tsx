"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { OnboardingWizard } from "@/components/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, hasOrganization } = useSession();

  // Verifica se o wizard já estava ativo (em caso de refresh)
  const wizardWasActive = useMemo(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("onboarding_wizard_active") === "true";
  }, []);

  // Determina se deve mostrar o wizard
  const shouldShowWizard = !isLoading && isLoggedIn && (!hasOrganization || wizardWasActive);

  // Redireciona se necessário
  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    if (hasOrganization && !wizardWasActive) {
      router.push("/chat");
      return;
    }

    // Marca o wizard como ativo
    sessionStorage.setItem("onboarding_wizard_active", "true");
  }, [isLoading, isLoggedIn, hasOrganization, wizardWasActive, router]);

  // Mostrar nada enquanto verifica ou redireciona
  if (!shouldShowWizard) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <OnboardingWizard userName={user?.name || ""} />
    </div>
  );
}
