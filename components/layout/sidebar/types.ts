// Tipos compartilhados dos componentes de sidebar

import type { Thread } from "@/lib/types";

export type NavSection = "threads" | "collections" | "settings";

export interface SidebarProps {
  threads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  hasProviders?: boolean;
}

export interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThreadsClick: () => void;
  onSettingsClick: () => void;
}

export interface MobileSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MobileThreadsDrawerProps {
  threads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasProviders?: boolean;
}
