import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import RegistroLayout, { parsePrefillDate } from '../../components/RegistroLayout';
import { useCreateLembreteMutation } from '../../services/queries';

const TYPES = [
  { id: 'medication', label: 'Medicação', icon: 'medical-outline' },
  { id: 'appointment', label: 'Consulta', icon: 'calendar-outline' },
  { id: 'exam', label: 'Exame', icon: 'clipboard-outline' },
  { id: 'cycle', label: 'Ciclo', icon: 'water-outline' },
  { id: 'other', label: 'Outro', icon: 'star-outline' },
];

const REPEAT = [
  { id: 'none', label: 'Nunca' },
  { id: 'daily', label: 'Diário' },
  { id: 'weekly', label: 'Semanal' },
  { id: 'monthly', label: 'Mensal' },
];

function formatDate(date) {
  const months = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function RegistroLembrete() {
  const params = useLocalSearchParams();
  const prefill = parsePrefillDate(params.date);

  const startDate = (() => {
    if (prefill) return prefill;
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  })();

  const [type, setType] = useState('medication');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(startDate);
  const [time, setTime] = useState(startDate);
  const [showIOSDate, setShowIOSDate] = useState(false);
  const [showIOSTime, setShowIOSTime] = useState(false);
  const [repeat, setRepeat] = useState('none');
  const [notify, setNotify] = useState(true);
  const [notes, setNotes] = useState('');
  const createMutation = useCreateLembreteMutation();

  const buildDateTime = () => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        minimumDate: new Date(),
        onChange: (_, selected) => {
          if (selected) setDate(selected);
        },
      });
    } else {
      setShowIOSDate(true);
    }
  };

  const openTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: time,
        mode: 'time',
        is24Hour: true,
        onChange: (_, selected) => {
          if (selected) setTime(selected);
        },
      });
    } else {
      setShowIOSTime(true);
    }
  };

  return (
    <RegistroLayout
      title="Novo lembrete"
      subtitle="Não esqueça nada importante"
      icon="alarm-outline"
      iconColor="#E7A48C"
      iconBg="rgba(231, 164, 140, 0.22)"
      showDateCard={false}
      canSave={title.trim().length > 0}
      onSave={() =>
        createMutation.mutateAsync({
          type,
          title: title.trim(),
          datetime: buildDateTime().toISOString(),
          repeat,
          notify,
          notes: notes.trim() || null,
        })
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const active = type === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeChip, active && styles.typeChipActive]}
                activeOpacity={0.85}
                onPress={() => setType(t.id)}
              >
                <Ionicons
                  name={t.icon}
                  size={16}
                  color={active ? '#FFFFFF' : '#C56682'}
                />
                <Text
                  style={[styles.typeLabel, active && styles.typeLabelActive]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Título</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="create-outline" size={18} color="#C56682" />
          <TextInput
            style={styles.input}
            placeholder="Ex: Tomar pílula"
            placeholderTextColor="#9E9E9E"
            value={title}
            onChangeText={setTitle}
          />
        </View>
      </View>

      <View style={styles.dateTimeRow}>
        <TouchableOpacity
          style={styles.dateTimeCard}
          activeOpacity={0.85}
          onPress={openDatePicker}
        >
          <Ionicons name="calendar" size={18} color="#C43A4A" />
          <View>
            <Text style={styles.dateTimeLabel}>Data</Text>
            <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateTimeCard}
          activeOpacity={0.85}
          onPress={openTimePicker}
        >
          <Ionicons name="time" size={18} color="#C43A4A" />
          <View>
            <Text style={styles.dateTimeLabel}>Hora</Text>
            <Text style={styles.dateTimeValue}>{formatTime(time)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {showIOSDate && (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            minimumDate={new Date()}
            onChange={(_, selected) => {
              if (selected) setDate(selected);
            }}
          />
          <TouchableOpacity
            style={styles.iosPickerDone}
            onPress={() => setShowIOSDate(false)}
          >
            <Text style={styles.iosPickerDoneText}>Pronto</Text>
          </TouchableOpacity>
        </View>
      )}

      {showIOSTime && (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={(_, selected) => {
              if (selected) setTime(selected);
            }}
          />
          <TouchableOpacity
            style={styles.iosPickerDone}
            onPress={() => setShowIOSTime(false)}
          >
            <Text style={styles.iosPickerDoneText}>Pronto</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repetir</Text>
        <View style={styles.row}>
          {REPEAT.map((r) => {
            const active = repeat === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.pill, active && styles.pillActive]}
                activeOpacity={0.85}
                onPress={() => setRepeat(r.id)}
              >
                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.toggleCard}>
        <View style={styles.toggleInfo}>
          <Ionicons name="notifications-outline" size={20} color="#C56682" />
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Receber notificação</Text>
            <Text style={styles.toggleHelper}>
              Te avisamos na hora certa
            </Text>
          </View>
        </View>
        <Switch
          value={notify}
          onValueChange={setNotify}
          trackColor={{ false: '#E0BFC8', true: '#C56682' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anotações</Text>
        <View style={styles.notesWrap}>
          <TextInput
            style={styles.notesInput}
            placeholder="Detalhes do lembrete..."
            placeholderTextColor="#9E9E9E"
            multiline
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>
      </View>
    </RegistroLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  typeChipActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  typeLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  typeLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#1F1F1F',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  dateTimeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  dateTimeLabel: {
    fontSize: 10,
    color: '#9E9E9E',
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dateTimeValue: {
    fontSize: 14,
    color: '#1F1F1F',
    fontWeight: '700',
    marginTop: 1,
  },
  iosPicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    paddingBottom: 8,
  },
  iosPickerDone: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  iosPickerDoneText: {
    color: '#C56682',
    fontSize: 15,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  pillActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  pillLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  pillLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  toggleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleTitle: {
    fontSize: 14,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  toggleHelper: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 1,
  },
  notesWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
    padding: 14,
  },
  notesInput: {
    fontSize: 14,
    color: '#1F1F1F',
    minHeight: 80,
  },
});
