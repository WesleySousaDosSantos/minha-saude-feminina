import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuickAction } from '../../lib/QuickAction';
import {
  useCycleQuery,
  useRegistrosByDateQuery,
} from '../../services/queries';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const MONTHS_LONG = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const PHASE_INFO = {
  menstruation: { label: 'Menstruação', color: '#C43A4A', icon: 'water' },
  fertile: { label: 'Período fértil', color: '#E7A48C', icon: 'leaf' },
  ovulation: { label: 'Ovulação', color: '#C56682', icon: 'sparkles' },
  neutral: { label: 'Fase neutra', color: '#9E9E9E', icon: 'ellipse-outline' },
};

const FLOW_LABELS = {
  spotting: 'Spotting',
  light: 'Leve',
  medium: 'Médio',
  heavy: 'Intenso',
};

const MOOD_LABELS = {
  happy: 'Bem',
  calm: 'Calma',
  normal: 'Normal',
  anxious: 'Ansiosa',
  sad: 'Triste',
  irritated: 'Irritada',
  tired: 'Cansada',
  sensitive: 'Sensível',
};

const ENERGY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const SYMPTOM_LABELS = {
  headache: 'Dor de cabeça',
  backpain: 'Dor nas costas',
  bloating: 'Inchaço',
  acne: 'Acne',
  breast: 'Seios sensíveis',
  fatigue: 'Fadiga',
  nausea: 'Náusea',
  insomnia: 'Insônia',
  cravings: 'Compulsão por doce',
  mood: 'Mudanças de humor',
};

const CRAMP_INTENSITY_LABELS = {
  mild: 'Leve',
  moderate: 'Moderada',
  strong: 'Forte',
  severe: 'Muito forte',
};

const CRAMP_LOCATION_LABELS = {
  lowerBelly: 'Baixo ventre',
  lowerBack: 'Lombar',
  legs: 'Pernas',
  whole: 'Geral',
};

const DISCHARGE_COLOR_LABELS = {
  clear: 'Transparente',
  white: 'Branco',
  yellow: 'Amarelado',
  brown: 'Acastanhado',
  pink: 'Rosado',
};

const DISCHARGE_TEXTURE_LABELS = {
  watery: 'Aguado',
  creamy: 'Cremoso',
  stretchy: 'Elástico',
  thick: 'Espesso',
};

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPhase(date, cycleStart, cycleDuration, periodDuration) {
  const diffDays = Math.floor(
    (startOfDay(date) - startOfDay(cycleStart)) / MS_PER_DAY
  );
  const cycleDay =
    ((diffDays % cycleDuration) + cycleDuration) % cycleDuration + 1;
  const ovulationDay = cycleDuration - 14;

  if (cycleDay >= 1 && cycleDay <= periodDuration) return 'menstruation';
  if (cycleDay === ovulationDay) return 'ovulation';
  if (cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 5)
    return 'fertile';
  return 'neutral';
}

function getCycleDay(date, cycleStart, cycleDuration) {
  const diffDays = Math.floor(
    (startOfDay(date) - startOfDay(cycleStart)) / MS_PER_DAY
  );
  return ((diffDays % cycleDuration) + cycleDuration) % cycleDuration + 1;
}

function parseDate(value) {
  if (!value) return new Date();
  try {
    const parts = String(value).split('-');
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
    }
    return new Date(value);
  } catch {
    return new Date();
  }
}

function shapeRegistro(item) {
  if (!item) return null;
  const cramps =
    item.crampIntensity || item.crampDuration || item.crampLocations?.length
      ? {
          intensity: item.crampIntensity,
          locations: item.crampLocations || [],
          duration: item.crampDuration,
        }
      : null;
  const discharge =
    item.dischargeColor || item.dischargeTexture || item.dischargeVolume
      ? {
          color: item.dischargeColor,
          texture: item.dischargeTexture,
          volume: item.dischargeVolume,
        }
      : null;
  return {
    flow: item.flow,
    mood: item.mood,
    energy: item.energy,
    symptoms: (item.symptoms || []).filter((s) => s !== 'cramps'),
    cramps,
    discharge,
    notes: item.notes,
  };
}

export default function DiaDetalhe() {
  const router = useRouter();
  const { date: dateParam } = useLocalSearchParams();
  const { open: openQuickAction } = useQuickAction();

  const date = useMemo(() => parseDate(dateParam), [dateParam]);

  const cycleQuery = useCycleQuery();
  const registrosQuery = useRegistrosByDateQuery(date);

  const cycleStart = useMemo(() => {
    if (cycleQuery.data?.lastPeriodStart) {
      const d = new Date(cycleQuery.data.lastPeriodStart);
      if (!isNaN(d.getTime())) return d;
    }
    const today = startOfDay(new Date());
    const s = new Date(today);
    s.setDate(today.getDate() - 13);
    return s;
  }, [cycleQuery.data]);
  const cycleDuration = cycleQuery.data?.cycleDuration ?? 28;
  const periodDuration = cycleQuery.data?.periodDuration ?? 5;

  const phase = getPhase(date, cycleStart, cycleDuration, periodDuration);
  const cycleDay = getCycleDay(date, cycleStart, cycleDuration);
  const phaseInfo = PHASE_INFO[phase];

  const registros = useMemo(
    () => shapeRegistro(registrosQuery.data?.[0]),
    [registrosQuery.data]
  );

  const today = startOfDay(new Date());
  const isToday = startOfDay(date).getTime() === today.getTime();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = startOfDay(date).getTime() === yesterday.getTime();
  const isFuture = startOfDay(date).getTime() > today.getTime();

  const dayLabel = isToday
    ? 'Hoje'
    : isYesterday
    ? 'Ontem'
    : WEEKDAYS[date.getDay()];

  const fullDate = `${date.getDate()} de ${MONTHS_LONG[date.getMonth()]}`;

  const hasAnyRegistro =
    registros &&
    (registros.flow ||
      registros.mood ||
      registros.symptoms?.length > 0 ||
      registros.cramps ||
      registros.discharge ||
      registros.notes);

  return (
    <View style={styles.root}>
      <View style={[styles.headerBg, { backgroundColor: phaseInfo.color }]} />
      <View style={[styles.blob, styles.blobTop]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="light" />

        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerDay}>{dayLabel}</Text>
            <Text style={styles.headerDate}>{fullDate}</Text>
          </View>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View
              style={[styles.phaseIcon, { backgroundColor: phaseInfo.color }]}
            >
              <Ionicons name={phaseInfo.icon} size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.phaseLabel}>{phaseInfo.label}</Text>
            <View style={styles.cycleDayBadge}>
              <Text style={styles.cycleDayText}>
                Dia {cycleDay} do ciclo
              </Text>
            </View>
          </View>

          {isFuture ? (
            <View style={styles.futureCard}>
              <View style={styles.futureIcon}>
                <Ionicons name="time-outline" size={28} color="#C56682" />
              </View>
              <Text style={styles.futureTitle}>Esse dia ainda não chegou</Text>
              <Text style={styles.futureText}>
                Você pode registrar sintomas, humor e fluxo a partir do dia
                atual.
              </Text>
            </View>
          ) : registrosQuery.isLoading ? (
            <View style={styles.emptyCard}>
              <ActivityIndicator color="#C56682" />
            </View>
          ) : !hasAnyRegistro ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons name="document-text-outline" size={28} color="#C56682" />
              </View>
              <Text style={styles.emptyTitle}>Nada registrado</Text>
              <Text style={styles.emptyText}>
                {isToday
                  ? 'Como você está hoje? Registre o que sentiu.'
                  : 'Você não registrou nada nesse dia.'}
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                activeOpacity={0.85}
                onPress={() => openQuickAction(date)}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.emptyButtonText}>Adicionar registro</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.sectionListHeader}>
                <Text style={styles.sectionListTitle}>Registros do dia</Text>
                <TouchableOpacity
                  style={styles.addInline}
                  activeOpacity={0.85}
                  onPress={() => openQuickAction(date)}
                >
                  <Ionicons name="add" size={16} color="#C43A4A" />
                  <Text style={styles.addInlineText}>Adicionar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cardsList}>
                {registros.flow && (
                  <RegistroCard
                    icon="water"
                    iconColor="#C43A4A"
                    iconBg="#FBD9E5"
                    title="Menstruação"
                    onEdit={() => router.push('/registro/menstruacao')}
                  >
                    <View style={styles.tagRow}>
                      <View style={[styles.tag, styles.tagFlow]}>
                        <Text style={styles.tagFlowText}>
                          {FLOW_LABELS[registros.flow]}
                        </Text>
                      </View>
                    </View>
                  </RegistroCard>
                )}

                {registros.mood && (
                  <RegistroCard
                    icon="happy"
                    iconColor="#C56682"
                    iconBg="rgba(197, 102, 130, 0.18)"
                    title="Humor"
                    onEdit={() => router.push('/registro/humor')}
                  >
                    <View style={styles.tagRow}>
                      <View style={[styles.tag, styles.tagMood]}>
                        <Text style={styles.tagMoodText}>
                          {MOOD_LABELS[registros.mood]}
                        </Text>
                      </View>
                      {registros.energy && (
                        <View style={[styles.tag, styles.tagSecondary]}>
                          <Text style={styles.tagSecondaryText}>
                            Energia: {ENERGY_LABELS[registros.energy]}
                          </Text>
                        </View>
                      )}
                    </View>
                  </RegistroCard>
                )}

                {registros.symptoms?.length > 0 && (
                  <RegistroCard
                    icon="medkit"
                    iconColor="#C56682"
                    iconBg="rgba(197, 102, 130, 0.18)"
                    title="Sintomas"
                    badge={`${registros.symptoms.length}`}
                    onEdit={() => router.push('/registro/sintomas')}
                  >
                    <View style={styles.tagRow}>
                      {registros.symptoms.map((s) => (
                        <View key={s} style={[styles.tag, styles.tagSymptom]}>
                          <Text style={styles.tagSymptomText}>
                            {SYMPTOM_LABELS[s] || s}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </RegistroCard>
                )}

                {registros.cramps && (
                  <RegistroCard
                    icon="flash"
                    iconColor="#C43A4A"
                    iconBg="#FBD9E5"
                    title="Cólica"
                    onEdit={() => router.push('/registro/colica')}
                  >
                    <View style={styles.tagRow}>
                      <View style={[styles.tag, styles.tagCramp]}>
                        <Text style={styles.tagCrampText}>
                          {CRAMP_INTENSITY_LABELS[registros.cramps.intensity]}
                        </Text>
                      </View>
                      {registros.cramps.locations?.map((l) => (
                        <View key={l} style={[styles.tag, styles.tagSecondary]}>
                          <Text style={styles.tagSecondaryText}>
                            {CRAMP_LOCATION_LABELS[l] || l}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </RegistroCard>
                )}

                {registros.discharge && (
                  <RegistroCard
                    icon="water-outline"
                    iconColor="#E7A48C"
                    iconBg="rgba(231, 164, 140, 0.22)"
                    title="Corrimento"
                    onEdit={() => router.push('/registro/corrimento')}
                  >
                    <View style={styles.tagRow}>
                      {registros.discharge.color && (
                        <View style={[styles.tag, styles.tagSecondary]}>
                          <Text style={styles.tagSecondaryText}>
                            {DISCHARGE_COLOR_LABELS[registros.discharge.color]}
                          </Text>
                        </View>
                      )}
                      {registros.discharge.texture && (
                        <View style={[styles.tag, styles.tagSecondary]}>
                          <Text style={styles.tagSecondaryText}>
                            {DISCHARGE_TEXTURE_LABELS[registros.discharge.texture]}
                          </Text>
                        </View>
                      )}
                    </View>
                  </RegistroCard>
                )}

                {registros.notes && (
                  <RegistroCard
                    icon="reader"
                    iconColor="#1F1F1F"
                    iconBg="#FBF4EB"
                    title="Anotações"
                    onEdit={() => router.push('/registrar')}
                  >
                    <Text style={styles.notes}>{registros.notes}</Text>
                  </RegistroCard>
                )}
              </View>
            </>
          )}

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B6B6B"
            />
            <Text style={styles.disclaimerText}>
              Registros consistentes ajudam a UBS a entender melhor seu ciclo
              durante a consulta.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function RegistroCard({
  icon,
  iconColor,
  iconBg,
  title,
  badge,
  onEdit,
  children,
}) {
  return (
    <View style={styles.registroCard}>
      <View style={styles.registroHeader}>
        <View style={styles.registroHeaderLeft}>
          <View style={[styles.registroIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
          <Text style={styles.registroTitle}>{title}</Text>
          {badge && (
            <View style={styles.registroBadge}>
              <Text style={styles.registroBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.7}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={14} color="#C56682" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registroBody}>{children}</View>
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
    height: 200,
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
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerDay: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  headerDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginTop: 1,
  },
  scroll: {
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 22,
    marginTop: 14,
    paddingVertical: 22,
    alignItems: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  phaseIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 5,
  },
  phaseLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  cycleDayBadge: {
    backgroundColor: 'rgba(197, 102, 130, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  cycleDayText: {
    fontSize: 12,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionListTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  addInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(196, 58, 74, 0.1)',
    borderRadius: 999,
  },
  addInlineText: {
    fontSize: 12,
    color: '#C43A4A',
    fontWeight: '800',
  },
  cardsList: {
    paddingHorizontal: 22,
    gap: 10,
  },
  registroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  registroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  registroHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registroIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  registroBadge: {
    backgroundColor: '#C56682',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '700',
  },
  registroBody: {
    paddingTop: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagFlow: {
    backgroundColor: '#FBD9E5',
  },
  tagFlowText: {
    fontSize: 12,
    color: '#C43A4A',
    fontWeight: '800',
  },
  tagMood: {
    backgroundColor: '#C56682',
  },
  tagMoodText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tagSecondary: {
    backgroundColor: '#FBF4EB',
  },
  tagSecondaryText: {
    fontSize: 12,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  tagSymptom: {
    backgroundColor: 'rgba(197, 102, 130, 0.14)',
  },
  tagSymptomText: {
    fontSize: 12,
    color: '#C56682',
    fontWeight: '700',
  },
  tagCramp: {
    backgroundColor: '#C43A4A',
  },
  tagCrampText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  notes: {
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 22,
    marginTop: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C43A4A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  futureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 22,
    marginTop: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  futureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(197, 102, 130, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  futureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
    textAlign: 'center',
  },
  futureText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 22,
    marginTop: 22,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 16,
  },
});
