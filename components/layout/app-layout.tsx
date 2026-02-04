"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useModels } from "@/lib/hooks";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./sidebar/mobile-sidebar";
import { MobileThreadsDrawer } from "./sidebar/mobile-threads-drawer";
import { MobileSettingsDrawer } from "./sidebar/mobile-settings-drawer";
import { Skeleton } from "@/components/ui/skeleton";

interface AppLayoutProps {
  children: ReactNode;
  showSettingsButton?: boolean;
  onSettingsClick?: () => void;
  loading?: boolean;
  // Props de threads (passadas pela pagina de chat)
  threads?: { id: string; title: string; updatedAt: Date }[];
  selectedThreadId?: string | null;
  onSelectThread?: (id: string) => void;
  onNewChat?: () => void;
  creatingThread?: boolean;
}

// Skeleton generico para conteudo interno
function ContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

export function AppLayout({
  children,
  showSettingsButton,
  onSettingsClick,
  loading,
  threads = [],
  selectedThreadId = null,
  onSelectThread,
  onNewChat,
  creatingThread = false,
}: AppLayoutProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, hasOrganization } = useSession();
  const { configuredProviders } = useModels();

  // Estados de UI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileThreadsOpen, setMobileThreadsOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  // Redirect se não autenticado
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        router.push("/auth/login");
      } else if (!hasOrganization) {
        router.push("/chat/onboarding");
      }
    }
  }, [authLoading, isLoggedIn, hasOrganization, router]);

  // Handle thread selection
  const handleSelectThread = (id: string) => {
    if (onSelectThread) {
      onSelectThread(id);
    } else {
      // Navega para /chat (deixa o chat page gerenciar)
      router.push("/chat");
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      router.push("/chat");
    }
  };

  const hasProviders = configuredProviders.length > 0;

  // Skeleton do layout enquanto carrega autenticacao
  if (authLoading) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header Skeleton */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton - hidden on mobile */}
          <div className="hidden md:flex w-64 border-r flex-col p-4 gap-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Redireciona se nao autenticado (apos loading)
  if (!isLoggedIn || !hasOrganization) {
    return null;
  }

  const sidebarProps = {
    threads,
    selectedId: selectedThreadId,
    onSelect: handleSelectThread,
    onNewChat: handleNewChat,
    hasProviders,
    creatingThread,
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        onMenuClick={() => setMobileMenuOpen(true)}
        onSettingsClick={onSettingsClick}
        showSettingsButton={showSettingsButton}
      />

      {/* Mobile Menu */}
      <MobileSidebar
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        onThreadsClick={() => setMobileThreadsOpen(true)}
        onSettingsClick={() => setMobileSettingsOpen(true)}
      />

      {/* Mobile Threads Drawer */}
      <MobileThreadsDrawer
        threads={threads}
        selectedId={selectedThreadId}
        onSelect={handleSelectThread}
        onNewChat={handleNewChat}
        open={mobileThreadsOpen}
        onOpenChange={setMobileThreadsOpen}
        hasProviders={hasProviders}
        creatingThread={creatingThread}
      />

      {/* Mobile Settings Drawer */}
      <MobileSettingsDrawer
        open={mobileSettingsOpen}
        onOpenChange={setMobileSettingsOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar {...sidebarProps} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {loading ? <ContentSkeleton /> : children}
        </main>
      </div>
    </div>
  );
}
