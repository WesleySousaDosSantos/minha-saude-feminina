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

const INTENSITY = [
  { id: 'mild', label: 'Leve', helper: 'Quase imperceptível', dots: 1 },
  { id: 'moderate', label: 'Moderada', helper: 'Incomoda mas dá pra ignorar', dots: 2 },
  { id: 'strong', label: 'Forte', helper: 'Difícil de ignorar', dots: 3 },
  { id: 'severe', label: 'Muito forte', helper: 'Atrapalha o dia', dots: 4 },
];

const LOCATIONS = [
  { id: 'lowerBelly', label: 'Baixo ventre', icon: 'ellipse-outline' },
  { id: 'lowerBack', label: 'Lombar', icon: 'body-outline' },
  { id: 'legs', label: 'Pernas', icon: 'walk-outline' },
  { id: 'whole', label: 'Geral', icon: 'flash-outline' },
];

const DURATION = [
  { id: 'minutes', label: 'Alguns minutos' },
  { id: 'hours', label: 'Algumas horas' },
  { id: 'day', label: 'O dia todo' },
  { id: 'days', label: 'Vários dias' },
];

export default function RegistroColica() {
  const params = useLocalSearchParams();
  const prefillDate = parsePrefillDate(params.date);
  const [intensity, setIntensity] = useState(null);
  const [locations, setLocations] = useState([]);
  const [duration, setDuration] = useState(null);
  const [notes, setNotes] = useState('');

  const toggleLocation = (id) => {
    setLocations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <RegistroLayout
      title="Cólica"
      subtitle="Conta pra gente onde tá doendo"
      icon="flash"
      iconColor="#C43A4A"
      iconBg="#FBD9E5"
      prefillDate={prefillDate}
      canSave={!!intensity}
      onSave={() => {}}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intensidade</Text>
        <View style={styles.intensityList}>
          {INTENSITY.map((i) => {
            const active = intensity === i.id;
            return (
              <TouchableOpacity
                key={i.id}
                style={[styles.intensityCard, active && styles.intensityCardActive]}
                activeOpacity={0.85}
                onPress={() => setIntensity(active ? null : i.id)}
              >
                <View style={styles.intensityHeader}>
                  <Text
                    style={[
                      styles.intensityLabel,
                      active && styles.intensityLabelActive,
                    ]}
                  >
                    {i.label}
                  </Text>
                  <View style={styles.dotsWrap}>
                    {[1, 2, 3, 4].map((n) => (
                      <View
                        key={n}
                        style={[
                          styles.dot,
                          n <= i.dots && {
                            backgroundColor: active ? '#FFFFFF' : '#C43A4A',
                          },
                          n > i.dots && {
                            backgroundColor: active
                              ? 'rgba(255, 255, 255, 0.35)'
                              : 'rgba(196, 58, 74, 0.2)',
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <Text
                  style={[
                    styles.intensityHelper,
                    active && styles.intensityHelperActive,
                  ]}
                >
                  {i.helper}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Onde dói?</Text>
        <View style={styles.locationGrid}>
          {LOCATIONS.map((l) => {
            const active = locations.includes(l.id);
            return (
              <TouchableOpacity
                key={l.id}
                style={[styles.locationCard, active && styles.locationCardActive]}
                activeOpacity={0.85}
                onPress={() => toggleLocation(l.id)}
              >
                <Ionicons
                  name={l.icon}
                  size={20}
                  color={active ? '#FFFFFF' : '#C56682'}
                />
                <Text
                  style={[
                    styles.locationLabel,
                    active && styles.locationLabelActive,
                  ]}
                >
                  {l.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Há quanto tempo?</Text>
        <View style={styles.row}>
          {DURATION.map((d) => {
            const active = duration === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.pill, active && styles.pillActive]}
                activeOpacity={0.85}
                onPress={() => setDuration(active ? null : d.id)}
              >
                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                  {d.label}
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
            placeholder="Tomou algum remédio? Algo aliviou?"
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
  intensityList: {
    gap: 8,
  },
  intensityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  intensityCardActive: {
    backgroundColor: '#C43A4A',
    borderColor: '#C43A4A',
    shadowColor: '#C43A4A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  intensityLabelActive: {
    color: '#FFFFFF',
  },
  intensityHelper: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  intensityHelperActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  dotsWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  locationCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  locationLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  locationLabelActive: {
    color: '#FFFFFF',
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
