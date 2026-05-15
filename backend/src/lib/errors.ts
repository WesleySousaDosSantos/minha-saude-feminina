import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError('Dados inválidos', 400, err.flatten());
  }
  if (err instanceof Error && err.message === 'UNAUTHORIZED') {
    return jsonError('Não autenticada', 401);
  }
  if (err instanceof Error && err.message === 'FORBIDDEN') {
    return jsonError('Acesso negado', 403);
  }
  if (err instanceof Error && err.message === 'NOT_FOUND') {
    return jsonError('Não encontrado', 404);
  }
  if (err instanceof Error && err.message === 'CONFLICT') {
    return jsonError('Conflito de dados', 409);
  }
  console.error('Unexpected error:', err);
  return jsonError('Erro interno do servidor', 500);
}
