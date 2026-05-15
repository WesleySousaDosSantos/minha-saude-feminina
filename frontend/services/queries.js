import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { authService } from './auth';
import { cycleService } from './cycle';
import { registrosService, toDateOnly } from './registros';
import { lembretesService } from './lembretes';

export const queryKeys = {
  me: ['auth', 'me'],
  cycle: ['cycle'],
  registros: (range) => ['registros', range || {}],
  registro: (id) => ['registros', 'item', id],
  registroByDate: (date) => ['registros', 'date', toDateOnly(date)],
  lembretes: (filter) => ['lembretes', filter || {}],
};

export function useMeQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => authService.me().then((r) => r.user),
    ...options,
  });
}

export function useUpdateMeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      authService.updateMe(payload).then((r) => r.user),
    onSuccess: (user) => {
      qc.setQueryData(queryKeys.me, user);
    },
  });
}

export function useDeleteMeMutation() {
  return useMutation({ mutationFn: () => authService.deleteMe() });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });
}

export function useCycleQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.cycle,
    queryFn: () => cycleService.get().then((r) => r.cycle),
    ...options,
  });
}

export function useUpsertCycleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      cycleService.upsert(payload).then((r) => r.cycle),
    onSuccess: (cycle) => {
      qc.setQueryData(queryKeys.cycle, cycle);
    },
  });
}

export function useRegistrosQuery(range, options = {}) {
  return useQuery({
    queryKey: queryKeys.registros(range),
    queryFn: () => registrosService.list(range).then((r) => r.registros),
    ...options,
  });
}

export function useRegistrosByDateQuery(date, options = {}) {
  return useQuery({
    queryKey: queryKeys.registroByDate(date),
    queryFn: () => registrosService.byDate(date).then((r) => r.registros),
    enabled: !!date,
    ...options,
  });
}

export function useUpsertRegistroMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      registrosService.upsert(payload).then((r) => r.registro),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registros'] });
    },
  });
}

export function useUpdateRegistroMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      registrosService.update(id, payload).then((r) => r.registro),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registros'] });
    },
  });
}

export function useDeleteRegistroMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => registrosService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registros'] });
    },
  });
}

export function useLembretesQuery(filter, options = {}) {
  return useQuery({
    queryKey: queryKeys.lembretes(filter),
    queryFn: () => lembretesService.list(filter).then((r) => r.lembretes),
    ...options,
  });
}

export function useCreateLembreteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      lembretesService.create(payload).then((r) => r.lembrete),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lembretes'] });
    },
  });
}

export function useUpdateLembreteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      lembretesService.update(id, payload).then((r) => r.lembrete),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lembretes'] });
    },
  });
}

export function useDeleteLembreteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => lembretesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lembretes'] });
    },
  });
}
