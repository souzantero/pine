import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission, PromptRole } from "@/lib/generated/prisma/client";
import { validatePermission, authError } from "@/lib/api-auth";

// GET - Listar prompts da organizacao atual
export async function GET() {
  const auth = await validatePermission(Permission.PROMPTS_READ);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  const prompts = await prisma.prompt.findMany({
    where: {
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
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json({ prompts });
}

// POST - Criar novo prompt
export async function POST(request: Request) {
  const auth = await validatePermission(Permission.PROMPTS_WRITE);
  if (!auth.success) {
    return authError(auth.error);
  }

  const { currentMembership } = auth.session;

  let body: { name?: string; content?: string; role?: PromptRole };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { name, content, role } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  if (!content || !content.trim()) {
    return NextResponse.json(
      { error: "Conteúdo é obrigatório" },
      { status: 400 }
    );
  }

  // Validar role se fornecido
  const validRoles: PromptRole[] = ["SYSTEM", "USER", "ASSISTANT"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json(
      { error: "Role inválida. Use: SYSTEM, USER ou ASSISTANT" },
      { status: 400 }
    );
  }

  const prompt = await prisma.prompt.create({
    data: {
      organizationId: currentMembership.organizationId,
      createdById: currentMembership.id,
      name: name.trim(),
      content: content.trim(),
      role: role || "SYSTEM",
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

  return NextResponse.json({ prompt }, { status: 201 });
}
