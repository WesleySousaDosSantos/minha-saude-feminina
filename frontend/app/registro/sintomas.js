import { useState } from 'react';
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

const SYMPTOMS = [
  { id: 'headache', label: 'Dor de cabeça', icon: 'medkit-outline' },
  { id: 'backpain', label: 'Dor nas costas', icon: 'body-outline' },
  { id: 'bloating', label: 'Inchaço', icon: 'ellipse-outline' },
  { id: 'acne', label: 'Acne', icon: 'sparkles-outline' },
  { id: 'breast', label: 'Seios sensíveis', icon: 'heart-outline' },
  { id: 'fatigue', label: 'Fadiga', icon: 'battery-dead-outline' },
  { id: 'nausea', label: 'Náusea', icon: 'sad-outline' },
  { id: 'insomnia', label: 'Insônia', icon: 'moon-outline' },
  { id: 'cravings', label: 'Compulsão por doce', icon: 'ice-cream-outline' },
  { id: 'mood', label: 'Mudanças de humor', icon: 'happy-outline' },
];

export default function RegistroSintomas() {
  const params = useLocalSearchParams();
  const prefillDate = parsePrefillDate(params.date);
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState('');

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <RegistroLayout
      title="Sintomas"
      subtitle="Marque o que você sentiu"
      icon="medkit"
      iconColor="#C56682"
      iconBg="rgba(197, 102, 130, 0.18)"
      prefillDate={prefillDate}
      canSave={selected.length > 0}
      onSave={() => {}}
    >
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Selecione um ou mais</Text>
          {selected.length > 0 && (
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{selected.length}</Text>
            </View>
          )}
        </View>
        <View style={styles.grid}>
          {SYMPTOMS.map((s) => {
            const active = selected.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.85}
                onPress={() => toggle(s.id)}
              >
                <Ionicons
                  name={s.icon}
                  size={16}
                  color={active ? '#FFFFFF' : '#C56682'}
                />
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitleAlone}>Anotações</Text>
        <View style={styles.notesWrap}>
          <TextInput
            style={styles.notesInput}
            placeholder="Algum outro desconforto?"
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  sectionTitleAlone: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 12,
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
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
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
  chipActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  chipLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  chipLabelActive: {
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
    minHeight: 80,
  },
});
