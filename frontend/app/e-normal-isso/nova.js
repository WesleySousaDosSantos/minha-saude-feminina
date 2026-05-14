import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CHAT_CATEGORIES } from '../../lib/chat';

const MAX_LENGTH = 500;

export default function NovaPergunta() {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState('');
  const [sent, setSent] = useState(false);

  const trimmedLength = question.trim().length;
  const canSend = !!category && trimmedLength >= 10 && trimmedLength <= MAX_LENGTH;

  const goBack = () => {
    if (sent) {
      router.back();
      return;
    }
    if (category || question.trim().length > 0) {
      Alert.alert(
        'Descartar pergunta?',
        'Sua pergunta ainda não foi enviada.',
        [
          { text: 'Continuar', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconButton} onPress={goBack} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova pergunta</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        {sent ? (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={42} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Pergunta enviada</Text>
            <Text style={styles.successText}>
              Sua pergunta chegou à equipe da UBS. Vamos te avisar por
              notificação assim que tivermos uma resposta — geralmente em até
              24 horas.
            </Text>

            <View style={styles.anonymityCard}>
              <Ionicons name="shield-checkmark" size={20} color="#C56682" />
              <Text style={styles.anonymityText}>
                Lembre-se: sua identidade é confidencial. A equipe vê apenas o
                conteúdo da sua pergunta.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => router.replace('/e-normal-isso')}
            >
              <Text style={styles.primaryButtonText}>Voltar para minhas perguntas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.kav}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.anonymityBanner}>
                <Ionicons name="shield-checkmark" size={18} color="#C56682" />
                <Text style={styles.anonymityBannerText}>
                  Sua pergunta é totalmente anônima
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Sobre o que é sua dúvida?</Text>
              <Text style={styles.sectionHelper}>
                Escolha uma categoria para a equipe encaminhar para o
                profissional certo
              </Text>
              <View style={styles.categoriesGrid}>
                {CHAT_CATEGORIES.map((c) => {
                  const active = category === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.categoryCard,
                        active && styles.categoryCardActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setCategory(c.id)}
                    >
                      <Ionicons
                        name={c.icon}
                        size={20}
                        color={active ? '#FFFFFF' : '#C56682'}
                      />
                      <Text
                        style={[
                          styles.categoryCardLabel,
                          active && styles.categoryCardLabelActive,
                        ]}
                      >
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.sectionTitle}>Sua pergunta</Text>
              <Text style={styles.sectionHelper}>
                Seja o mais clara que puder. Quanto mais contexto, melhor a
                resposta.
              </Text>

              <View style={styles.textareaWrap}>
                <TextInput
                  style={styles.textarea}
                  placeholder="Ex: Meu ciclo veio com 35 dias esse mês, normalmente é 28. Devo me preocupar?"
                  placeholderTextColor="#9E9E9E"
                  multiline
                  value={question}
                  onChangeText={(t) => {
                    if (t.length <= MAX_LENGTH) setQuestion(t);
                  }}
                  textAlignVertical="top"
                  autoFocus
                />
                <View style={styles.textareaFooter}>
                  <View style={styles.tipRow}>
                    <Ionicons
                      name="information-circle-outline"
                      size={13}
                      color="#9E9E9E"
                    />
                    <Text style={styles.tipText}>
                      Mínimo de 10 caracteres
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.counter,
                      trimmedLength > MAX_LENGTH - 50 && styles.counterWarn,
                    ]}
                  >
                    {trimmedLength}/{MAX_LENGTH}
                  </Text>
                </View>
              </View>

              <View style={styles.guidelinesCard}>
                <Text style={styles.guidelinesTitle}>Boas práticas</Text>
                <View style={styles.guideline}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Descreva sintomas com detalhes (cor, cheiro, intensidade)
                  </Text>
                </View>
                <View style={styles.guideline}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Mencione há quanto tempo está acontecendo
                  </Text>
                </View>
                <View style={styles.guideline}>
                  <View style={styles.guidelineDot} />
                  <Text style={styles.guidelineText}>
                    Em emergências, ligue 192 (SAMU) ou procure a UBS
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !canSend && styles.sendButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={!canSend}
                onPress={handleSend}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
                <Text style={styles.sendButtonText}>Enviar pergunta</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
  kav: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 220,
    height: 220,
    top: -80,
    right: -80,
    backgroundColor: '#FBD9E5',
    opacity: 0.4,
  },
  blobBottom: {
    width: 180,
    height: 180,
    bottom: -80,
    left: -70,
    backgroundColor: '#FBD9E5',
    opacity: 0.3,
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
    paddingTop: 8,
  },
  anonymityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  anonymityBannerText: {
    fontSize: 12,
    color: '#C56682',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  sectionHelper: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 12,
    lineHeight: 17,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  categoryCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  categoryCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  categoryCardLabelActive: {
    color: '#FFFFFF',
  },
  textareaWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
    marginBottom: 16,
  },
  textarea: {
    fontSize: 15,
    color: '#1F1F1F',
    minHeight: 130,
    lineHeight: 22,
  },
  textareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 31, 31, 0.05)',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipText: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  counter: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '700',
  },
  counterWarn: {
    color: '#C43A4A',
  },
  guidelinesCard: {
    backgroundColor: 'rgba(231, 164, 140, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 3,
  },
  guidelineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C56682',
    marginTop: 7,
  },
  guidelineText: {
    flex: 1,
    fontSize: 12,
    color: '#1F1F1F',
    lineHeight: 17,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C43A4A',
    height: 56,
    borderRadius: 14,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0BFC8',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#C56682',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  successText: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  anonymityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 28,
  },
  anonymityText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#C56682',
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
