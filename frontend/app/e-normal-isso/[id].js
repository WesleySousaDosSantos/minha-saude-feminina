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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getQuestionById, CHAT_CATEGORY_LABEL } from '../../lib/chat';

export default function PerguntaDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const q = getQuestionById(String(id));

  return (
    <View style={styles.root}>
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
          <Text style={styles.headerTitle}>Pergunta</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        {!q ? (
          <View style={styles.notFound}>
            <View style={styles.notFoundIcon}>
              <Ionicons name="chatbox-outline" size={32} color="#C56682" />
            </View>
            <Text style={styles.notFoundTitle}>Pergunta não encontrada</Text>
            <Text style={styles.notFoundText}>
              Essa pergunta pode ter sido removida.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.categoryRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {CHAT_CATEGORY_LABEL[q.category]}
                </Text>
              </View>
              {q.status === 'pending' ? (
                <View style={styles.pendingBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.pendingText}>Aguardando resposta</Text>
                </View>
              ) : (
                <View style={styles.answeredBadge}>
                  <Ionicons name="checkmark-circle" size={11} color="#FFFFFF" />
                  <Text style={styles.answeredText}>Respondida</Text>
                </View>
              )}
            </View>

            <View style={styles.questionCard}>
              <View style={styles.bubbleHeader}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bubbleAuthor}>Você (anônima)</Text>
                  <Text style={styles.bubbleTime}>{q.askedAtFull}</Text>
                </View>
              </View>
              <Text style={styles.bubbleText}>{q.question}</Text>
            </View>

            {q.status === 'pending' ? (
              <View style={styles.pendingCard}>
                <View style={styles.pendingIconWrap}>
                  <Ionicons name="hourglass-outline" size={26} color="#E7A48C" />
                </View>
                <Text style={styles.pendingTitle}>
                  A equipe está analisando sua pergunta
                </Text>
                <Text style={styles.pendingHelper}>
                  Geralmente respondemos em até 24 horas. Você receberá uma
                  notificação assim que houver resposta.
                </Text>
                <View style={styles.pendingTimer}>
                  <Ionicons name="time-outline" size={14} color="#C56682" />
                  <Text style={styles.pendingTimerText}>
                    Enviada {q.askedAt}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.answerCard}>
                <View style={styles.bubbleHeader}>
                  <View style={styles.proAvatar}>
                    <Ionicons name="medkit" size={16} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bubbleAuthor}>{q.answer.author}</Text>
                    <Text style={styles.bubbleTime}>
                      {q.answer.role} · {q.answer.respondedAtFull}
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#C56682" />
                  </View>
                </View>
                <Text style={styles.answerText}>{q.answer.text}</Text>

                <View style={styles.feedbackRow}>
                  <Text style={styles.feedbackLabel}>
                    A resposta te ajudou?
                  </Text>
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="thumbs-up-outline" size={16} color="#C56682" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="thumbs-down-outline" size={16} color="#C56682" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.newQuestionLink}
              activeOpacity={0.85}
              onPress={() => router.replace('/e-normal-isso/nova')}
            >
              <Ionicons name="add-circle-outline" size={18} color="#C43A4A" />
              <Text style={styles.newQuestionLinkText}>Fazer outra pergunta</Text>
            </TouchableOpacity>

            <View style={styles.disclaimer}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#6B6B6B"
              />
              <Text style={styles.disclaimerText}>
                A resposta é orientativa e não substitui consulta presencial.
                Em caso de dúvida, procure a UBS mais próxima.
              </Text>
            </View>
          </ScrollView>
        )}
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
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 200,
    height: 200,
    top: -80,
    right: -80,
    backgroundColor: '#FBD9E5',
    opacity: 0.4,
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
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(197, 102, 130, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(231, 164, 140, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E7A48C',
  },
  pendingText: {
    fontSize: 11,
    color: '#C43A4A',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#C56682',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  answeredText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleAuthor: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  bubbleTime: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
  },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(197, 102, 130, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    fontSize: 15,
    color: '#1F1F1F',
    lineHeight: 22,
  },
  pendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(231, 164, 140, 0.3)',
  },
  pendingIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(231, 164, 140, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pendingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 6,
  },
  pendingHelper: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  pendingTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pendingTimerText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '700',
  },
  answerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 21,
    marginBottom: 18,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 31, 31, 0.05)',
  },
  feedbackLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newQuestionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(196, 58, 74, 0.18)',
    marginBottom: 16,
  },
  newQuestionLinkText: {
    fontSize: 13,
    color: '#C43A4A',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 6,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  notFoundIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  notFoundText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
  },
});
