// Enums e constantes do sistema

// Permissões do sistema RBAC
export type Permission =
  | "THREADS_READ"
  | "THREADS_WRITE"
  | "THREADS_DELETE"
  | "AGENTS_READ"
  | "AGENTS_WRITE"
  | "AGENTS_DELETE"
  | "MEMBERS_READ"
  | "MEMBERS_INVITE"
  | "MEMBERS_MANAGE"
  | "ROLES_READ"
  | "ROLES_MANAGE"
  | "ORGANIZATION_MANAGE"
  | "PLATFORM_MANAGE";

// Escopo de roles
export type RoleScope = "PLATFORM" | "ORGANIZATION";

// Provedores de modelos de IA
export type ModelProviderType = "OPENAI" | "OPENROUTER";

// Informações de UI dos provedores
export interface ModelProviderInfo {
  value: ModelProviderType;
  label: string;
  placeholder: string;
}

// Constante com lista de provedores disponíveis
export const MODEL_PROVIDERS: ModelProviderInfo[] = [
  { value: "OPENAI", label: "OpenAI", placeholder: "sk-..." },
  { value: "OPENROUTER", label: "OpenRouter", placeholder: "sk-or-..." },
];
