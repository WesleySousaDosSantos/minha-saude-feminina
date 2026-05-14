import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const TIPS = [
  {
    icon: 'card-outline',
    text: 'Leve o seu cartão do SUS e um documento com foto',
  },
  {
    icon: 'medkit-outline',
    text: 'Leve a lista de medicamentos que você usa',
  },
  {
    icon: 'phone-portrait-outline',
    text: 'O registro do seu ciclo pelo app pode ser mostrado na consulta',
  },
  {
    icon: 'pricetag-outline',
    text: 'O atendimento é gratuito e confidencial — é seu direito',
  },
];

export default function EncontrarUBS() {
  const router = useRouter();

  const openMap = () => {
    const query = encodeURIComponent('UBS Unidade Básica de Saúde');
    const url = Platform.select({
      ios: `maps://?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) return Linking.openURL(url);
        return Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${query}`
        );
      })
      .catch(() => {
        Alert.alert('Não foi possível abrir o mapa', 'Tente novamente em alguns instantes.');
      });
  };

  const callDisqueSaude = () => {
    Alert.alert(
      'Ligar para 136',
      'Disque Saúde do SUS — orientações, localização de UBS e informações sobre serviços.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => Linking.openURL('tel:136') },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Encontrar uma UBS</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons name="business" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.introTitle}>
              Atendimento gratuito{'\n'}perto de você
            </Text>
            <Text style={styles.introSubtitle}>
              A Unidade Básica de Saúde (UBS) é a porta de entrada do SUS.
              Ginecologia, pré-natal, contraceptivo e exames — tudo gratuito.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryAction}
            activeOpacity={0.9}
            onPress={openMap}
          >
            <View style={styles.primaryActionIcon}>
              <Ionicons name="map" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.primaryActionText}>
              <Text style={styles.primaryActionTitle}>
                Ver UBS no mapa
              </Text>
              <Text style={styles.primaryActionHelper}>
                Abre o app de mapas do seu celular
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            activeOpacity={0.85}
            onPress={callDisqueSaude}
          >
            <View style={styles.secondaryActionIcon}>
              <Ionicons name="call" size={22} color="#C43A4A" />
            </View>
            <View style={styles.secondaryActionText}>
              <View style={styles.numberRow}>
                <Text style={styles.bigNumber}>136</Text>
                <Text style={styles.numberLabel}>Disque Saúde</Text>
              </View>
              <Text style={styles.secondaryActionHelper}>
                Orientações e localização de UBS por telefone
              </Text>
            </View>
            <View style={styles.callBadge}>
              <Ionicons name="call" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.tipsTitle}>Antes de ir, lembre-se</Text>
          <View style={styles.tipsCard}>
            {TIPS.map((tip, i) => (
              <View key={i}>
                <View style={styles.tipRow}>
                  <View style={styles.tipIcon}>
                    <Ionicons name={tip.icon} size={16} color="#C56682" />
                  </View>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
                {i < TIPS.length - 1 && <View style={styles.tipDivider} />}
              </View>
            ))}
          </View>

          <View style={styles.servicesCard}>
            <View style={styles.servicesHeader}>
              <Ionicons name="checkmark-circle" size={18} color="#C56682" />
              <Text style={styles.servicesTitle}>
                O que a UBS oferece para você
              </Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>Consulta ginecológica</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>Pré-natal e acompanhamento da gestação</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>Métodos contraceptivos (pílula, DIU, preservativo)</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>Exames de rotina (papanicolau, beta-HCG)</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>Vacinas (HPV, hepatite, gripe e outras)</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>
                Tratamento de infecções e orientação geral
              </Text>
            </View>
          </View>

          <View style={styles.emergencyCard}>
            <Ionicons name="warning" size={20} color="#C43A4A" />
            <Text style={styles.emergencyText}>
              Em caso de emergência, ligue{' '}
              <Text style={styles.emergencyNumber}>192</Text> (SAMU) ou vá direto
              para uma UPA ou pronto-socorro.
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
    height: 220,
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
  intro: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 22,
  },
  introIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#C56682',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 4,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#C43A4A',
    borderRadius: 18,
    padding: 14,
    paddingRight: 18,
    marginBottom: 10,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 8,
  },
  primaryActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  primaryActionHelper: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
    shadowColor: '#C56682',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  secondaryActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    flex: 1,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  bigNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#C43A4A',
    letterSpacing: 0.5,
  },
  numberLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  secondaryActionHelper: {
    fontSize: 11,
    color: '#6B6B6B',
    marginTop: 2,
  },
  callBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C56682',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 22,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(197, 102, 130, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#1F1F1F',
    lineHeight: 19,
  },
  tipDivider: {
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.05)',
    marginLeft: 44,
  },
  servicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  serviceDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C56682',
    marginTop: 8,
  },
  serviceText: {
    flex: 1,
    fontSize: 13,
    color: '#1F1F1F',
    lineHeight: 19,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(196, 58, 74, 0.08)',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#C43A4A',
  },
  emergencyText: {
    flex: 1,
    fontSize: 12,
    color: '#1F1F1F',
    lineHeight: 18,
  },
  emergencyNumber: {
    color: '#C43A4A',
    fontWeight: '800',
  },
});
