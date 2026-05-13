import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const moods = [
  { id: 'happy', icon: 'happy-outline', label: 'Bem' },
  { id: 'neutral', icon: 'remove-circle-outline', label: 'Normal' },
  { id: 'sad', icon: 'sad-outline', label: 'Triste' },
  { id: 'tired', icon: 'bed-outline', label: 'Cansada' },
];

export default function Hoje() {
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
            <View>
              <Text style={styles.greeting}>Olá, Maria</Text>
              <Text style={styles.subGreeting}>Como você está hoje?</Text>
            </View>
            <TouchableOpacity style={styles.avatar} activeOpacity={0.7}>
              <Ionicons name="person" size={22} color="#C56682" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#E7A48C', '#FBD9E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroBlobInside1} />
              <View style={styles.heroBlobInside2} />

              <View style={styles.heroContent}>
                <View style={styles.ringOuter}>
                  <View style={styles.ringInner}>
                    <Text style={styles.ringDayLabel}>DIA</Text>
                    <Text style={styles.ringDayNumber}>14</Text>
                    <Text style={styles.ringTotal}>de 28</Text>
                  </View>
                </View>
                <Text style={styles.heroPhase}>Ovulação</Text>
                <View style={styles.heroBadge}>
                  <Ionicons name="water" size={14} color="#C43A4A" />
                  <Text style={styles.heroBadgeText}>
                    Próxima menstruação em 14 dias
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Como você está se sentindo?</Text>
              <Text style={styles.cardSubtitle}>
                Registre seu humor de hoje
              </Text>
            </View>
            <View style={styles.moodRow}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={styles.moodItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.moodIcon}>
                    <Ionicons name={mood.icon} size={26} color="#C56682" />
                  </View>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="calendar" size={20} color="#C56682" />
              </View>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Ciclos registrados</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FBF4EB' }]}>
                <Ionicons name="heart" size={20} color="#C43A4A" />
              </View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Sintomas hoje</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.contentCard} activeOpacity={0.85}>
            <View style={styles.contentBadge}>
              <Text style={styles.contentBadgeText}>CONTEÚDO DO DIA</Text>
            </View>
            <Text style={styles.contentTitle}>
              Período fértil sem neura: entendendo seu ciclo na prática
            </Text>
            <Text style={styles.contentSummary}>
              Saiba quais são os dias mais férteis e como reconhecer os sinais
              do corpo.
            </Text>
            <View style={styles.contentFooter}>
              <Text style={styles.contentLink}>Ler artigo</Text>
              <Ionicons name="arrow-forward" size={16} color="#C56682" />
            </View>
          </TouchableOpacity>

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B6B6B"
            />
            <Text style={styles.disclaimerText}>
              As informações do app não substituem avaliação médica. Procure
              sempre a UBS.
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
    top: -90,
    right: -80,
    backgroundColor: '#FBF4EB',
    opacity: 0.7,
  },
  blobBottom: {
    width: 200,
    height: 200,
    bottom: 80,
    left: -80,
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 22,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  subGreeting: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#C56682',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  heroGradient: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroBlobInside1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -40,
    right: -40,
    backgroundColor: '#FFFFFF',
    opacity: 0.18,
  },
  heroBlobInside2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -30,
    left: -30,
    backgroundColor: '#FFFFFF',
    opacity: 0.15,
  },
  heroContent: {
    alignItems: 'center',
  },
  ringOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  ringInner: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  ringDayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C56682',
    letterSpacing: 2,
  },
  ringDayNumber: {
    fontSize: 52,
    fontWeight: '900',
    color: '#C43A4A',
    lineHeight: 60,
  },
  ringTotal: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
    marginTop: 2,
  },
  heroPhase: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  moodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '600',
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
    backgroundColor: '#FBD9E5',
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
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  contentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FBD9E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentBadgeText: {
    fontSize: 10,
    color: '#C43A4A',
    fontWeight: '800',
    letterSpacing: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
    lineHeight: 22,
  },
  contentSummary: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 19,
    marginBottom: 12,
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contentLink: {
    fontSize: 14,
    color: '#C56682',
    fontWeight: '700',
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
