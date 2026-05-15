import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validation';
import { handleError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, name: true },
    });

    if (user) {
      console.log(
        `[forgot-password] Geração de link para ${user.email} (id ${user.id})`
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        'Se houver uma conta com esse email, enviaremos as instruções de recuperação.',
    });
  } catch (err) {
    return handleError(err);
  }
}
