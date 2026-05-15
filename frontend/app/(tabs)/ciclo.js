import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCycleQuery } from '../../services/queries';

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const SYMPTOM_DATES = [];

function hasSymptom(date) {
  return SYMPTOM_DATES.some((s) => s.getTime() === date.getTime());
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const grid = [];

  for (let i = 0; i < firstDay; i++) {
    const day = daysInPrevMonth - firstDay + i + 1;
    const d = new Date(year, month - 1, day);
    grid.push({ date: d, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    grid.push({ date: d, isCurrentMonth: true });
  }
  let nextDay = 1;
  while (grid.length < 42) {
    const d = new Date(year, month + 1, nextDay);
    grid.push({ date: d, isCurrentMonth: false });
    nextDay++;
  }
  return grid;
}

function getPhase(date, cycleStart, cycleDuration, periodDuration) {
  const diffDays = Math.floor(
    (startOfDay(date) - startOfDay(cycleStart)) / MS_PER_DAY
  );
  const cycleDay = ((diffDays % cycleDuration) + cycleDuration) % cycleDuration + 1;
  const ovulationDay = cycleDuration - 14;

  if (cycleDay >= 1 && cycleDay <= periodDuration) return 'menstruation';
  if (cycleDay === ovulationDay) return 'ovulation';
  if (cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 5) return 'fertile';
  return null;
}

function formatLongDate(date) {
  return `${date.getDate()} de ${MONTHS[date.getMonth()].toLowerCase()}`;
}

const PHASE_LABEL = {
  menstruation: 'Menstruação',
  fertile: 'Período fértil',
  ovulation: 'Ovulação',
};

const PHASE_COLOR = {
  menstruation: '#C43A4A',
  fertile: '#E7A48C',
  ovulation: '#C56682',
};

export default function Ciclo() {
  const router = useRouter();
  const cycleQuery = useCycleQuery();
  const today = startOfDay(new Date());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const openDayDetail = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    router.push(`/dia/${yyyy}-${mm}-${dd}`);
  };

  const cycleStart = useMemo(() => {
    if (cycleQuery.data?.lastPeriodStart) {
      const d = new Date(cycleQuery.data.lastPeriodStart);
      if (!isNaN(d.getTime())) return startOfDay(d);
    }
    const start = new Date(today);
    start.setDate(today.getDate() - 13);
    return start;
  }, [cycleQuery.data]);
  const cycleDuration = cycleQuery.data?.cycleDuration ?? 28;
  const periodDuration = cycleQuery.data?.periodDuration ?? 5;

  const grid = useMemo(
    () => buildGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectedPhase = getPhase(
    selectedDate,
    cycleStart,
    cycleDuration,
    periodDuration
  );

  const daysUntilNextPeriod = (() => {
    const diff = Math.floor((startOfDay(today) - startOfDay(cycleStart)) / MS_PER_DAY);
    const cycleDay = ((diff % cycleDuration) + cycleDuration) % cycleDuration + 1;
    return cycleDuration - cycleDay + 1;
  })();

  return (
    <View style={styles.root}>
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Text style={styles.screenTitle}>Calendário</Text>
            <Text style={styles.screenSubtitle}>Seu ciclo em um lugar</Text>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.monthNav}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={goPrev}
                hitSlop={10}
              >
                <Ionicons name="chevron-back" size={20} color="#C56682" />
              </TouchableOpacity>
              <View style={styles.monthTitleWrap}>
                <Text style={styles.monthTitle}>{MONTHS[viewMonth]}</Text>
                <Text style={styles.yearTitle}>{viewYear}</Text>
              </View>
              <TouchableOpacity
                style={styles.navButton}
                onPress={goNext}
                hitSlop={10}
              >
                <Ionicons name="chevron-forward" size={20} color="#C56682" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {WEEK_DAYS.map((d) => (
                <Text key={d} style={styles.weekLabel}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {grid.map((cell, index) => {
                const isToday = cell.date.getTime() === today.getTime();
                const isSelected =
                  cell.date.getTime() === selectedDate.getTime();
                const phase = cell.isCurrentMonth
                  ? getPhase(
                      cell.date,
                      cycleStart,
                      cycleDuration,
                      periodDuration
                    )
                  : null;
                const showSymptom =
                  cell.isCurrentMonth && hasSymptom(cell.date);

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.dayCell}
                    onPress={() => setSelectedDate(startOfDay(cell.date))}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.dayPill,
                        phase === 'menstruation' && styles.pillMenstruation,
                        phase === 'fertile' && styles.pillFertile,
                        phase === 'ovulation' && styles.pillOvulation,
                        isToday && !isSelected && styles.pillToday,
                        isSelected && styles.pillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          !cell.isCurrentMonth && styles.dayOther,
                          phase === 'menstruation' && styles.textMenstruation,
                          phase === 'fertile' && styles.textFertile,
                          phase === 'ovulation' && styles.textOvulation,
                          isSelected && styles.dayNumberSelected,
                        ]}
                      >
                        {cell.date.getDate()}
                      </Text>
                    </View>
                    {showSymptom && (
                      <View
                        style={[
                          styles.symptomDot,
                          isSelected && styles.symptomDotOnSelected,
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotMenstruation]} />
              <Text style={styles.legendText}>Menstruação</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotFertile]} />
              <Text style={styles.legendText}>Fértil</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotOvulation]} />
              <Text style={styles.legendText}>Ovulação</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotSymptom]} />
              <Text style={styles.legendText}>Sintoma</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.selectedCard}
            activeOpacity={0.85}
            onPress={() => openDayDetail(selectedDate)}
          >
            <View style={styles.selectedHeader}>
              <Ionicons name="calendar" size={18} color="#C56682" />
              <Text style={styles.selectedDate}>
                {formatLongDate(selectedDate)}
              </Text>
              <View style={styles.selectedDetailHint}>
                <Text style={styles.selectedDetailHintText}>Ver detalhes</Text>
                <Ionicons name="chevron-forward" size={14} color="#C43A4A" />
              </View>
            </View>
            {selectedPhase ? (
              <View style={styles.phasePillRow}>
                <View
                  style={[
                    styles.phasePill,
                    { backgroundColor: PHASE_COLOR[selectedPhase] },
                  ]}
                >
                  <Text style={styles.phasePillText}>
                    {PHASE_LABEL[selectedPhase]}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectedPhaseNeutral}>Fase neutra do ciclo</Text>
            )}
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FBD9E5' }]}>
                <Ionicons name="water" size={20} color="#C43A4A" />
              </View>
              <Text style={styles.statValue}>{daysUntilNextPeriod}</Text>
              <Text style={styles.statLabel}>
                {daysUntilNextPeriod === 1
                  ? 'dia até a próxima'
                  : 'dias até a próxima'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FBF4EB' }]}>
                <Ionicons name="leaf-outline" size={20} color="#C56682" />
              </View>
              <Text style={styles.statValue}>{cycleDuration}</Text>
              <Text style={styles.statLabel}>dias do seu ciclo</Text>
            </View>
          </View>

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B6B6B"
            />
            <Text style={styles.disclaimerText}>
              A previsão do ciclo é uma estimativa. Em caso de irregularidade,
              procure a UBS.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const DAY_SIZE = Math.floor((width - 22 * 2 - 16 * 2) / 7);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBD9E5',
  },
  safe: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 240,
    height: 240,
    top: -100,
    right: -80,
    backgroundColor: '#FBF4EB',
    opacity: 0.7,
  },
  blobBottom: {
    width: 200,
    height: 200,
    bottom: 60,
    left: -80,
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  headerRow: {
    marginTop: 8,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 2,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleWrap: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  yearTitle: {
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '600',
    marginTop: 1,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    width: DAY_SIZE,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPill: {
    width: DAY_SIZE - 6,
    height: DAY_SIZE - 18,
    borderRadius: (DAY_SIZE - 18) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillMenstruation: {
    backgroundColor: '#FBD9E5',
  },
  pillFertile: {
    backgroundColor: 'rgba(231, 164, 140, 0.38)',
  },
  pillOvulation: {
    backgroundColor: 'rgba(197, 102, 130, 0.22)',
  },
  pillToday: {
    borderWidth: 1.5,
    borderColor: '#C56682',
  },
  pillSelected: {
    backgroundColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  dayNumber: {
    fontSize: 14,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  dayOther: {
    color: '#9E9E9E',
    fontWeight: '400',
  },
  textMenstruation: {
    color: '#C43A4A',
    fontWeight: '800',
  },
  textFertile: {
    color: '#C43A4A',
    fontWeight: '800',
  },
  textOvulation: {
    color: '#C56682',
    fontWeight: '800',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  symptomDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C43A4A',
    marginTop: 3,
  },
  symptomDotOnSelected: {
    backgroundColor: '#FFFFFF',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendDotMenstruation: {
    backgroundColor: '#FBD9E5',
    borderWidth: 1,
    borderColor: '#C43A4A',
  },
  legendDotFertile: {
    backgroundColor: 'rgba(231, 164, 140, 0.5)',
    borderWidth: 1,
    borderColor: '#C43A4A',
  },
  legendDotOvulation: {
    backgroundColor: 'rgba(197, 102, 130, 0.3)',
    borderWidth: 1,
    borderColor: '#C56682',
  },
  legendDotSymptom: {
    backgroundColor: '#C43A4A',
  },
  legendText: {
    fontSize: 12,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  selectedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  selectedDate: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  selectedDetailHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(196, 58, 74, 0.1)',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 4,
    borderRadius: 999,
  },
  selectedDetailHintText: {
    fontSize: 11,
    color: '#C43A4A',
    fontWeight: '800',
  },
  phasePillRow: {
    flexDirection: 'row',
  },
  phasePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  phasePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  selectedPhaseNeutral: {
    fontSize: 13,
    color: '#6B6B6B',
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 16,
  },
});
