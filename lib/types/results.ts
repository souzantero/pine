// Tipos de retorno para operações e mutations

import type { Organization } from "./entities";

// ============================================
// Base
// ============================================

export interface MutationResult<T = void> {
  data?: T;
  error?: string;
}

// ============================================
// Invites
// ============================================

export interface CreateInviteResult extends MutationResult {
  inviteLink?: string;
}

// ============================================
// Organization
// ============================================

export interface CreateOrganizationResult extends MutationResult {
  organization?: Organization;
}
