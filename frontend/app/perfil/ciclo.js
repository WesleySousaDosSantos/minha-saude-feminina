import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {
  useCycleQuery,
  useUpsertCycleMutation,
} from '../../services/queries';
import { parseISODate } from '../../lib/cycle';

const FALLBACK_LAST = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 13);
  d.setHours(0, 0, 0, 0);
  return d;
})();

const MIN_DURATION = 21;
const MAX_DURATION = 40;
const MIN_PERIOD = 2;
const MAX_PERIOD = 10;

function formatLastPeriod(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));

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
  const label = `${date.getDate()} de ${months[date.getMonth()]}`;

  if (diff === 0) return `${label} (hoje)`;
  if (diff === 1) return `${label} (ontem)`;
  return `${label} (há ${diff} dias)`;
}

export default function EditarCiclo() {
  const router = useRouter();
  const cycleQuery = useCycleQuery();
  const upsertMutation = useUpsertCycleMutation();

  const initial = useMemo(() => {
    const c = cycleQuery.data;
    return {
      lastPeriod: parseISODate(c?.lastPeriodStart) || FALLBACK_LAST,
      duration: c?.cycleDuration ?? 28,
      periodDuration: c?.periodDuration ?? 5,
    };
  }, [cycleQuery.data]);

  const [lastPeriod, setLastPeriod] = useState(initial.lastPeriod);
  const [duration, setDuration] = useState(initial.duration);
  const [periodDuration, setPeriodDuration] = useState(initial.periodDuration);
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  useEffect(() => {
    setLastPeriod(initial.lastPeriod);
    setDuration(initial.duration);
    setPeriodDuration(initial.periodDuration);
  }, [initial]);

  const dirty =
    lastPeriod.getTime() !== initial.lastPeriod.getTime() ||
    duration !== initial.duration ||
    periodDuration !== initial.periodDuration;

  const ovulationDay = duration - 14;
  const nextPeriodEstimate = (() => {
    const d = new Date(lastPeriod);
    d.setDate(d.getDate() + duration);
    return d;
  })();

  const goBack = () => {
    if (dirty) {
      Alert.alert(
        'Sair sem salvar?',
        'Você tem alterações que ainda não foram salvas.',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: lastPeriod,
        mode: 'date',
        maximumDate: new Date(),
        onChange: (_, selected) => {
          if (selected) {
            const startOfDay = new Date(selected);
            startOfDay.setHours(0, 0, 0, 0);
            setLastPeriod(startOfDay);
          }
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const handleSave = () => {
    if (!dirty || upsertMutation.isPending) return;
    const payload = {
      lastPeriodStart: lastPeriod.toISOString(),
      cycleDuration: duration,
      periodDuration,
    };
    upsertMutation.mutate(payload, {
      onSuccess: () =>
        Alert.alert(
          'Ciclo atualizado',
          'As previsões do seu calendário foram recalculadas.',
          [{ text: 'OK', onPress: () => router.back() }]
        ),
      onError: (err) =>
        Alert.alert(
          'Não foi possível salvar',
          err?.message || 'Tente novamente.'
        ),
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerBg} />
      <View style={[styles.blob, styles.blobTop]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconButton} onPress={goBack} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar ciclo</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="water" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryTitle}>Configurações do ciclo</Text>
            <Text style={styles.summarySubtitle}>
              Use os últimos meses como referência. Você pode atualizar a
              qualquer momento.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Última menstruação</Text>
            <Text style={styles.fieldHelper}>
              Quando começou seu último período
            </Text>
            <TouchableOpacity
              style={styles.dateCard}
              activeOpacity={0.85}
              onPress={openDatePicker}
            >
              <View style={styles.dateIconWrap}>
                <Ionicons name="calendar" size={20} color="#C43A4A" />
              </View>
              <Text style={styles.dateValue}>{formatLastPeriod(lastPeriod)}</Text>
              <Ionicons name="chevron-down" size={18} color="#9E9E9E" />
            </TouchableOpacity>

            {showIOSPicker && (
              <View style={styles.iosPicker}>
                <DateTimePicker
                  value={lastPeriod}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={(_, selected) => {
                    if (selected) {
                      const startOfDay = new Date(selected);
                      startOfDay.setHours(0, 0, 0, 0);
                      setLastPeriod(startOfDay);
                    }
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
          </View>

          <Stepper
            label="Duração média do ciclo"
            helper="Do primeiro dia ao próximo. Em média, 28 dias."
            value={duration}
            unit="dias"
            min={MIN_DURATION}
            max={MAX_DURATION}
            onChange={setDuration}
          />

          <Stepper
            label="Duração da menstruação"
            helper="Quantos dias dura seu sangramento"
            value={periodDuration}
            unit={periodDuration === 1 ? 'dia' : 'dias'}
            min={MIN_PERIOD}
            max={MAX_PERIOD}
            onChange={setPeriodDuration}
          />

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Ionicons name="sparkles-outline" size={16} color="#C56682" />
              <Text style={styles.previewTitle}>Previsão com base nos dados</Text>
            </View>

            <View style={styles.previewRow}>
              <View style={[styles.previewDot, { backgroundColor: '#C43A4A' }]} />
              <Text style={styles.previewLabel}>Próxima menstruação</Text>
              <Text style={styles.previewValue}>
                {formatLastPeriod(nextPeriodEstimate).replace(/ \(.+\)$/, '')}
              </Text>
            </View>
            <View style={styles.previewDivider} />

            <View style={styles.previewRow}>
              <View style={[styles.previewDot, { backgroundColor: '#C56682' }]} />
              <Text style={styles.previewLabel}>Dia da ovulação</Text>
              <Text style={styles.previewValue}>Dia {ovulationDay}</Text>
            </View>
            <View style={styles.previewDivider} />

            <View style={styles.previewRow}>
              <View style={[styles.previewDot, { backgroundColor: '#E7A48C' }]} />
              <Text style={styles.previewLabel}>Janela fértil</Text>
              <Text style={styles.previewValue}>
                Dia {ovulationDay - 4} ao {ovulationDay + 1}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={18} color="#C56682" />
            <Text style={styles.infoText}>
              A previsão é uma estimativa. Cada corpo é único e variações são
              normais. Em caso de irregularidade, procure a UBS.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!dirty || upsertMutation.isPending) && styles.saveButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!dirty || upsertMutation.isPending}
            onPress={handleSave}
          >
            {upsertMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Salvar alterações</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stepper({ label, helper, value, unit, min, max, onChange }) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));
  const canDec = value > min;
  const canInc = value < max;

  return (
    <View style={styles.section}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldHelper}>{helper}</Text>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={[styles.stepperButton, !canDec && styles.stepperButtonDisabled]}
          onPress={decrement}
          disabled={!canDec}
          activeOpacity={0.7}
        >
          <Ionicons
            name="remove"
            size={22}
            color={canDec ? '#C43A4A' : '#E0BFC8'}
          />
        </TouchableOpacity>

        <View style={styles.stepperValueWrap}>
          <Text style={styles.stepperValue}>{value}</Text>
          <Text style={styles.stepperUnit}>{unit}</Text>
        </View>

        <TouchableOpacity
          style={[styles.stepperButton, !canInc && styles.stepperButtonDisabled]}
          onPress={increment}
          disabled={!canInc}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add"
            size={22}
            color={canInc ? '#C43A4A' : '#E0BFC8'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBF4EB',
  },
  safe: {
    flex: 1,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: '#FBD9E5',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 180,
    height: 180,
    top: -60,
    right: -60,
    backgroundColor: '#FBF4EB',
    opacity: 0.5,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  iconButton: {
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
  iconButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  summaryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 2,
  },
  fieldHelper: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 14,
    lineHeight: 17,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  dateIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  iosPicker: {
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
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
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF4EB',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  stepperButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0,
    elevation: 0,
  },
  stepperValueWrap: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  stepperValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  stepperUnit: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '700',
    marginTop: 8,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewLabel: {
    flex: 1,
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  previewValue: {
    fontSize: 13,
    color: '#C43A4A',
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  previewDivider: {
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.05)',
    marginVertical: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(197, 102, 130, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C43A4A',
    height: 56,
    borderRadius: 14,
    marginTop: 24,
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
});
