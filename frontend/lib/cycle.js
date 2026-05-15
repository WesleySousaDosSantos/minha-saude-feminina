const MONTHS_LONG = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function getInitials(name) {
  if (!name) return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function parseISODate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function dayOfCycle(lastPeriodStart, cycleDuration, today = new Date()) {
  const start = parseISODate(lastPeriodStart);
  if (!start || !cycleDuration) return null;
  const ms = today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  return (days % cycleDuration) + 1;
}

export function formatStartDate(value) {
  const d = parseISODate(value);
  if (!d) return '—';
  return `${d.getDate()} de ${MONTHS_LONG[d.getMonth()]}`;
}
