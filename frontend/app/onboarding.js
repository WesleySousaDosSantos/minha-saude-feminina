import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useUpsertCycleMutation } from '../services/queries';

export default function Onboarding() {
  const router = useRouter();
  const upsertCycleMutation = useUpsertCycleMutation();
  const [lastPeriod, setLastPeriod] = useState(null);
  const [cycleDuration, setCycleDuration] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [showIosPicker, setShowIosPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) setLastPeriod(selectedDate);
    } else {
      if (selectedDate) setLastPeriod(selectedDate);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: lastPeriod || new Date(),
        onChange: handleDateChange,
        mode: 'date',
        maximumDate: new Date(),
      });
    } else {
      setShowIosPicker(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Toque para escolher';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleContinue = () => {
    if (!lastPeriod || upsertCycleMutation.isPending) return;
    const startOfDay = new Date(lastPeriod);
    startOfDay.setHours(0, 0, 0, 0);
    upsertCycleMutation.mutate(
      {
        lastPeriodStart: startOfDay.toISOString(),
        cycleDuration,
        periodDuration,
      },
      {
        onSuccess: () => router.replace('/hoje'),
        onError: (err) =>
          Alert.alert(
            'Não foi possível salvar o ciclo',
            err?.message ||
              'Você pode configurar depois em Perfil → Meu ciclo.',
            [
              { text: 'Tentar de novo', style: 'cancel' },
              {
                text: 'Pular',
                onPress: () => router.replace('/hoje'),
              },
            ]
          ),
      }
    );
  };

  const handleSkip = () => {
    router.replace('/hoje');
  };

  const canContinue = !!lastPeriod && !upsertCycleMutation.isPending;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Vamos te conhecer{'\n'}melhor</Text>
          <Text style={styles.subtitle}>
            Essas informações ajudam o app a{'\n'}acompanhar seu ciclo com
            precisão
          </Text>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionNumber}>
              <Text style={styles.questionNumberText}>1</Text>
            </View>
            <Text style={styles.questionTitle}>
              Quando começou sua última menstruação?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color="#C56682" />
            <Text
              style={[
                styles.dateButtonText,
                !lastPeriod && styles.dateButtonPlaceholder,
              ]}
            >
              {formatDate(lastPeriod)}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#C56682" />
          </TouchableOpacity>
          {showIosPicker && Platform.OS === 'ios' && (
            <View style={styles.iosPickerWrap}>
              <DateTimePicker
                value={lastPeriod || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                locale="pt-BR"
              />
              <TouchableOpacity
                style={styles.iosPickerDone}
                onPress={() => setShowIosPicker(false)}
              >
                <Text style={styles.iosPickerDoneText}>Pronto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionNumber}>
              <Text style={styles.questionNumberText}>2</Text>
            </View>
            <Text style={styles.questionTitle}>
              Quantos dias dura seu ciclo?
            </Text>
          </View>
          <Text style={styles.questionHint}>
            Do primeiro dia da menstruação até o dia anterior à próxima. O
            normal é entre 21 e 36 dias.
          </Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                cycleDuration <= 21 && styles.stepperButtonDisabled,
              ]}
              onPress={() =>
                setCycleDuration(Math.max(21, cycleDuration - 1))
              }
              disabled={cycleDuration <= 21}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.stepperValueWrap}>
              <Text style={styles.stepperValue}>{cycleDuration}</Text>
              <Text style={styles.stepperLabel}>dias</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                cycleDuration >= 40 && styles.stepperButtonDisabled,
              ]}
              onPress={() =>
                setCycleDuration(Math.min(40, cycleDuration + 1))
              }
              disabled={cycleDuration >= 40}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionNumber}>
              <Text style={styles.questionNumberText}>3</Text>
            </View>
            <Text style={styles.questionTitle}>
              Quantos dias dura sua menstruação?
            </Text>
          </View>
          <Text style={styles.questionHint}>
            A média é de 3 a 7 dias.
          </Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                periodDuration <= 2 && styles.stepperButtonDisabled,
              ]}
              onPress={() =>
                setPeriodDuration(Math.max(2, periodDuration - 1))
              }
              disabled={periodDuration <= 2}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.stepperValueWrap}>
              <Text style={styles.stepperValue}>{periodDuration}</Text>
              <Text style={styles.stepperLabel}>dias</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                periodDuration >= 10 && styles.stepperButtonDisabled,
              ]}
              onPress={() =>
                setPeriodDuration(Math.min(10, periodDuration + 1))
              }
              disabled={periodDuration >= 10}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !canContinue && styles.primaryButtonDisabled,
          ]}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={handleContinue}
        >
          {upsertCycleMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          hitSlop={8}
          disabled={upsertCycleMutation.isPending}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Pular por agora</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBD9E5',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 260,
    height: 260,
    top: -100,
    right: -80,
    backgroundColor: '#FBF4EB',
    opacity: 0.7,
  },
  blobBottom: {
    width: 220,
    height: 220,
    bottom: -90,
    left: -70,
    backgroundColor: '#FFFFFF',
    opacity: 0.45,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 7,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 8,
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  questionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 21,
  },
  questionHint: {
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
    marginBottom: 14,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.18)',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  dateButtonPlaceholder: {
    color: '#9E9E9E',
    fontWeight: '400',
  },
  iosPickerWrap: {
    marginTop: 12,
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  iosPickerDone: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  iosPickerDoneText: {
    color: '#C56682',
    fontSize: 15,
    fontWeight: '700',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  stepperButtonDisabled: {
    backgroundColor: 'rgba(197, 102, 130, 0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  stepperValueWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  stepperValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#C43A4A',
    letterSpacing: 0.5,
  },
  stepperLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#C56682',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    shadowColor: '#C56682',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#E0BFC8',
    shadowOpacity: 0,
    elevation: 0,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#C56682',
    fontWeight: '600',
  },
});
