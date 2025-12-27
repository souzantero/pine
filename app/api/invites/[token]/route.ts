import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { validateSession, authError } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ token: string }>;
}

const CURRENT_ORG_COOKIE = "current_org";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

// GET - Obter informações do convite (público)
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { token } = await params;

  const invite = await prisma.organizationInvite.findUnique({
    where: { token },
    select: {
      id: true,
      expiresAt: true,
      usedAt: true,
      organization: {
        select: {
          name: true,
          slug: true,
        },
      },
      role: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!invite) {
    return NextResponse.json(
      { error: "Convite não encontrado" },
      { status: 404 }
    );
  }

  const now = new Date();
  const isExpired = invite.expiresAt < now;
  const isUsed = invite.usedAt !== null;

  return NextResponse.json({
    organization: invite.organization,
    role: invite.role,
    createdBy: invite.createdBy,
    expiresAt: invite.expiresAt,
    isExpired,
    isUsed,
  });
}

// POST - Aceitar convite (requer autenticação)
export async function POST(request: NextRequest, { params }: RouteParams) {
  const auth = await validateSession();
  if (!auth.success) {
    return authError(auth.error);
  }

  const { token } = await params;
  const { user } = auth.session;

  // Buscar convite
  const invite = await prisma.organizationInvite.findUnique({
    where: { token },
    include: {
      organization: true,
      role: {
        include: {
          permissions: {
            select: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!invite) {
    return NextResponse.json(
      { error: "Convite não encontrado" },
      { status: 404 }
    );
  }

  // Verificar se já foi usado
  if (invite.usedAt) {
    return NextResponse.json(
      { error: "Este convite já foi utilizado" },
      { status: 400 }
    );
  }

  // Verificar se expirou
  if (invite.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Este convite expirou" },
      { status: 400 }
    );
  }

  // Verificar se usuário já é membro
  const existingMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: invite.organizationId,
      },
    },
  });

  if (existingMembership) {
    return NextResponse.json(
      { error: "Você já é membro desta organização" },
      { status: 400 }
    );
  }

  // Criar membership e marcar convite como usado
  const [membership] = await prisma.$transaction([
    prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: invite.organizationId,
        roleId: invite.roleId,
      },
      include: {
        organization: true,
        role: {
          include: {
            permissions: {
              select: {
                permission: true,
              },
            },
          },
        },
      },
    }),
    prisma.organizationInvite.update({
      where: { id: invite.id },
      data: {
        usedAt: new Date(),
        usedById: user.id,
      },
    }),
  ]);

  // Definir a nova org como ativa
  const cookieStore = await cookies();
  cookieStore.set(CURRENT_ORG_COOKIE, invite.organizationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return NextResponse.json({
    membership: {
      id: membership.id,
      isOwner: membership.isOwner,
      organization: membership.organization,
      role: {
        id: membership.role.id,
        name: membership.role.name,
        description: membership.role.description,
        permissions: membership.role.permissions.map((p) => p.permission),
      },
    },
  });
}
