import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

const REPEAT_FREQUENCY = {
  daily: Calendar.Frequency?.DAILY,
  weekly: Calendar.Frequency?.WEEKLY,
  monthly: Calendar.Frequency?.MONTHLY,
};

export async function ensureCalendarPermission() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (Platform.OS === 'ios') {
    try {
      await Calendar.requestRemindersPermissionsAsync();
    } catch {}
  }
  return status === 'granted';
}

async function pickWritableCalendarId() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const editable = calendars.filter((c) => c.allowsModifications);
  if (editable.length === 0) return null;

  if (Platform.OS === 'ios') {
    const primary =
      editable.find((c) => c.source?.name === 'iCloud') ||
      editable.find((c) => c.source?.name === 'Default') ||
      editable[0];
    return primary?.id ?? null;
  }
  const primary =
    editable.find((c) => c.isPrimary) ||
    editable.find((c) => c.accessLevel === 'owner') ||
    editable[0];
  return primary?.id ?? null;
}

export async function addLembreteToCalendar({
  title,
  datetime,
  repeat,
  notify,
  notes,
}) {
  const granted = await ensureCalendarPermission();
  if (!granted) {
    throw new Error('Permissão de calendário negada');
  }

  const calendarId = await pickWritableCalendarId();
  if (!calendarId) {
    throw new Error('Nenhum calendário disponível no dispositivo');
  }

  const start = new Date(datetime);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  const event = {
    title,
    startDate: start,
    endDate: end,
    notes: notes || undefined,
    alarms: notify ? [{ relativeOffset: 0 }] : [],
  };

  const frequency = REPEAT_FREQUENCY[repeat];
  if (frequency) {
    event.recurrenceRule = { frequency };
  }

  const eventId = await Calendar.createEventAsync(calendarId, event);
  return eventId;
}
