import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Email inválido');

export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha muito longa');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto').max(120),
  email: emailSchema,
  password: passwordSchema,
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: 'É preciso aceitar os termos para continuar',
  }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(30).optional().nullable().or(z.literal('')),
  birthDate: z.string().optional().nullable(),
  avatar: z.string().max(4000000).optional().nullable(),
});

export const cycleSchema = z.object({
  lastPeriodStart: z.string(),
  cycleDuration: z.number().int().min(21).max(40),
  periodDuration: z.number().int().min(2).max(10),
});

const FLOWS = ['spotting', 'light', 'medium', 'heavy'] as const;
const MOODS = [
  'happy',
  'calm',
  'normal',
  'anxious',
  'sad',
  'irritated',
  'tired',
  'sensitive',
] as const;
const ENERGY = ['low', 'medium', 'high'] as const;
const SYMPTOMS = [
  'headache',
  'backpain',
  'bloating',
  'acne',
  'breast',
  'fatigue',
  'nausea',
  'insomnia',
  'cravings',
  'mood',
  'cramps',
] as const;
const CRAMP_INTENSITY = ['mild', 'moderate', 'strong', 'severe'] as const;
const CRAMP_LOCATIONS = ['lowerBelly', 'lowerBack', 'legs', 'whole'] as const;
const CRAMP_DURATION = ['minutes', 'hours', 'day', 'days'] as const;
const DISCHARGE_COLOR = ['clear', 'white', 'yellow', 'brown', 'pink'] as const;
const DISCHARGE_TEXTURE = ['watery', 'creamy', 'stretchy', 'thick'] as const;
const DISCHARGE_VOLUME = ['low', 'medium', 'high'] as const;

export const registroSchema = z.object({
  date: z.string(),
  flow: z.enum(FLOWS).nullable().optional(),
  mood: z.enum(MOODS).nullable().optional(),
  energy: z.enum(ENERGY).nullable().optional(),
  symptoms: z.array(z.enum(SYMPTOMS)).optional(),
  crampIntensity: z.enum(CRAMP_INTENSITY).nullable().optional(),
  crampLocations: z.array(z.enum(CRAMP_LOCATIONS)).optional(),
  crampDuration: z.enum(CRAMP_DURATION).nullable().optional(),
  dischargeColor: z.enum(DISCHARGE_COLOR).nullable().optional(),
  dischargeTexture: z.enum(DISCHARGE_TEXTURE).nullable().optional(),
  dischargeVolume: z.enum(DISCHARGE_VOLUME).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const registroUpdateSchema = registroSchema.partial();

const LEMBRETE_TYPES = ['medication', 'appointment', 'exam', 'cycle', 'other'] as const;
const LEMBRETE_REPEAT = ['none', 'daily', 'weekly', 'monthly'] as const;

export const lembreteSchema = z.object({
  type: z.enum(LEMBRETE_TYPES).default('other'),
  title: z.string().trim().min(1, 'Título obrigatório').max(200),
  datetime: z.string(),
  repeat: z.enum(LEMBRETE_REPEAT).default('none'),
  notify: z.boolean().default(true),
  notes: z.string().max(2000).nullable().optional(),
});

export const lembreteUpdateSchema = lembreteSchema.partial().extend({
  completed: z.boolean().optional(),
});

export function parseDateOnly(input: string): Date {
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    throw new Error('Data inválida');
  }
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export function parseDateTime(input: string): Date {
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    throw new Error('Data/hora inválida');
  }
  return d;
}
