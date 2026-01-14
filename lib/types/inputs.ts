// DTOs de entrada para operações de criação e atualização

// ============================================
// Organization
// ============================================

export interface CreateOrganizationData {
  name: string;
  slug: string;
}

export interface UpdateOrganizationData {
  name: string;
  slug: string;
}
