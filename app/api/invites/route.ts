import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission } from "@/lib/generated/prisma/client";
import { validatePermission, authError } from "@/lib/api-auth";
import { randomBytes } from "crypto";

const INVITE_EXPIRATION_DAYS = 7;

// GET - Listar convites ativos da organização
export async function GET() {
  const auth = await validatePermission(Permission.MEMBERS_INVITE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  const invites = await prisma.organizationInvite.findMany({
    where: {
      organizationId: currentMembership.organizationId,
      usedAt: null, // Apenas convites não usados
      expiresAt: {
        gt: new Date(), // Apenas não expirados
      },
    },
    select: {
      id: true,
      token: true,
      expiresAt: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Adicionar inviteLink a cada convite
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const invitesWithLinks = invites.map((invite) => ({
    ...invite,
    inviteLink: `${baseUrl}/invite/${invite.token}`,
  }));

  return NextResponse.json({ invites: invitesWithLinks });
}

// POST - Criar novo convite
export async function POST(request: NextRequest) {
  const auth = await validatePermission(Permission.MEMBERS_INVITE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { roleId } = await request.json();

  if (!roleId) {
    return NextResponse.json(
      { error: "roleId é obrigatório" },
      { status: 400 }
    );
  }

  const { currentMembership, user } = auth.session;

  // Verificar se a role existe e pertence à organização
  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
      organizationId: currentMembership.organizationId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!role) {
    return NextResponse.json(
      { error: "Role não encontrada" },
      { status: 404 }
    );
  }

  // Gerar token único
  const token = randomBytes(32).toString("hex");

  // Calcular data de expiração
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRATION_DAYS);

  // Criar convite
  const invite = await prisma.organizationInvite.create({
    data: {
      organizationId: currentMembership.organizationId,
      roleId,
      token,
      createdById: user.id,
      expiresAt,
    },
    select: {
      id: true,
      token: true,
      expiresAt: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/invite/${invite.token}`;

  return NextResponse.json({
    invite: {
      ...invite,
      inviteLink,
    },
  });
}
