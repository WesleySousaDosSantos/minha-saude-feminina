import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { registroSchema, parseDateOnly } from '@/lib/validation';
import { handleError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const { searchParams } = new URL(request.url);

    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');

    const where: { userId: string; date?: { gte?: Date; lte?: Date } } = {
      userId: user.id,
    };

    if (fromStr || toStr) {
      where.date = {};
      if (fromStr) where.date.gte = parseDateOnly(fromStr);
      if (toStr) where.date.lte = parseDateOnly(toStr);
    }

    const registros = await prisma.registro.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ registros });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const data = registroSchema.parse(body);

    const date = parseDateOnly(data.date);

    const registro = await prisma.registro.upsert({
      where: {
        userId_date: { userId: user.id, date },
      },
      create: {
        userId: user.id,
        date,
        flow: data.flow ?? null,
        mood: data.mood ?? null,
        energy: data.energy ?? null,
        symptoms: data.symptoms ?? [],
        crampIntensity: data.crampIntensity ?? null,
        crampLocations: data.crampLocations ?? [],
        crampDuration: data.crampDuration ?? null,
        dischargeColor: data.dischargeColor ?? null,
        dischargeTexture: data.dischargeTexture ?? null,
        dischargeVolume: data.dischargeVolume ?? null,
        notes: data.notes ?? null,
      },
      update: {
        flow: data.flow ?? null,
        mood: data.mood ?? null,
        energy: data.energy ?? null,
        symptoms: data.symptoms ?? [],
        crampIntensity: data.crampIntensity ?? null,
        crampLocations: data.crampLocations ?? [],
        crampDuration: data.crampDuration ?? null,
        dischargeColor: data.dischargeColor ?? null,
        dischargeTexture: data.dischargeTexture ?? null,
        dischargeVolume: data.dischargeVolume ?? null,
        notes: data.notes ?? null,
      },
    });

    return NextResponse.json({ registro }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
