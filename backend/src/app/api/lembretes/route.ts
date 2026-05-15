import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { lembreteSchema, parseDateTime } from '@/lib/validation';
import { handleError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const { searchParams } = new URL(request.url);
    const completedParam = searchParams.get('completed');

    const where: { userId: string; completed?: boolean } = { userId: user.id };
    if (completedParam === 'true') where.completed = true;
    if (completedParam === 'false') where.completed = false;

    const lembretes = await prisma.lembrete.findMany({
      where,
      orderBy: { datetime: 'asc' },
    });

    return NextResponse.json({ lembretes });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const data = lembreteSchema.parse(body);

    const lembrete = await prisma.lembrete.create({
      data: {
        userId: user.id,
        type: data.type,
        title: data.title,
        datetime: parseDateTime(data.datetime),
        repeat: data.repeat,
        notify: data.notify,
        notes: data.notes ?? null,
      },
    });

    return NextResponse.json({ lembrete }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
