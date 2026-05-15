import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { registroUpdateSchema, parseDateOnly } from '@/lib/validation';
import { handleError, jsonError } from '@/lib/errors';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser(request);
    const { id } = await params;

    const registro = await prisma.registro.findFirst({
      where: { id, userId: user.id },
    });

    if (!registro) {
      return jsonError('Registro não encontrado', 404);
    }

    return NextResponse.json({ registro });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    const body = await request.json();
    const data = registroUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.date) updateData.date = parseDateOnly(data.date);
    if ('flow' in data) updateData.flow = data.flow ?? null;
    if ('mood' in data) updateData.mood = data.mood ?? null;
    if ('energy' in data) updateData.energy = data.energy ?? null;
    if ('symptoms' in data) updateData.symptoms = data.symptoms ?? [];
    if ('crampIntensity' in data) updateData.crampIntensity = data.crampIntensity ?? null;
    if ('crampLocations' in data) updateData.crampLocations = data.crampLocations ?? [];
    if ('crampDuration' in data) updateData.crampDuration = data.crampDuration ?? null;
    if ('dischargeColor' in data) updateData.dischargeColor = data.dischargeColor ?? null;
    if ('dischargeTexture' in data) updateData.dischargeTexture = data.dischargeTexture ?? null;
    if ('dischargeVolume' in data) updateData.dischargeVolume = data.dischargeVolume ?? null;
    if ('notes' in data) updateData.notes = data.notes ?? null;

    const existing = await prisma.registro.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return jsonError('Registro não encontrado', 404);
    }

    const updated = await prisma.registro.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ registro: updated });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return jsonError('Registro não encontrado', 404);
    }
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const user = await requireUser(request);
    const { id } = await params;

    const existing = await prisma.registro.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return jsonError('Registro não encontrado', 404);
    }

    await prisma.registro.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
