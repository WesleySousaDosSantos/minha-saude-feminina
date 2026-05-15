import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, hashPassword } from '@/lib/auth';
import { updateProfileSchema, parseDateOnly } from '@/lib/validation';
import { handleError } from '@/lib/errors';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    return NextResponse.json({ user });
  } catch (err) {
    return handleError(err);
  }
}

const patchSchema = updateProfileSchema.extend({
  password: z.string().min(6).max(100).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const data = patchSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) {
      updateData.phone = data.phone === '' ? null : data.phone;
    }
    if (data.birthDate !== undefined) {
      updateData.birthDate = data.birthDate ? parseDateOnly(data.birthDate) : null;
    }
    if (data.avatar !== undefined) {
      updateData.avatar = data.avatar === '' ? null : data.avatar;
    }
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        birthDate: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
