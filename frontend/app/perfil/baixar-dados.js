import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
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

const FORMATS = [
  {
    id: 'pdf',
    label: 'PDF',
    helper: 'Leitura fácil, ideal para imprimir',
    icon: 'document-text',
  },
  {
    id: 'json',
    label: 'JSON',
    helper: 'Formato estruturado para importar em outro app',
    icon: 'code-slash',
  },
];

const SECTIONS = [
  {
    id: 'profile',
    label: 'Dados de cadastro',
    helper: 'Nome, email, telefone e data de nascimento',
    icon: 'person',
    iconColor: '#C43A4A',
    iconBg: '#FBD9E5',
  },
  {
    id: 'cycle',
    label: 'Dados do ciclo',
    helper: 'Configurações e histórico do ciclo',
    icon: 'water',
    iconColor: '#C43A4A',
    iconBg: '#FBD9E5',
  },
  {
    id: 'registros',
    label: 'Registros diários',
    helper: 'Sintomas, humor, fluxo, anotações',
    icon: 'document-text',
    iconColor: '#C56682',
    iconBg: 'rgba(197, 102, 130, 0.18)',
  },
  {
    id: 'lembretes',
    label: 'Lembretes',
    helper: 'Lembretes ativos e histórico',
    icon: 'alarm',
    iconColor: '#E7A48C',
    iconBg: 'rgba(231, 164, 140, 0.25)',
  },
];

export default function BaixarDados() {
  const router = useRouter();
  const { user } = useAuth();
  const cycleQuery = useCycleQuery();
  const registrosQuery = useRegistrosQuery();
  const lembretesQuery = useLembretesQuery();
  const [format, setFormat] = useState('json');
  const [includes, setIncludes] = useState({
    profile: true,
    cycle: true,
    registros: true,
    lembretes: true,
  });
  const [generating, setGenerating] = useState(false);

  const toggle = (id) => {
    setIncludes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (value) => {
    setIncludes({
      profile: value,
      cycle: value,
      registros: value,
      lembretes: value,
    });
  };

  const allOn = Object.values(includes).every(Boolean);
  const someOn = Object.values(includes).some(Boolean);

  const handleGenerate = async () => {
    if (!someOn || generating) return;
    setGenerating(true);
    try {
      const payload = {
        exportadoEm: new Date().toISOString(),
        formato: format,
      };
      if (includes.profile && user) {
        payload.cadastro = {
          nome: user.name,
          email: user.email,
          telefone: user.phone || null,
          dataNascimento: user.birthDate || null,
          criadoEm: user.createdAt || null,
        };
      }
      if (includes.cycle && cycleQuery.data) {
        payload.ciclo = cycleQuery.data;
      }
      if (includes.registros) {
        payload.registros = registrosQuery.data || [];
      }
      if (includes.lembretes) {
        payload.lembretes = lembretesQuery.data || [];
      }

      const content = JSON.stringify(payload, null, 2);
      await Share.share({
        title: `Meus dados — Minha Saúde Feminina (${format.toUpperCase()})`,
        message: content,
      });
    } catch (err) {
      Alert.alert(
        'Não foi possível gerar',
        err?.message || 'Tente novamente em instantes.'
      );
    } finally {
      setGenerating(false);
    }
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
          <Text style={styles.headerTitle}>Baixar meus dados</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons name="download" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.introTitle}>Sua cópia pessoal</Text>
            <Text style={styles.introSubtitle}>
              Conforme a LGPD, você tem direito a uma cópia dos seus dados em
              formato legível. Escolha o que quer incluir.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Formato do arquivo</Text>
          <View style={styles.formatRow}>
            {FORMATS.map((f) => {
              const active = format === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.formatCard, active && styles.formatCardActive]}
                  activeOpacity={0.85}
                  onPress={() => setFormat(f.id)}
                >
                  <Ionicons
                    name={f.icon}
                    size={22}
                    color={active ? '#FFFFFF' : '#C56682'}
                  />
                  <Text
                    style={[styles.formatLabel, active && styles.formatLabelActive]}
                  >
                    {f.label}
                  </Text>
                  <Text
                    style={[styles.formatHelper, active && styles.formatHelperActive]}
                  >
                    {f.helper}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.includeHeader}>
            <Text style={styles.sectionLabel}>O que incluir</Text>
            <TouchableOpacity
              onPress={() => toggleAll(!allOn)}
              hitSlop={8}
            >
              <Text style={styles.toggleAllText}>
                {allOn ? 'Desmarcar todos' : 'Marcar todos'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionsList}>
            {SECTIONS.map((s) => (
              <View key={s.id} style={styles.sectionCard}>
                <View style={[styles.sectionIcon, { backgroundColor: s.iconBg }]}>
                  <Ionicons name={s.icon} size={18} color={s.iconColor} />
                </View>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>{s.label}</Text>
                  <Text style={styles.sectionHelper}>{s.helper}</Text>
                </View>
                <Switch
                  value={includes[s.id]}
                  onValueChange={() => toggle(s.id)}
                  trackColor={{ false: '#E0BFC8', true: '#C56682' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </View>

          <View style={styles.lgpdCard}>
            <Ionicons name="lock-closed" size={16} color="#C56682" />
            <Text style={styles.lgpdText}>
              O arquivo é gerado com criptografia. Ninguém além de você tem
              acesso ao conteúdo.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              (!someOn || generating) && styles.generateButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!someOn || generating}
            onPress={handleGenerate}
          >
            {generating ? (
              <>
                <View style={styles.spinner} />
                <Text style={styles.generateButtonText}>Gerando arquivo...</Text>
              </>
            ) : (
              <>
                <Ionicons name="download" size={20} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>
                  Gerar {format.toUpperCase()}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            O arquivo será gerado em alguns segundos e ficará disponível para
            salvar ou compartilhar.
          </Text>
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
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  introTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  formatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  formatCardActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
    shadowColor: '#C56682',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  formatLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginTop: 2,
  },
  formatLabelActive: {
    color: '#FFFFFF',
  },
  formatHelper: {
    fontSize: 10,
    color: '#6B6B6B',
    textAlign: 'center',
    fontWeight: '600',
  },
  formatHelperActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  includeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  toggleAllText: {
    fontSize: 12,
    color: '#C43A4A',
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionsList: {
    gap: 8,
    marginBottom: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  sectionHelper: {
    fontSize: 11,
    color: '#6B6B6B',
    marginTop: 2,
  },
  lgpdCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(197, 102, 130, 0.08)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  lgpdText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#C43A4A',
    height: 56,
    borderRadius: 14,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#E0BFC8',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderTopColor: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 11,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});
