import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import RegistroLayout, { parsePrefillDate } from '../../components/RegistroLayout';
import {
  useRegistrosByDateQuery,
  useUpsertRegistroMutation,
} from '../../services/queries';

const MOODS = [
  { id: 'happy', label: 'Bem', helper: 'Animada, leve', icon: 'happy-outline' },
  { id: 'calm', label: 'Calma', helper: 'Tranquila', icon: 'leaf-outline' },
  { id: 'normal', label: 'Normal', helper: 'Sem novidades', icon: 'remove-outline' },
  { id: 'anxious', label: 'Ansiosa', helper: 'Inquieta', icon: 'pulse-outline' },
  { id: 'sad', label: 'Triste', helper: 'Para baixo', icon: 'sad-outline' },
  { id: 'irritated', label: 'Irritada', helper: 'Sem paciência', icon: 'flame-outline' },
  { id: 'tired', label: 'Cansada', helper: 'Sem energia', icon: 'cloud-outline' },
  { id: 'sensitive', label: 'Sensível', helper: 'À flor da pele', icon: 'heart-outline' },
];

const ENERGY = [
  { id: 'low', label: 'Baixa' },
  { id: 'medium', label: 'Média' },
  { id: 'high', label: 'Alta' },
];

export default function RegistroHumor() {
  const params = useLocalSearchParams();
  const prefillDate = parsePrefillDate(params.date);
  const [date, setDate] = useState(prefillDate || new Date());
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [notes, setNotes] = useState('');
  const upsertMutation = useUpsertRegistroMutation();
  const registroQuery = useRegistrosByDateQuery(date);
  const prefillKeyRef = useRef(null);

  useEffect(() => {
    if (registroQuery.isLoading) return;
    const key = date.toISOString().slice(0, 10);
    if (prefillKeyRef.current === key) return;
    prefillKeyRef.current = key;
    const existing = registroQuery.data?.[0];
    setMood(existing?.mood ?? null);
    setEnergy(existing?.energy ?? null);
    setNotes(existing?.notes ?? '');
  }, [date, registroQuery.data, registroQuery.isLoading]);

  return (
    <RegistroLayout
      title="Humor"
      subtitle="Como você está se sentindo?"
      icon="happy-outline"
      iconColor="#C56682"
      iconBg="rgba(197, 102, 130, 0.18)"
      date={date}
      onDateChange={setDate}
      canSave={!!mood}
      onSave={(d) =>
        upsertMutation.mutateAsync({
          date: d,
          mood,
          energy,
          notes: notes.trim() || null,
        })
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como está seu humor?</Text>
        <View style={styles.grid}>
          {MOODS.map((m) => {
            const active = mood === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.moodCard, active && styles.moodCardActive]}
                activeOpacity={0.85}
                onPress={() => setMood(active ? null : m.id)}
              >
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={active ? '#FFFFFF' : '#C56682'}
                />
                <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>
                  {m.label}
                </Text>
                <Text
                  style={[styles.moodHelper, active && styles.moodHelperActive]}
                >
                  {m.helper}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nível de energia</Text>
        <View style={styles.row}>
          {ENERGY.map((e) => {
            const active = energy === e.id;
            return (
              <TouchableOpacity
                key={e.id}
                style={[styles.energyCard, active && styles.energyCardActive]}
                activeOpacity={0.85}
                onPress={() => setEnergy(active ? null : e.id)}
              >
                <Text
                  style={[styles.energyLabel, active && styles.energyLabelActive]}
                >
                  {e.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anotações</Text>
        <View style={styles.notesWrap}>
          <TextInput
            style={styles.notesInput}
            placeholder="O que rolou hoje? Algo te marcou?"
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  moodCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    marginTop: 2,
  },
  moodLabelActive: {
    color: '#FFFFFF',
  },
  moodHelper: {
    fontSize: 11,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  moodHelperActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  energyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  energyCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  energyLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  energyLabelActive: {
    color: '#FFFFFF',
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
