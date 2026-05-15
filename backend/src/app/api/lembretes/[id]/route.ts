import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { lembreteUpdateSchema, parseDateTime } from '@/lib/validation';
import { handleError, jsonError } from '@/lib/errors';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser(request);
    const { id } = await params;

    const lembrete = await prisma.lembrete.findFirst({
      where: { id, userId: user.id },
    });

    if (!lembrete) {
      return jsonError('Lembrete não encontrado', 404);
    }

    return NextResponse.json({ lembrete });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    const body = await request.json();
    const data = lembreteUpdateSchema.parse(body);

    const existing = await prisma.lembrete.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return jsonError('Lembrete não encontrado', 404);
    }

    const updateData: Record<string, unknown> = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.datetime !== undefined)
      updateData.datetime = parseDateTime(data.datetime);
    if (data.repeat !== undefined) updateData.repeat = data.repeat;
    if (data.notify !== undefined) updateData.notify = data.notify;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if ('notes' in data) updateData.notes = data.notes ?? null;

    const updated = await prisma.lembrete.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ lembrete: updated });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return jsonError('Lembrete não encontrado', 404);
    }
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser(request);
    const { id } = await params;

    const existing = await prisma.lembrete.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return jsonError('Lembrete não encontrado', 404);
    }

    await prisma.lembrete.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
