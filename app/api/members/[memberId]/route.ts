import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission } from "@/lib/generated/prisma/client";
import { validatePermission, authError } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ memberId: string }>;
}

// PUT - Alterar role do membro
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await validatePermission(Permission.MEMBERS_MANAGE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { memberId } = await params;
  const { roleId } = await request.json();

  if (!roleId) {
    return NextResponse.json(
      { error: "roleId é obrigatório" },
      { status: 400 }
    );
  }

  const { currentMembership } = auth.session;

  // Buscar o membro
  const member = await prisma.organizationMember.findFirst({
    where: {
      id: memberId,
      organizationId: currentMembership.organizationId,
    },
  });

  if (!member) {
    return NextResponse.json(
      { error: "Membro não encontrado" },
      { status: 404 }
    );
  }

  // Não pode alterar role do owner
  if (member.isOwner) {
    return NextResponse.json(
      { error: "Não é possível alterar a role do dono da organização" },
      { status: 403 }
    );
  }

  // Verificar se a role existe e pertence à organização
  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
      organizationId: currentMembership.organizationId,
    },
  });

  if (!role) {
    return NextResponse.json(
      { error: "Role não encontrada" },
      { status: 404 }
    );
  }

  // Atualizar o membro
  const updatedMember = await prisma.organizationMember.update({
    where: { id: memberId },
    data: { roleId },
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
  });

  return NextResponse.json({ member: updatedMember });
}

// DELETE - Remover membro da organização
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await validatePermission(Permission.MEMBERS_MANAGE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { memberId } = await params;
  const { currentMembership, user } = auth.session;

  // Buscar o membro
  const member = await prisma.organizationMember.findFirst({
    where: {
      id: memberId,
      organizationId: currentMembership.organizationId,
    },
  });

  if (!member) {
    return NextResponse.json(
      { error: "Membro não encontrado" },
      { status: 404 }
    );
  }

  // Não pode remover o owner
  if (member.isOwner) {
    return NextResponse.json(
      { error: "Não é possível remover o dono da organização" },
      { status: 403 }
    );
  }

  // Não pode remover a si mesmo
  if (member.userId === user.id) {
    return NextResponse.json(
      { error: "Você não pode remover a si mesmo da organização" },
      { status: 403 }
    );
  }

  // Remover o membro
  await prisma.organizationMember.delete({
    where: { id: memberId },
  });

  return NextResponse.json({ success: true });
}
