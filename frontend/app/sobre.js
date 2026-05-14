import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Sobre() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Sobre</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="heart" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>Minha Saúde Feminina</Text>
            <Text style={styles.tagline}>
              Cuidar da sua saúde é um ato de amor-próprio
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Versão 1.0.0</Text>
            </View>
          </View>

          <Section title="Nossa missão">
            <Paragraph>
              Levar informação acolhedora e gratuita sobre saúde feminina para
              mulheres atendidas na rede pública de saúde, ajudando a entender
              o próprio corpo, acompanhar o ciclo e identificar quando procurar
              atendimento.
            </Paragraph>
            <Paragraph>
              O app é institucional, sem fins lucrativos, e seu conteúdo é
              validado por profissionais da área da saúde.
            </Paragraph>
          </Section>

          <Section title="Parceria UNIFEBE × UBS">
            <Paragraph>
              Este aplicativo nasceu de uma parceria entre os cursos de Medicina
              e Sistemas de Informação do Centro Universitário de Brusque
              (UNIFEBE) com a rede de Unidades Básicas de Saúde.
            </Paragraph>
            <Paragraph>
              A equipe de Medicina é responsável pela validação clínica dos
              conteúdos, e a equipe de Sistemas pelo desenvolvimento e
              manutenção da plataforma.
            </Paragraph>

            <View style={styles.partnersRow}>
              <View style={styles.partnerCard}>
                <View style={[styles.partnerIcon, { backgroundColor: '#FBD9E5' }]}>
                  <Ionicons name="medkit" size={22} color="#C43A4A" />
                </View>
                <Text style={styles.partnerLabel}>Medicina</Text>
                <Text style={styles.partnerSub}>Validação clínica</Text>
              </View>
              <View style={styles.partnerCard}>
                <View
                  style={[
                    styles.partnerIcon,
                    { backgroundColor: 'rgba(197, 102, 130, 0.18)' },
                  ]}
                >
                  <Ionicons name="code-slash" size={22} color="#C56682" />
                </View>
                <Text style={styles.partnerLabel}>Sistemas</Text>
                <Text style={styles.partnerSub}>Desenvolvimento</Text>
              </View>
              <View style={styles.partnerCard}>
                <View
                  style={[
                    styles.partnerIcon,
                    { backgroundColor: 'rgba(231, 164, 140, 0.25)' },
                  ]}
                >
                  <Ionicons name="business" size={22} color="#E7A48C" />
                </View>
                <Text style={styles.partnerLabel}>UBS</Text>
                <Text style={styles.partnerSub}>Atendimento</Text>
              </View>
            </View>
          </Section>

          <Section title="O que o app faz">
            <Bullet>
              Acompanha seu ciclo menstrual e prevê os próximos períodos
            </Bullet>
            <Bullet>
              Permite registrar sintomas, humor, fluxo, cólica e corrimento
            </Bullet>
            <Bullet>
              Reúne dúvidas frequentes respondidas por profissionais da saúde
            </Bullet>
            <Bullet>
              Oferece biblioteca de conteúdos educativos validados pela UNIFEBE
            </Bullet>
            <Bullet>
              Disponibiliza telefones de apoio em casos de violência, emergência
              e suporte emocional
            </Bullet>
          </Section>

          <Section title="O que o app NÃO faz">
            <Paragraph>
              Este aplicativo não substitui consulta médica. Em caso de
              sintomas persistentes, fortes ou de emergência, procure a UBS
              mais próxima ou ligue 192 (SAMU).
            </Paragraph>
          </Section>

          <View style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail" size={20} color="#C43A4A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>Contato</Text>
              <Text style={styles.contactText}>
                Sugestões ou problemas? Fale com a equipe.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.contactButton}
              activeOpacity={0.85}
              onPress={() => Linking.openURL('mailto:saude.feminina@unifebe.edu.br')}
            >
              <Text style={styles.contactButtonText}>Enviar email</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signature}>
            <View style={styles.signatureDot} />
            <Text style={styles.signatureText}>
              Projeto institucional · UNIFEBE 2026
            </Text>
            <View style={styles.signatureDot} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{children}</Text>
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
    height: 280,
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
  heroSection: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 26,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: '#6B6B6B',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 14,
  },
  versionBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  versionText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 22,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  paragraph: {
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 21,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C56682',
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 21,
  },
  partnersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  partnerCard: {
    flex: 1,
    backgroundColor: '#FBF4EB',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  partnerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  partnerLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  partnerSub: {
    fontSize: 10,
    color: '#6B6B6B',
    fontWeight: '600',
    marginTop: 1,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 22,
    padding: 14,
    marginTop: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#C43A4A',
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  contactText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 1,
  },
  contactButton: {
    backgroundColor: '#C56682',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  signature: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
  },
  signatureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C56682',
    opacity: 0.5,
  },
  signatureText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
