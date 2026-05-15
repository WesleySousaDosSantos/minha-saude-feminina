import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { cycleSchema, parseDateOnly } from '@/lib/validation';
import { handleError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const cycle = await prisma.cycleSettings.findUnique({
      where: { userId: user.id },
    });
    return NextResponse.json({ cycle });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const data = cycleSchema.parse(body);

    const lastPeriodStart = parseDateOnly(data.lastPeriodStart);

    const cycle = await prisma.cycleSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        lastPeriodStart,
        cycleDuration: data.cycleDuration,
        periodDuration: data.periodDuration,
      },
      update: {
        lastPeriodStart,
        cycleDuration: data.cycleDuration,
        periodDuration: data.periodDuration,
      },
    });

    return NextResponse.json({ cycle });
  } catch (err) {
    return handleError(err);
  }
}
