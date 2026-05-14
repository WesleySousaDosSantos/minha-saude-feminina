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

const FLOW_OPTIONS = [
  { id: 'spotting', label: 'Spotting', helper: 'Apenas borra', icon: 'ellipse-outline' },
  { id: 'light', label: 'Leve', helper: 'Pouco fluxo', icon: 'water-outline' },
  { id: 'medium', label: 'Médio', helper: 'Fluxo normal', icon: 'water' },
  { id: 'heavy', label: 'Intenso', helper: 'Muito fluxo', icon: 'water' },
];

export default function RegistroMenstruacao() {
  const params = useLocalSearchParams();
  const prefillDate = parsePrefillDate(params.date);
  const [flow, setFlow] = useState(null);
  const [notes, setNotes] = useState('');

  return (
    <RegistroLayout
      title="Menstruação"
      subtitle="Como está seu fluxo hoje?"
      icon="water"
      iconColor="#C43A4A"
      iconBg="#FBD9E5"
      prefillDate={prefillDate}
      canSave={!!flow}
      onSave={() => {}}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intensidade</Text>
        <View style={styles.flowGrid}>
          {FLOW_OPTIONS.map((opt) => {
            const active = flow === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.flowCard, active && styles.flowCardActive]}
                activeOpacity={0.85}
                onPress={() => setFlow(active ? null : opt.id)}
              >
                <Ionicons
                  name={opt.icon}
                  size={24}
                  color={active ? '#FFFFFF' : '#C43A4A'}
                />
                <Text
                  style={[styles.flowLabel, active && styles.flowLabelActive]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[styles.flowHelper, active && styles.flowHelperActive]}
                >
                  {opt.helper}
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
            placeholder="Cor, presença de coágulos, observações..."
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
  flowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  flowCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  flowCardActive: {
    backgroundColor: '#C43A4A',
    borderColor: '#C43A4A',
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  flowLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    marginTop: 2,
  },
  flowLabelActive: {
    color: '#FFFFFF',
  },
  flowHelper: {
    fontSize: 11,
    color: '#6B6B6B',
  },
  flowHelperActive: {
    color: 'rgba(255, 255, 255, 0.85)',
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
