import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function RegistroLayout({
  title,
  subtitle,
  icon,
  iconColor = '#C56682',
  iconBg = '#FBD9E5',
  prefillDate,
  onSave,
  canSave,
  showDateCard = true,
  children,
}) {
  const router = useRouter();
  const [date, setDate] = useState(prefillDate || new Date());
  const [showIOSPicker, setShowIOSPicker] = useState(false);

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
    if (!canSave) return;
    onSave?.(date);
    Alert.alert('Registro salvo', 'Suas informações foram salvas com sucesso.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
          <View style={[styles.headerIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && (
              <Text style={styles.headerSubtitle}>{subtitle}</Text>
            )}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showDateCard && (
            <>
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
            </>
          )}

          {children}

          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            activeOpacity={0.85}
            disabled={!canSave}
            onPress={handleSave}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Suas informações são confidenciais e usadas apenas para o seu
            acompanhamento.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function parsePrefillDate(value) {
  if (!value) return null;
  try {
    const parsed = new Date(String(value));
    if (isNaN(parsed.getTime())) return null;
    return parsed;
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBF4EB',
  },
  safe: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 220,
    height: 220,
    top: -90,
    right: -70,
    backgroundColor: '#FBD9E5',
    opacity: 0.55,
  },
  blobBottom: {
    width: 200,
    height: 200,
    bottom: -80,
    left: -80,
    backgroundColor: '#FBD9E5',
    opacity: 0.35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 1,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    paddingTop: 4,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 4,
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
