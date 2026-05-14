import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { QUESTIONS, CHAT_CATEGORY_LABEL } from '../../lib/chat';

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'answered', label: 'Respondidas' },
  { id: 'pending', label: 'Aguardando' },
];

export default function ENormalIssoLista() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return QUESTIONS;
    return QUESTIONS.filter((q) => q.status === filter);
  }, [filter]);

  const totalAnswered = QUESTIONS.filter((q) => q.status === 'answered').length;
  const totalPending = QUESTIONS.filter((q) => q.status === 'pending').length;

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
          <Text style={styles.headerTitle}>É normal isso?</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.introTitle}>
              Tire suas dúvidas{'\n'}
              <Text style={styles.introTitleAccent}>anonimamente</Text>
            </Text>
            <Text style={styles.introSubtitle}>
              Profissionais da UBS respondem em até 24 horas. Sua identidade
              nunca é compartilhada.
            </Text>
          </View>

          <View style={styles.howItWorks}>
            <View style={styles.howStep}>
              <View style={styles.howStepIcon}>
                <Ionicons name="chatbox-ellipses" size={18} color="#C43A4A" />
              </View>
              <Text style={styles.howStepText}>Você pergunta</Text>
            </View>
            <View style={styles.howArrow}>
              <Ionicons name="chevron-forward" size={14} color="#9E9E9E" />
            </View>
            <View style={styles.howStep}>
              <View style={[styles.howStepIcon, { backgroundColor: 'rgba(197, 102, 130, 0.18)' }]}>
                <Ionicons name="medkit" size={18} color="#C56682" />
              </View>
              <Text style={styles.howStepText}>UBS responde</Text>
            </View>
            <View style={styles.howArrow}>
              <Ionicons name="chevron-forward" size={14} color="#9E9E9E" />
            </View>
            <View style={styles.howStep}>
              <View style={[styles.howStepIcon, { backgroundColor: 'rgba(231, 164, 140, 0.25)' }]}>
                <Ionicons name="notifications" size={18} color="#E7A48C" />
              </View>
              <Text style={styles.howStepText}>Você é avisada</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.newQuestionButton}
            activeOpacity={0.85}
            onPress={() => router.push('/e-normal-isso/nova')}
          >
            <View style={styles.newQuestionIcon}>
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.newQuestionTextWrap}>
              <Text style={styles.newQuestionTitle}>Fazer nova pergunta</Text>
              <Text style={styles.newQuestionHelper}>
                Anônima e gratuita
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <View style={[styles.statDot, { backgroundColor: '#C56682' }]} />
              <Text style={styles.statText}>
                <Text style={styles.statNumber}>{totalAnswered}</Text>{' '}
                respondidas
              </Text>
            </View>
            <View style={styles.statBadge}>
              <View style={[styles.statDot, { backgroundColor: '#E7A48C' }]} />
              <Text style={styles.statText}>
                <Text style={styles.statNumber}>{totalPending}</Text> aguardando
              </Text>
            </View>
          </View>

          <View style={styles.filtersRow}>
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  activeOpacity={0.85}
                  onPress={() => setFilter(f.id)}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      active && styles.filterLabelActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="chatbox-outline" size={32} color="#C56682" />
              </View>
              <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
              <Text style={styles.emptyText}>
                {filter === 'pending'
                  ? 'Você não tem perguntas aguardando resposta.'
                  : filter === 'answered'
                  ? 'Você ainda não recebeu respostas.'
                  : 'Faça sua primeira pergunta tocando no botão acima.'}
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((q) => (
                <TouchableOpacity
                  key={q.id}
                  style={styles.questionCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/e-normal-isso/${q.id}`)}
                >
                  <View style={styles.questionHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {CHAT_CATEGORY_LABEL[q.category]}
                      </Text>
                    </View>
                    {q.status === 'pending' ? (
                      <View style={styles.pendingBadge}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.pendingText}>Aguardando</Text>
                      </View>
                    ) : (
                      <View style={styles.answeredBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={11}
                          color="#FFFFFF"
                        />
                        <Text style={styles.answeredText}>Respondida</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.questionText} numberOfLines={3}>
                    {q.question}
                  </Text>

                  <View style={styles.questionFooter}>
                    <Ionicons name="time-outline" size={12} color="#9E9E9E" />
                    <Text style={styles.questionTime}>{q.askedAt}</Text>
                    {q.status === 'answered' && (
                      <>
                        <View style={styles.dotSeparator} />
                        <Ionicons
                          name="arrow-forward"
                          size={12}
                          color="#C56682"
                        />
                        <Text style={styles.viewAnswer}>Ver resposta</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.disclaimer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#6B6B6B"
            />
            <Text style={styles.disclaimerText}>
              Suas perguntas são totalmente anônimas. Em casos de emergência,
              procure a UBS ou ligue 192 (SAMU).
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    height: 240,
    backgroundColor: '#FBD9E5',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 200,
    height: 200,
    top: -80,
    right: -70,
    backgroundColor: '#FBF4EB',
    opacity: 0.55,
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
    paddingBottom: 32,
  },
  intro: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  introTitleAccent: {
    color: '#C43A4A',
  },
  introSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  howItWorks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 22,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  howStep: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  howStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  howStepText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  howArrow: {
    paddingHorizontal: 2,
  },
  newQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#C43A4A',
    borderRadius: 18,
    marginHorizontal: 22,
    padding: 14,
    paddingRight: 18,
    marginBottom: 18,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 8,
  },
  newQuestionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newQuestionTextWrap: {
    flex: 1,
  },
  newQuestionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  newQuestionHelper: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    marginBottom: 14,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
    color: '#1F1F1F',
  },
  statNumber: {
    fontWeight: '800',
    color: '#C43A4A',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 22,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C56682',
  },
  filterLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '700',
  },
  filterLabelActive: {
    color: '#C43A4A',
  },
  list: {
    paddingHorizontal: 22,
    gap: 10,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(197, 102, 130, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 10,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(231, 164, 140, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E7A48C',
  },
  pendingText: {
    fontSize: 10,
    color: '#C43A4A',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C56682',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  answeredText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  questionText: {
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 20,
    marginBottom: 10,
  },
  questionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questionTime: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9E9E9E',
    marginHorizontal: 4,
  },
  viewAnswer: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
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
