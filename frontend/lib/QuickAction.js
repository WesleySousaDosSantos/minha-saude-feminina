import { createContext, useContext, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const QuickActionContext = createContext(null);

const ACTIONS = [
  {
    id: 'menstruacao',
    label: 'Registrar menstruação',
    icon: 'water',
    tint: '#FBD9E5',
    color: '#C43A4A',
    route: '/registro/menstruacao',
  },
  {
    id: 'sintomas',
    label: 'Registrar sintomas',
    icon: 'medkit-outline',
    tint: 'rgba(197, 102, 130, 0.15)',
    color: '#C56682',
    route: '/registro/sintomas',
  },
  {
    id: 'corrimento',
    label: 'Registrar corrimento',
    icon: 'water-outline',
    tint: 'rgba(231, 164, 140, 0.22)',
    color: '#E7A48C',
    route: '/registro/corrimento',
  },
  {
    id: 'colica',
    label: 'Registrar cólica',
    icon: 'flash',
    tint: '#FBD9E5',
    color: '#C43A4A',
    route: '/registro/colica',
  },
  {
    id: 'humor',
    label: 'Registrar humor',
    icon: 'happy-outline',
    tint: 'rgba(197, 102, 130, 0.15)',
    color: '#C56682',
    route: '/registro/humor',
  },
  {
    id: 'lembrete',
    label: 'Adicionar lembrete',
    icon: 'alarm-outline',
    tint: 'rgba(231, 164, 140, 0.22)',
    color: '#E7A48C',
    route: '/registro/lembrete',
  },
  {
    id: 'completo',
    label: 'Registro completo',
    icon: 'clipboard-outline',
    tint: '#FBF4EB',
    color: '#1F1F1F',
    route: '/registrar',
  },
];

function formatPrefillDate(date) {
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
  return `${date.getDate()} de ${months[date.getMonth()]}`;
}

export function QuickActionProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [prefillDate, setPrefillDate] = useState(null);
  const router = useRouter();

  const open = useCallback((date = null) => {
    setPrefillDate(date);
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const handleAction = (route) => {
    setVisible(false);
    const query = prefillDate
      ? `?date=${encodeURIComponent(prefillDate.toISOString())}`
      : '';
    router.push(`${route}${query}`);
  };

  return (
    <QuickActionContext.Provider value={{ open }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Ação rápida</Text>
              {prefillDate ? (
                <Text style={styles.dateHint}>
                  Para o dia {formatPrefillDate(prefillDate)}
                </Text>
              ) : (
                <Text style={styles.dateHint}>O que você quer registrar?</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={close}
              hitSlop={12}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#6B6B6B" />
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={styles.actionCard}
                activeOpacity={0.85}
                onPress={() => handleAction(a.route)}
              >
                <View style={[styles.actionIcon, { backgroundColor: a.tint }]}>
                  <Ionicons name={a.icon} size={20} color={a.color} />
                </View>
                <Text style={styles.actionLabel} numberOfLines={2}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </QuickActionContext.Provider>
  );
}

export function useQuickAction() {
  const ctx = useContext(QuickActionContext);
  if (!ctx) {
    throw new Error('useQuickAction must be used within QuickActionProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 31, 31, 0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(31, 31, 31, 0.18)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  dateHint: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FBF4EB',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 17,
  },
});
