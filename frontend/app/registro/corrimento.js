import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RegistroLayout, { parsePrefillDate } from '../../components/RegistroLayout';

const COLORS = [
  { id: 'clear', label: 'Transparente', swatch: '#FBF4EB' },
  { id: 'white', label: 'Branco', swatch: '#FFFFFF' },
  { id: 'yellow', label: 'Amarelado', swatch: '#E7D4B0' },
  { id: 'brown', label: 'Acastanhado', swatch: '#C9A48C' },
  { id: 'pink', label: 'Rosado', swatch: '#FBD9E5' },
];

const TEXTURES = [
  { id: 'watery', label: 'Aguado' },
  { id: 'creamy', label: 'Cremoso' },
  { id: 'stretchy', label: 'Elástico' },
  { id: 'thick', label: 'Espesso' },
];

const VOLUMES = [
  { id: 'low', label: 'Pouco' },
  { id: 'medium', label: 'Médio' },
  { id: 'high', label: 'Bastante' },
];

export default function RegistroCorrimento() {
  const params = useLocalSearchParams();
  const prefillDate = parsePrefillDate(params.date);
  const [color, setColor] = useState(null);
  const [texture, setTexture] = useState(null);
  const [volume, setVolume] = useState(null);
  const [notes, setNotes] = useState('');

  return (
    <RegistroLayout
      title="Corrimento"
      subtitle="Observar mudanças ajuda a entender seu ciclo"
      icon="water-outline"
      iconColor="#E7A48C"
      iconBg="rgba(231, 164, 140, 0.22)"
      prefillDate={prefillDate}
      canSave={!!color || !!texture || !!volume}
      onSave={() => {}}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cor</Text>
        <View style={styles.colorGrid}>
          {COLORS.map((c) => {
            const active = color === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.colorCard, active && styles.colorCardActive]}
                activeOpacity={0.85}
                onPress={() => setColor(active ? null : c.id)}
              >
                <View style={[styles.colorSwatch, { backgroundColor: c.swatch }]} />
                <Text
                  style={[styles.colorLabel, active && styles.colorLabelActive]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Textura</Text>
        <View style={styles.row}>
          {TEXTURES.map((t) => {
            const active = texture === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.pill, active && styles.pillActive]}
                activeOpacity={0.85}
                onPress={() => setTexture(active ? null : t.id)}
              >
                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantidade</Text>
        <View style={styles.row}>
          {VOLUMES.map((v) => {
            const active = volume === v.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[styles.volumeCard, active && styles.volumeCardActive]}
                activeOpacity={0.85}
                onPress={() => setVolume(active ? null : v.id)}
              >
                <Text
                  style={[styles.volumeLabel, active && styles.volumeLabelActive]}
                >
                  {v.label}
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
            placeholder="Cheiro forte, coceira, ardência..."
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  colorCardActive: {
    borderColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(31, 31, 31, 0.12)',
  },
  colorLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  colorLabelActive: {
    color: '#C56682',
    fontWeight: '800',
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
  volumeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  volumeCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  volumeLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  volumeLabelActive: {
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
