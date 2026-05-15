import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
  return parts[1] || null;
}

export async function requireUser(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('UNAUTHORIZED');
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
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
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}
