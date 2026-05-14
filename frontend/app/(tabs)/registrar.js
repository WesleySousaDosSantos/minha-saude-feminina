import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

const FLOW_OPTIONS = [
  { id: 'none', label: 'Nenhum', icon: 'remove-circle-outline' },
  { id: 'light', label: 'Leve', icon: 'water-outline' },
  { id: 'medium', label: 'Médio', icon: 'water' },
  { id: 'heavy', label: 'Intenso', icon: 'water' },
];

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Bem', icon: 'happy-outline' },
  { id: 'normal', label: 'Normal', icon: 'remove-outline' },
  { id: 'sad', label: 'Triste', icon: 'sad-outline' },
  { id: 'tired', label: 'Cansada', icon: 'cloud-outline' },
];

const SYMPTOMS = [
  { id: 'cramps', label: 'Cólica', icon: 'flash-outline' },
  { id: 'headache', label: 'Dor de cabeça', icon: 'medkit-outline' },
  { id: 'backpain', label: 'Dor nas costas', icon: 'body-outline' },
  { id: 'bloating', label: 'Inchaço', icon: 'ellipse-outline' },
  { id: 'acne', label: 'Acne', icon: 'sparkles-outline' },
  { id: 'breast', label: 'Seios sensíveis', icon: 'heart-outline' },
  { id: 'fatigue', label: 'Fadiga', icon: 'battery-dead-outline' },
  { id: 'nausea', label: 'Náusea', icon: 'sad-outline' },
];

function formatDate(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(date, today)) return 'Hoje';
  if (sameDay(date, yesterday)) return 'Ontem';

  const days = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];
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
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
}

export default function Registrar() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [flow, setFlow] = useState(null);
  const [mood, setMood] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/hoje');
  };

  const toggleSymptom = (id) => {
    setSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        maximumDate: new Date(),
        onChange: (_, selected) => {
          if (selected) setDate(selected);
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const handleSave = () => {
    Alert.alert(
      'Registro salvo',
      'Suas informações foram salvas com sucesso.',
      [{ text: 'OK' }]
    );
    setFlow(null);
    setMood(null);
    setSymptoms([]);
    setNotes('');
  };

  const hasData = flow || mood || symptoms.length > 0 || notes.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Como você está hoje?</Text>
          <Text style={styles.headerSubtitle}>
            Registre o que sentiu para acompanhar seu ciclo
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.dateCard}
          activeOpacity={0.85}
          onPress={openDatePicker}
        >
          <View style={styles.dateIcon}>
            <Ionicons name="calendar" size={20} color="#C43A4A" />
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Data do registro</Text>
            <Text style={styles.dateValue}>{formatDate(date)}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
        </TouchableOpacity>

        {showIOSPicker && (
          <View style={styles.iosPicker}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_, selected) => {
                if (selected) setDate(selected);
              }}
            />
            <TouchableOpacity
              style={styles.iosPickerDone}
              onPress={() => setShowIOSPicker(false)}
            >
              <Text style={styles.iosPickerDoneText}>Pronto</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: '#C43A4A' }]} />
            <Text style={styles.sectionTitle}>Fluxo menstrual</Text>
          </View>
          <View style={styles.optionsRow}>
            {FLOW_OPTIONS.map((opt) => {
              const active = flow === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                  activeOpacity={0.85}
                  onPress={() => setFlow(active ? null : opt.id)}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={active ? '#FFFFFF' : '#C56682'}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      active && styles.optionLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: '#C56682' }]} />
            <Text style={styles.sectionTitle}>Como está seu humor?</Text>
          </View>
          <View style={styles.optionsRow}>
            {MOOD_OPTIONS.map((opt) => {
              const active = mood === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                  activeOpacity={0.85}
                  onPress={() => setMood(active ? null : opt.id)}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={active ? '#FFFFFF' : '#C56682'}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      active && styles.optionLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: '#E7A48C' }]} />
            <Text style={styles.sectionTitle}>Sintomas</Text>
            {symptoms.length > 0 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{symptoms.length}</Text>
              </View>
            )}
          </View>
          <View style={styles.symptomsGrid}>
            {SYMPTOMS.map((s) => {
              const active = symptoms.includes(s.id);
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.symptomChip,
                    active && styles.symptomChipActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => toggleSymptom(s.id)}
                >
                  <Ionicons
                    name={s.icon}
                    size={16}
                    color={active ? '#FFFFFF' : '#C56682'}
                  />
                  <Text
                    style={[
                      styles.symptomLabel,
                      active && styles.symptomLabelActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: '#C56682' }]} />
            <Text style={styles.sectionTitle}>Anotações</Text>
          </View>
          <View style={styles.notesWrap}>
            <TextInput
              style={styles.notesInput}
              placeholder="Como foi seu dia? Algum desconforto?"
              placeholderTextColor="#9E9E9E"
              multiline
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !hasData && styles.saveButtonDisabled]}
          activeOpacity={0.85}
          disabled={!hasData}
          onPress={handleSave}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Salvar registro</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Suas informações são confidenciais e usadas apenas para o seu
          acompanhamento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBF4EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 15,
    color: '#1F1F1F',
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'capitalize',
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
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  counterBadge: {
    backgroundColor: '#C56682',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  optionCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  optionLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
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
  symptomChipActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  symptomLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  symptomLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    minHeight: 90,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C43A4A',
    height: 56,
    borderRadius: 14,
    marginTop: 28,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#E0BFC8',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  disclaimer: {
    fontSize: 11,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 16,
  },
});
