import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { Permission } from "@/lib/generated/prisma/client";

// Tipos de retorno
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthMembership {
  id: string;
  isOwner: boolean;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  role: {
    id: string;
    name: string;
    permissions: Permission[];
  };
}

export interface AuthSession {
  user: AuthUser;
  memberships: AuthMembership[];
  currentMembership: AuthMembership | null;
}

export interface AuthError {
  error: string;
  status: 401 | 403;
}

export type AuthResult =
  | { success: true; session: AuthSession }
  | { success: false; error: AuthError };

export type AuthWithOrgResult =
  | { success: true; session: AuthSession & { currentMembership: AuthMembership } }
  | { success: false; error: AuthError };

/**
 * Valida a sessão do usuário
 * Retorna o usuário e suas memberships ou um erro
 */
export async function validateSession(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session?.value) {
      return {
        success: false,
        error: { error: "Não autenticado", status: 401 },
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.value },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        memberships: {
          select: {
            id: true,
            isOwner: true,
            organizationId: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            role: {
              select: {
                id: true,
                name: true,
                permissions: {
                  select: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      // Sessão inválida - cookie existe mas usuário não
      cookieStore.delete("session");
      return {
        success: false,
        error: { error: "Sessão inválida", status: 401 },
      };
    }

    const { memberships, ...userData } = user;

    const formattedMemberships: AuthMembership[] = memberships.map((m) => ({
      id: m.id,
      isOwner: m.isOwner,
      organizationId: m.organizationId,
      organization: m.organization,
      role: {
        id: m.role.id,
        name: m.role.name,
        permissions: m.role.permissions.map((p) => p.permission),
      },
    }));

    return {
      success: true,
      session: {
        user: userData,
        memberships: formattedMemberships,
        currentMembership: formattedMemberships[0] ?? null,
      },
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return {
      success: false,
      error: { error: "Erro interno do servidor", status: 401 },
    };
  }
}

/**
 * Valida a sessão e garante que o usuário tem pelo menos uma organização
 */
export async function validateSessionWithOrg(): Promise<AuthWithOrgResult> {
  const result = await validateSession();

  if (!result.success) {
    return result;
  }

  if (!result.session.currentMembership) {
    return {
      success: false,
      error: { error: "Usuário não pertence a nenhuma organização", status: 403 },
    };
  }

  return {
    success: true,
    session: result.session as AuthSession & { currentMembership: AuthMembership },
  };
}

/**
 * Valida a sessão e verifica se o usuário tem uma permissão específica
 */
export async function validatePermission(
  permission: Permission
): Promise<AuthWithOrgResult> {
  const result = await validateSessionWithOrg();

  if (!result.success) {
    return result;
  }

  const { currentMembership } = result.session;

  // Owner tem todas as permissões
  if (currentMembership.isOwner) {
    return result;
  }

  // Verificar se a role tem a permissão
  if (!currentMembership.role.permissions.includes(permission)) {
    return {
      success: false,
      error: { error: "Permissão negada", status: 403 },
    };
  }

  return result;
}

/**
 * Helper para criar resposta de erro de autenticação
 */
export function authError(error: AuthError) {
  return Response.json({ error: error.error }, { status: error.status });
}
