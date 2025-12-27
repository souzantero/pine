import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission } from "@/lib/generated/prisma/client";
import { validatePermission, authError } from "@/lib/api-auth";

// GET - Obter dados da organização atual
export async function GET() {
  const auth = await validatePermission(Permission.ORGANIZATION_MANAGE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  const organization = await prisma.organization.findUnique({
    where: { id: currentMembership.organizationId },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organização não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ organization });
}

// PUT - Atualizar dados da organização
export async function PUT(request: NextRequest) {
  const auth = await validatePermission(Permission.ORGANIZATION_MANAGE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;
  const body = await request.json();
  const { name, slug } = body;

  // Validar que pelo menos um campo foi enviado
  if (!name && !slug) {
    return NextResponse.json(
      { error: "Informe ao menos um campo para atualizar" },
      { status: 400 }
    );
  }

  // Validar nome
  if (name !== undefined) {
    if (!name.trim()) {
      return NextResponse.json(
        { error: "Nome da organização é obrigatório" },
        { status: 400 }
      );
    }
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Nome deve ter no máximo 100 caracteres" },
        { status: 400 }
      );
    }
  }

  // Validar slug
  if (slug !== undefined) {
    if (!slug.trim()) {
      return NextResponse.json(
        { error: "Slug é obrigatório" },
        { status: 400 }
      );
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "Slug deve conter apenas letras minúsculas, números e hífens" },
        { status: 400 }
      );
    }

    if (slug.length < 3 || slug.length > 50) {
      return NextResponse.json(
        { error: "Slug deve ter entre 3 e 50 caracteres" },
        { status: 400 }
      );
    }

    // Verificar se slug já existe (exceto para a org atual)
    const existingOrg = await prisma.organization.findFirst({
      where: {
        slug,
        NOT: { id: currentMembership.organizationId },
      },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Este slug já está em uso" },
        { status: 409 }
      );
    }
  }

  // Atualizar organização
  const updateData: { name?: string; slug?: string } = {};
  if (name) updateData.name = name.trim();
  if (slug) updateData.slug = slug.trim();

  const organization = await prisma.organization.update({
    where: { id: currentMembership.organizationId },
    data: updateData,
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ organization });
}
