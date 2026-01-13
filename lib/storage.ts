// Gestão de dados no localStorage
// Centraliza o acesso ao storage para token JWT, organização atual e configurações de threads

const TOKEN_KEY = "pinechat_token";
const CURRENT_ORG_KEY = "pinechat_current_org";
const THREAD_CONFIG_PREFIX = "pinechat_thread_";

// Token JWT
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// Organização atual
export function getCurrentOrgId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_ORG_KEY);
}

export function setCurrentOrgId(orgId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_ORG_KEY, orgId);
}

export function clearCurrentOrgId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_ORG_KEY);
}

// Configurações específicas por thread + agente
// Chave: pinechat_thread_{threadId}_{agentId}
export function getThreadConfig<T>(threadId: string, agentId: string): T | null {
  if (typeof window === "undefined") return null;
  const key = THREAD_CONFIG_PREFIX + threadId + "_" + agentId;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}

export function setThreadConfig<T>(threadId: string, agentId: string, config: T): void {
  if (typeof window === "undefined") return;
  const key = THREAD_CONFIG_PREFIX + threadId + "_" + agentId;
  localStorage.setItem(key, JSON.stringify(config));
}

export function clearThreadConfig(threadId: string, agentId: string): void {
  if (typeof window === "undefined") return;
  const key = THREAD_CONFIG_PREFIX + threadId + "_" + agentId;
  localStorage.removeItem(key);
}
