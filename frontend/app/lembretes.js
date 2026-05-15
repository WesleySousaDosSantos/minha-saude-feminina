import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useDeleteLembreteMutation,
  useLembretesQuery,
  useUpdateLembreteMutation,
} from '../services/queries';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TYPE_INFO = {
  medication: {
    label: 'Medicação',
    icon: 'medical',
    color: '#C43A4A',
    tint: '#FBD9E5',
  },
  appointment: {
    label: 'Consulta',
    icon: 'calendar',
    color: '#C56682',
    tint: 'rgba(197, 102, 130, 0.18)',
  },
  exam: {
    label: 'Exame',
    icon: 'clipboard',
    color: '#E7A48C',
    tint: 'rgba(231, 164, 140, 0.25)',
  },
  cycle: {
    label: 'Ciclo',
    icon: 'water',
    color: '#C43A4A',
    tint: '#FBD9E5',
  },
  other: {
    label: 'Outro',
    icon: 'star',
    color: '#C56682',
    tint: 'rgba(197, 102, 130, 0.18)',
  },
};

const REPEAT_LABEL = {
  none: null,
  daily: 'Todos os dias',
  weekly: 'Toda semana',
  monthly: 'Todo mês',
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeReminders(list) {
  return (list || []).map((r) => ({
    ...r,
    datetime: new Date(r.datetime),
  }));
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function formatRelativeDate(date) {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diff = Math.floor((target - today) / MS_PER_DAY);

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';
  if (diff > 0 && diff <= 6) {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return weekdays[date.getDay()];
  }

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

function groupReminders(reminders) {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const groups = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    completed: [],
  };

  reminders.forEach((r) => {
    if (r.completed) {
      groups.completed.push(r);
      return;
    }
    const day = startOfDay(r.datetime);
    if (day.getTime() === today.getTime()) groups.today.push(r);
    else if (day.getTime() === tomorrow.getTime()) groups.tomorrow.push(r);
    else if (day > today && day < endOfWeek) groups.thisWeek.push(r);
    else groups.later.push(r);
  });

  const sortByDatetime = (a, b) => a.datetime - b.datetime;
  groups.today.sort(sortByDatetime);
  groups.tomorrow.sort(sortByDatetime);
  groups.thisWeek.sort(sortByDatetime);
  groups.later.sort(sortByDatetime);
  groups.completed.sort((a, b) => b.datetime - a.datetime);

  return groups;
}

export default function Lembretes() {
  const router = useRouter();
  const lembretesQuery = useLembretesQuery();
  const updateMutation = useUpdateLembreteMutation();
  const deleteMutation = useDeleteLembreteMutation();

  const reminders = useMemo(
    () => normalizeReminders(lembretesQuery.data),
    [lembretesQuery.data]
  );
  const groups = useMemo(() => groupReminders(reminders), [reminders]);
  const activeCount = reminders.filter((r) => !r.completed).length;
  const todayCount = groups.today.length;

  const animate = () => {
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
  };

  const toggleComplete = (id) => {
    const item = reminders.find((r) => r.id === id);
    if (!item) return;
    animate();
    updateMutation.mutate(
      { id, completed: !item.completed },
      {
        onError: (err) =>
          Alert.alert(
            'Não foi possível atualizar',
            err?.message || 'Tente novamente.'
          ),
      }
    );
  };

  const remove = (id) => {
    const r = reminders.find((x) => x.id === id);
    Alert.alert(
      'Excluir lembrete?',
      `"${r?.title}" será removido permanentemente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            animate();
            deleteMutation.mutate(id, {
              onError: (err) =>
                Alert.alert(
                  'Não foi possível excluir',
                  err?.message || 'Tente novamente.'
                ),
            });
          },
        },
      ]
    );
  };

  const isLoading = lembretesQuery.isLoading;
  const isEmpty = !isLoading && reminders.length === 0;

  return (
    <View style={styles.root}>
      <View style={styles.headerBg} />
      <View style={[styles.blob, styles.blobTop]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus lembretes</Text>
          <TouchableOpacity
            style={styles.iconButtonAccent}
            onPress={() => router.push('/registro/lembrete')}
            hitSlop={12}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={{ paddingTop: 64, alignItems: 'center' }}>
              <ActivityIndicator color="#C56682" />
            </View>
          ) : isEmpty ? (
            <EmptyState
              onCreate={() => router.push('/registro/lembrete')}
            />
          ) : (
            <>
              <View style={styles.statsCard}>
                <View style={styles.statBlock}>
                  <Text style={styles.statValue}>{activeCount}</Text>
                  <Text style={styles.statLabel}>
                    {activeCount === 1 ? 'lembrete ativo' : 'lembretes ativos'}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBlock}>
                  <Text style={styles.statValue}>{todayCount}</Text>
                  <Text style={styles.statLabel}>
                    {todayCount === 1 ? 'para hoje' : 'para hoje'}
                  </Text>
                </View>
              </View>

              <Group
                title="Hoje"
                items={groups.today}
                onToggle={toggleComplete}
                onDelete={remove}
              />
              <Group
                title="Amanhã"
                items={groups.tomorrow}
                onToggle={toggleComplete}
                onDelete={remove}
              />
              <Group
                title="Esta semana"
                items={groups.thisWeek}
                onToggle={toggleComplete}
                onDelete={remove}
              />
              <Group
                title="Mais tarde"
                items={groups.later}
                onToggle={toggleComplete}
                onDelete={remove}
              />
              <Group
                title="Concluídos"
                items={groups.completed}
                onToggle={toggleComplete}
                onDelete={remove}
                isCompleted
              />

              <TouchableOpacity
                style={styles.createButton}
                activeOpacity={0.85}
                onPress={() => router.push('/registro/lembrete')}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Criar novo lembrete</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Group({ title, items, onToggle, onDelete, isCompleted }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.groupCount}>
          <Text style={styles.groupCountText}>{items.length}</Text>
        </View>
      </View>
      <View style={styles.groupList}>
        {items.map((r) => (
          <ReminderCard
            key={r.id}
            reminder={r}
            onToggle={() => onToggle(r.id)}
            onDelete={() => onDelete(r.id)}
            isCompleted={isCompleted}
          />
        ))}
      </View>
    </View>
  );
}

function ReminderCard({ reminder, onToggle, onDelete, isCompleted }) {
  const info = TYPE_INFO[reminder.type] || TYPE_INFO.other;
  const dateLabel = formatRelativeDate(reminder.datetime);
  const timeLabel = formatTime(reminder.datetime);
  const repeatLabel = REPEAT_LABEL[reminder.repeat];

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.cardLeft}>
        <View style={[styles.cardIcon, { backgroundColor: info.tint }]}>
          <Ionicons name={info.icon} size={18} color={info.color} />
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardType}>{info.label}</Text>
          {reminder.notify && !isCompleted && (
            <Ionicons name="notifications" size={11} color="#C56682" />
          )}
        </View>
        <Text
          style={[
            styles.cardTitle,
            isCompleted && styles.cardTitleCompleted,
          ]}
          numberOfLines={2}
        >
          {reminder.title}
        </Text>
        <View style={styles.cardMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={11} color="#9E9E9E" />
            <Text style={styles.metaText}>{dateLabel}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={11} color="#9E9E9E" />
            <Text style={styles.metaText}>{timeLabel}</Text>
          </View>
          {repeatLabel && (
            <>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="repeat" size={11} color="#9E9E9E" />
                <Text style={styles.metaText}>{repeatLabel}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isCompleted ? styles.actionButtonUndo : styles.actionButtonCheck,
          ]}
          onPress={onToggle}
          activeOpacity={0.7}
          hitSlop={6}
        >
          <Ionicons
            name={isCompleted ? 'arrow-undo' : 'checkmark'}
            size={16}
            color={isCompleted ? '#C56682' : '#FFFFFF'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButtonDelete}
          onPress={onDelete}
          activeOpacity={0.7}
          hitSlop={6}
        >
          <Ionicons name="trash-outline" size={15} color="#C43A4A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({ onCreate }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="alarm-outline" size={36} color="#C56682" />
      </View>
      <Text style={styles.emptyTitle}>Sem lembretes ainda</Text>
      <Text style={styles.emptyText}>
        Crie lembretes pra não esquecer da pílula, exames, consultas e o que
        mais for importante pra sua saúde.
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        activeOpacity={0.85}
        onPress={onCreate}
      >
        <Ionicons name="add" size={18} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Criar primeiro lembrete</Text>
      </TouchableOpacity>
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
  iconButtonAccent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  scroll: {
    paddingBottom: 32,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 22,
    marginTop: 14,
    paddingVertical: 18,
    shadowColor: '#C56682',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(197, 102, 130, 0.18)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#C43A4A',
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  group: {
    marginTop: 22,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  groupCount: {
    backgroundColor: 'rgba(197, 102, 130, 0.12)',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCountText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
  },
  groupList: {
    paddingHorizontal: 22,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: '#FBF4EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardLeft: {
    paddingTop: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardType: {
    fontSize: 10,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 18,
  },
  cardTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B6B6B',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9E9E9E',
    marginHorizontal: 4,
  },
  cardActions: {
    flexDirection: 'column',
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonCheck: {
    backgroundColor: '#C56682',
  },
  actionButtonUndo: {
    backgroundColor: 'rgba(197, 102, 130, 0.14)',
  },
  actionButtonDelete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(196, 58, 74, 0.1)',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C43A4A',
    height: 56,
    borderRadius: 14,
    marginHorizontal: 22,
    marginTop: 26,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#C56682',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C43A4A',
    paddingHorizontal: 22,
    height: 52,
    borderRadius: 14,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
