"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Users,
  Settings,
  Building2,
  Plug,
  Wrench,
  Brain,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/session";
import { getMenuExpanded, setMenuExpanded } from "@/lib/storage";
import type { SidebarProps, NavSection } from "./types";

// Conteúdo compartilhado da sidebar
function SidebarContent({
  threads,
  selectedId,
  onSelect,
  onNewChat,
  onItemClick,
  showMenuToggle = true,
  isMobile = false,
  hasProviders = true,
}: SidebarProps & { onItemClick?: () => void; showMenuToggle?: boolean; isMobile?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = useSession();
  const [menuExpanded, setMenuExpandedState] = useState(getMenuExpanded);

  // Wrapper para persistir estado no storage
  const handleMenuExpandedChange = (expanded: boolean) => {
    setMenuExpandedState(expanded);
    setMenuExpanded(expanded);
  };

  const canViewMembers = hasPermission("MEMBERS_READ");
  const canManageOrg = hasPermission("ORGANIZATION_MANAGE");
  const canViewCollections = hasPermission("COLLECTIONS_READ");

  // Determinar qual seção está ativa baseado na rota
  const getActiveSection = (): NavSection => {
    if (pathname === "/chat/settings" || pathname === "/chat/settings/members" || pathname.startsWith("/chat/settings/")) return "settings";
    if (pathname.startsWith("/chat/collections")) return "collections";
    return "threads";
  };
  const activeSection = getActiveSection();

  const handleSelect = (id: string) => {
    onSelect(id);
    onItemClick?.();
  };

  const handleNewChat = () => {
    onNewChat();
    onItemClick?.();
  };

  const handleMembersClick = () => {
    router.push("/chat/settings/members");
    onItemClick?.();
  };

  const handleOrganizationClick = () => {
    router.push("/chat/settings");
    onItemClick?.();
  };

  const handleProvidersClick = () => {
    router.push("/chat/settings/providers");
    onItemClick?.();
  };

  const handleToolsClick = () => {
    router.push("/chat/settings/tools");
    onItemClick?.();
  };

  const handleKnowledgeClick = () => {
    router.push("/chat/settings/knowledge");
    onItemClick?.();
  };

  const handleBillingClick = () => {
    router.push("/chat/settings/billing");
    onItemClick?.();
  };

  const handleCollectionsClick = () => {
    router.push("/chat/collections");
    onItemClick?.();
  };

  const handleConversasClick = () => {
    router.push("/chat");
    onItemClick?.();
  };

  const handleSettingsClick = () => {
    // Navegar para a primeira opção disponível
    if (canManageOrg) {
      router.push("/chat/settings");
    } else if (canViewMembers) {
      router.push("/chat/settings/members");
    }
    onItemClick?.();
  };

  const canAccessSettings = canViewMembers || canManageOrg;

  return (
    <div className="flex h-full">
      {/* Menu principal */}
      <aside
        className={cn(
          "border-r bg-muted/30 flex flex-col transition-all duration-300",
          menuExpanded ? "w-48" : "w-14"
        )}
      >
        {showMenuToggle && (
          <div className={cn("p-2", menuExpanded ? "flex justify-end" : "flex justify-center")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMenuExpandedChange(!menuExpanded)}
              title={menuExpanded ? "Encolher menu" : "Expandir menu"}
            >
              {menuExpanded ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}

        <nav className={cn("flex-1 p-2", !showMenuToggle && "pt-4")}>
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleConversasClick}
                title={!menuExpanded ? "Conversas" : undefined}
                className={cn(
                  "w-full flex items-center rounded-md transition-colors",
                  menuExpanded ? "gap-3 px-3 py-2" : "justify-center p-2",
                  activeSection === "threads"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                {menuExpanded && <span className="text-sm font-medium">Conversas</span>}
              </button>
            </li>
            {canViewCollections && (
              <li>
                <button
                  onClick={handleCollectionsClick}
                  title={!menuExpanded ? "Conhecimento" : undefined}
                  className={cn(
                    "w-full flex items-center rounded-md transition-colors",
                    menuExpanded ? "gap-3 px-3 py-2" : "justify-center p-2",
                    activeSection === "collections"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Brain className="h-5 w-5 shrink-0" />
                  {menuExpanded && <span className="text-sm font-medium">Conhecimento</span>}
                </button>
              </li>
            )}
            {canAccessSettings && (
              <li>
                <button
                  onClick={handleSettingsClick}
                  title={!menuExpanded ? "Configurações" : undefined}
                  className={cn(
                    "w-full flex items-center rounded-md transition-colors",
                    menuExpanded ? "gap-3 px-3 py-2" : "justify-center p-2",
                    activeSection === "settings"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  {menuExpanded && <span className="text-sm font-medium">Configurações</span>}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Submenu - Lista de threads (só aparece quando Conversas está ativo) */}
      {activeSection === "threads" && (
        <aside className="w-56 border-r bg-muted/40 flex flex-col">
          <div className={cn("p-2", isMobile && "pt-12")}>
            <Button
              variant="outline"
              size="default"
              onClick={handleNewChat}
              title={hasProviders ? "Nova conversa" : "Configure um provedor primeiro"}
              className="w-full"
              disabled={!hasProviders}
            >
              <Plus className="h-4 w-4" />
              <span className="ml-2">Nova conversa</span>
            </Button>
            {!hasProviders && (
              <p className="text-xs text-muted-foreground mt-2 px-1">
                Configure um provedor em{" "}
                <button
                  onClick={handleOrganizationClick}
                  className="text-primary hover:underline"
                >
                  Configurações
                </button>{" "}
                para iniciar.
              </p>
            )}
          </div>

          <ScrollArea className="flex-1">
            <nav className="p-2">
              <ul className="space-y-1">
                {threads.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                    Nenhuma conversa
                  </li>
                ) : (
                  threads.map((thread) => (
                    <li key={thread.id}>
                      <button
                        onClick={() => handleSelect(thread.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                          selectedId === thread.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span className="truncate">{thread.title}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </nav>
          </ScrollArea>
        </aside>
      )}

      {/* Submenu - Conhecimento (só aparece quando Conhecimento está ativo) */}
      {activeSection === "collections" && (
        <aside className="w-56 border-r bg-muted/40 flex flex-col">
          <div className={cn("p-2", isMobile && "pt-12")}>
            <h2 className="px-3 py-2 text-sm font-semibold text-muted-foreground">
              Conhecimento
            </h2>
          </div>

          <nav className="p-2">
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Gerencie suas coleções de documentos na página principal.
            </p>
          </nav>
        </aside>
      )}

      {/* Submenu - Configurações (só aparece quando Configurações está ativo) */}
      {activeSection === "settings" && (
        <aside className="w-56 border-r bg-muted/40 flex flex-col">
          <div className={cn("p-2", isMobile && "pt-12")}>
            <h2 className="px-3 py-2 text-sm font-semibold text-muted-foreground">
              Configurações
            </h2>
          </div>

          <nav className="p-2">
            <ul className="space-y-1">
              {canManageOrg && (
                <>
                  <li>
                    <button
                      onClick={handleOrganizationClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                        pathname === "/chat/settings"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span>Organização</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleProvidersClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                        pathname === "/chat/settings/providers"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Plug className="h-4 w-4 shrink-0" />
                      <span>Provedores</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleToolsClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                        pathname === "/chat/settings/tools"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Wrench className="h-4 w-4 shrink-0" />
                      <span>Ferramentas</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleKnowledgeClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                        pathname === "/chat/settings/knowledge"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Brain className="h-4 w-4 shrink-0" />
                      <span>Conhecimento</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleBillingClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                        pathname === "/chat/settings/billing"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <CreditCard className="h-4 w-4 shrink-0" />
                      <span>Plano</span>
                    </button>
                  </li>
                </>
              )}
              {canViewMembers && (
                <li>
                  <button
                    onClick={handleMembersClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                      pathname === "/chat/settings/members"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Membros</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}

// Sidebar para desktop
export function Sidebar(props: SidebarProps) {
  return (
    <div className="hidden md:flex h-full">
      <SidebarContent {...props} />
    </div>
  );
}
