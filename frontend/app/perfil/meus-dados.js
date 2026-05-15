import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import {
  useCycleQuery,
  useLembretesQuery,
  useRegistrosQuery,
} from '../../services/queries';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

function formatDateLong(iso) {
  if (!iso) return 'Não informado';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Não informado';
  return `${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
}

function buildSections({ user, cycle, registros, lembretes }) {
  const symptomsCount = (registros || []).reduce(
    (acc, r) => acc + (r.symptoms?.length || 0),
    0
  );
  const moodCount = (registros || []).filter((r) => !!r.mood).length;
  const flowCount = (registros || []).filter((r) => !!r.flow).length;
  const notesCount = (registros || []).filter(
    (r) => r.notes && r.notes.trim()
  ).length;
  const firstRegistro = (registros || []).reduce((acc, r) => {
    if (!acc) return r.date;
    return r.date < acc ? r.date : acc;
  }, null);

  const activeReminders = (lembretes || []).filter((l) => !l.completed).length;
  const completedReminders = (lembretes || []).filter(
    (l) => l.completed
  ).length;

  return [
    {
      id: 'profile',
      icon: 'person',
      iconColor: '#C43A4A',
      iconBg: '#FBD9E5',
      title: 'Dados de cadastro',
      helper: 'Informações fornecidas no seu perfil',
      items: [
        { label: 'Nome completo', value: user?.name || 'Não informado' },
        { label: 'Email', value: user?.email || 'Não informado' },
        { label: 'Telefone', value: user?.phone || 'Não informado' },
        { label: 'Data de nascimento', value: formatDateLong(user?.birthDate) },
        { label: 'Conta criada em', value: formatDateLong(user?.createdAt) },
      ],
    },
    {
      id: 'cycle',
      icon: 'water',
      iconColor: '#C43A4A',
      iconBg: '#FBD9E5',
      title: 'Dados do ciclo',
      helper: 'Configurações usadas para previsão',
      items: [
        {
          label: 'Última menstruação',
          value: cycle ? formatDateLong(cycle.lastPeriodStart) : 'Não configurado',
        },
        {
          label: 'Duração média do ciclo',
          value: cycle ? `${cycle.cycleDuration} dias` : '—',
        },
        {
          label: 'Duração da menstruação',
          value: cycle ? `${cycle.periodDuration} dias` : '—',
        },
      ],
    },
    {
      id: 'registros',
      icon: 'document-text',
      iconColor: '#C56682',
      iconBg: 'rgba(197, 102, 130, 0.18)',
      title: 'Registros diários',
      helper: 'Sintomas, humor, fluxo e anotações',
      items: [
        {
          label: 'Total de registros',
          value: `${registros?.length || 0} entradas`,
        },
        { label: 'Sintomas registrados', value: `${symptomsCount} ocorrências` },
        { label: 'Humor registrado', value: `${moodCount} entradas` },
        { label: 'Fluxo registrado', value: `${flowCount} dias` },
        { label: 'Anotações livres', value: `${notesCount} textos` },
        {
          label: 'Primeiro registro',
          value: firstRegistro ? formatDateLong(firstRegistro) : 'Nenhum ainda',
        },
      ],
    },
    {
      id: 'lembretes',
      icon: 'alarm',
      iconColor: '#E7A48C',
      iconBg: 'rgba(231, 164, 140, 0.25)',
      title: 'Lembretes',
      helper: 'Notificações que você configurou',
      items: [
        { label: 'Lembretes ativos', value: String(activeReminders) },
        { label: 'Lembretes concluídos', value: String(completedReminders) },
        {
          label: 'Total cadastrados',
          value: String(lembretes?.length || 0),
        },
      ],
    },
    {
      id: 'technical',
      icon: 'hardware-chip',
      iconColor: '#6B6B6B',
      iconBg: 'rgba(107, 107, 107, 0.12)',
      title: 'Dados técnicos',
      helper: 'Necessários para o funcionamento',
      items: [
        { label: 'Versão do app', value: '1.0.0' },
        { label: 'Plataforma', value: Platform.OS },
        { label: 'Identificador da conta', value: user?.id || '—' },
      ],
    },
  ];
}

export default function MeusDados() {
  const router = useRouter();
  const { user } = useAuth();
  const cycleQuery = useCycleQuery();
  const registrosQuery = useRegistrosQuery();
  const lembretesQuery = useLembretesQuery();
  const [expanded, setExpanded] = useState('profile');

  const SECTIONS = useMemo(
    () =>
      buildSections({
        user,
        cycle: cycleQuery.data,
        registros: registrosQuery.data,
        lembretes: lembretesQuery.data,
      }),
    [user, cycleQuery.data, registrosQuery.data, lembretesQuery.data]
  );

  const toggle = (id) => {
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
    });
    setExpanded(expanded === id ? null : id);
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
          <Text style={styles.headerTitle}>Meus dados</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.introTitle}>Tudo que guardamos sobre você</Text>
            <Text style={styles.introSubtitle}>
              Conforme a LGPD, você tem direito a ver tudo que está salvo.
              Toque numa categoria para expandir.
            </Text>
          </View>

          <View style={styles.list}>
            {SECTIONS.map((s) => {
              const isOpen = expanded === s.id;
              return (
                <View key={s.id} style={styles.card}>
                  <TouchableOpacity
                    style={styles.cardHeader}
                    activeOpacity={0.7}
                    onPress={() => toggle(s.id)}
                  >
                    <View style={[styles.cardIcon, { backgroundColor: s.iconBg }]}>
                      <Ionicons name={s.icon} size={18} color={s.iconColor} />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.cardTitle}>{s.title}</Text>
                      <Text style={styles.cardHelper}>{s.helper}</Text>
                    </View>
                    <View style={styles.cardCount}>
                      <Text style={styles.cardCountText}>{s.items.length}</Text>
                    </View>
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#9E9E9E"
                    />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.cardBody}>
                      <View style={styles.divider} />
                      {s.items.map((item, i) => (
                        <View key={i} style={styles.itemRow}>
                          <Text style={styles.itemLabel}>{item.label}</Text>
                          <Text style={styles.itemValue} numberOfLines={2}>
                            {item.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.downloadCard}
            activeOpacity={0.85}
            onPress={() => router.push('/perfil/baixar-dados')}
          >
            <View style={styles.downloadIcon}>
              <Ionicons name="download" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.downloadTitle}>Quer levar com você?</Text>
              <Text style={styles.downloadHelper}>
                Baixe uma cópia de todos os seus dados
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.lgpdCard}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#C56682" />
            <Text style={styles.lgpdText}>
              Esses dados são confidenciais e usados apenas para o seu
              acompanhamento. Em caso de dúvidas, entre em contato com{' '}
              <Text style={styles.lgpdEmail}>dpo@unifebe.edu.br</Text>.
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
    paddingBottom: 32,
  },
  intro: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 14,
    paddingBottom: 22,
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
  },
  list: {
    paddingHorizontal: 22,
    gap: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  cardHelper: {
    fontSize: 11,
    color: '#6B6B6B',
    marginTop: 1,
  },
  cardCount: {
    backgroundColor: 'rgba(197, 102, 130, 0.12)',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  cardCountText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.05)',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    gap: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  itemValue: {
    flex: 1.2,
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '700',
    textAlign: 'right',
  },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#C43A4A',
    borderRadius: 16,
    marginHorizontal: 22,
    marginTop: 18,
    padding: 14,
    paddingRight: 18,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  downloadIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  downloadHelper: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  lgpdCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(197, 102, 130, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 22,
    marginTop: 16,
  },
  lgpdText: {
    flex: 1,
    fontSize: 12,
    color: '#1F1F1F',
    lineHeight: 18,
  },
  lgpdEmail: {
    color: '#C43A4A',
    fontWeight: '800',
  },
});
