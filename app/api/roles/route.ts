import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission } from "@/lib/generated/prisma/client";
import { validateSessionWithOrg, authError } from "@/lib/api-auth";

// GET - Listar roles da organização atual
// Permite acesso com ROLES_READ, MEMBERS_INVITE ou MEMBERS_MANAGE
export async function GET() {
  const auth = await validateSessionWithOrg();
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  // Verificar se tem alguma das permissões necessárias
  const hasPermission =
    currentMembership.isOwner ||
    currentMembership.role.permissions.includes(Permission.ROLES_READ) ||
    currentMembership.role.permissions.includes(Permission.MEMBERS_INVITE) ||
    currentMembership.role.permissions.includes(Permission.MEMBERS_MANAGE);

  if (!hasPermission) {
    return authError({ error: "Permissão negada", status: 403 });
  }

  const roles = await prisma.role.findMany({
    where: {
      organizationId: currentMembership.organizationId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      isSystemRole: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({ roles });
}
