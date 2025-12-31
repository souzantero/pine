import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission, PromptRole } from "@/lib/generated/prisma/client";
import { validatePermission, authError } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ promptId: string }>;
}

// GET - Obter um prompt específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await validatePermission(Permission.PROMPTS_READ);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { promptId } = await params;
  const { currentMembership } = auth.session;

  const prompt = await prisma.prompt.findFirst({
    where: {
      id: promptId,
      organizationId: currentMembership.organizationId,
    },
    select: {
      id: true,
      name: true,
      content: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ prompt });
}

// PUT - Atualizar prompt
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await validatePermission(Permission.PROMPTS_WRITE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { promptId } = await params;
  const { currentMembership } = auth.session;

  // Verificar se prompt existe e pertence à organização
  const existingPrompt = await prisma.prompt.findFirst({
    where: {
      id: promptId,
      organizationId: currentMembership.organizationId,
    },
  });

  if (!existingPrompt) {
    return NextResponse.json(
      { error: "Prompt não encontrado" },
      { status: 404 }
    );
  }

  let body: { name?: string; content?: string; role?: PromptRole };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { name, content, role } = body;

  // Validar campos se fornecidos
  if (name !== undefined && !name.trim()) {
    return NextResponse.json(
      { error: "Nome não pode ser vazio" },
      { status: 400 }
    );
  }

  if (content !== undefined && !content.trim()) {
    return NextResponse.json(
      { error: "Conteúdo não pode ser vazio" },
      { status: 400 }
    );
  }

  const validRoles: PromptRole[] = ["SYSTEM", "USER", "ASSISTANT"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json(
      { error: "Role inválida. Use: SYSTEM, USER ou ASSISTANT" },
      { status: 400 }
    );
  }

  const prompt = await prisma.prompt.update({
    where: { id: promptId },
    data: {
      ...(name && { name: name.trim() }),
      ...(content && { content: content.trim() }),
      ...(role && { role }),
    },
    select: {
      id: true,
      name: true,
      content: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ prompt });
}

// DELETE - Remover prompt
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await validatePermission(Permission.PROMPTS_DELETE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { promptId } = await params;
  const { currentMembership } = auth.session;

  // Verificar se prompt existe e pertence à organização
  const prompt = await prisma.prompt.findFirst({
    where: {
      id: promptId,
      organizationId: currentMembership.organizationId,
    },
  });

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt não encontrado" },
      { status: 404 }
    );
  }

  await prisma.prompt.delete({
    where: { id: promptId },
  });

  return NextResponse.json({ success: true });
}
