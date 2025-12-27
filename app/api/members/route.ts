import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission } from "@/lib/generated/prisma/client";
import { validatePermission, authError } from "@/lib/api-auth";

// GET - Listar membros da organização atual
export async function GET() {
  const auth = await validatePermission(Permission.MEMBERS_READ);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId: currentMembership.organizationId,
    },
    select: {
      id: true,
      isOwner: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      role: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
    orderBy: [
      { isOwner: "desc" },
      { createdAt: "asc" },
    ],
  });

  return NextResponse.json({ members });
}
