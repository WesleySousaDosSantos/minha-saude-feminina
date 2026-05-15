import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import { useCycleQuery } from '../../services/queries';
import {
  dayOfCycle,
  formatStartDate,
  getInitials,
} from '../../lib/cycle';

const SUPPORT_PHONES = [
  {
    number: '180',
    label: 'Central de Atendimento à Mulher',
    helper: 'Violência, denúncia e orientação',
    icon: 'shield-checkmark',
    tint: '#FBD9E5',
    iconColor: '#C43A4A',
  },
  {
    number: '188',
    label: 'CVV',
    helper: 'Apoio emocional, 24 horas',
    icon: 'heart',
    tint: 'rgba(197, 102, 130, 0.18)',
    iconColor: '#C56682',
  },
  {
    number: '136',
    label: 'Disque Saúde',
    helper: 'Informações sobre o SUS',
    icon: 'medkit',
    tint: 'rgba(231, 164, 140, 0.25)',
    iconColor: '#E7A48C',
  },
  {
    number: '192',
    label: 'SAMU',
    helper: 'Emergência médica',
    icon: 'alert-circle',
    tint: 'rgba(196, 58, 74, 0.12)',
    iconColor: '#C43A4A',
  },
];

export default function Perfil() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const cycleQuery = useCycleQuery();
  const [notifications, setNotifications] = useState(true);
  const [periodReminders, setPeriodReminders] = useState(true);

  const userName = user?.name || 'Usuária';
  const userEmail = user?.email || '';
  const initials = getInitials(user?.name);
  const cycle = cycleQuery.data;
  const cycleDay = cycle
    ? dayOfCycle(cycle.lastPeriodStart, cycle.cycleDuration)
    : null;
  const cycleStartLabel = cycle ? formatStartDate(cycle.lastPeriodStart) : null;

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleCall = (phone) => {
    Alert.alert(
      `Ligar para ${phone.number}`,
      `${phone.label}\n${phone.helper}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => Linking.openURL(`tel:${phone.number}`),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerBg} />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.85}
              onPress={() => router.push('/perfil/editar')}
            >
              <Ionicons name="create-outline" size={14} color="#C43A4A" />
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cycleCard}>
            <View style={styles.cycleHeader}>
              <View style={styles.cycleIcon}>
                <Ionicons name="water" size={18} color="#C43A4A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cycleTitle}>Meu ciclo</Text>
                <Text style={styles.cycleSubtitle}>Configurações atuais</Text>
              </View>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => router.push('/perfil/ciclo')}
              >
                <Ionicons name="create-outline" size={18} color="#C56682" />
              </TouchableOpacity>
            </View>

            <View style={styles.cycleStats}>
              <View style={styles.cycleStat}>
                <Text style={styles.cycleStatValue}>{cycleDay ?? '—'}</Text>
                <Text style={styles.cycleStatLabel}>Dia atual</Text>
              </View>
              <View style={styles.cycleDivider} />
              <View style={styles.cycleStat}>
                <Text style={styles.cycleStatValue}>
                  {cycle?.cycleDuration ?? '—'}
                </Text>
                <Text style={styles.cycleStatLabel}>Duração</Text>
              </View>
              <View style={styles.cycleDivider} />
              <View style={styles.cycleStat}>
                <Text style={styles.cycleStatValue}>
                  {cycle?.periodDuration ?? '—'}
                </Text>
                <Text style={styles.cycleStatLabel}>Menstruação</Text>
              </View>
            </View>

            <View style={styles.cycleStartRow}>
              <Ionicons name="calendar-outline" size={14} color="#6B6B6B" />
              <Text style={styles.cycleStartText}>
                {cycleStartLabel
                  ? `Último ciclo iniciado em ${cycleStartLabel}`
                  : 'Configure seu ciclo para acompanhar'}
              </Text>
            </View>
          </View>

          <SectionHeader title="Conta" />
          <View style={styles.menuGroup}>
            <MenuRow
              icon="person-outline"
              tint="#FBD9E5"
              iconColor="#C43A4A"
              label="Dados pessoais"
              onPress={() => router.push('/perfil/editar')}
            />
            <MenuDivider />
            <MenuRow
              icon="alarm-outline"
              tint="rgba(231, 164, 140, 0.25)"
              iconColor="#E7A48C"
              label="Meus lembretes"
              helper="Medicação, consultas, exames"
              onPress={() => router.push('/lembretes')}
            />
            <MenuDivider />
            <MenuToggleRow
              icon="notifications-outline"
              tint="rgba(197, 102, 130, 0.18)"
              iconColor="#C56682"
              label="Notificações"
              helper="Lembretes e atualizações"
              value={notifications}
              onValueChange={setNotifications}
            />
            <MenuDivider />
            <MenuToggleRow
              icon="water-outline"
              tint="rgba(231, 164, 140, 0.22)"
              iconColor="#E7A48C"
              label="Lembrete de menstruação"
              helper="Avisar quando estiver próxima"
              value={periodReminders}
              onValueChange={setPeriodReminders}
            />
          </View>

          <SectionHeader title="Privacidade" />
          <View style={styles.menuGroup}>
            <MenuRow
              icon="shield-checkmark-outline"
              tint="rgba(197, 102, 130, 0.18)"
              iconColor="#C56682"
              label="Meus dados"
              helper="Visualizar tudo que está salvo"
              onPress={() => router.push('/perfil/meus-dados')}
            />
            <MenuDivider />
            <MenuRow
              icon="download-outline"
              tint="rgba(231, 164, 140, 0.22)"
              iconColor="#E7A48C"
              label="Baixar meus dados"
              helper="Conforme a LGPD"
              onPress={() => router.push('/perfil/baixar-dados')}
            />
          </View>

          <View style={styles.supportHeader}>
            <SectionHeader title="Telefones de apoio" />
            <Text style={styles.supportHint}>Toque para ligar</Text>
          </View>
          <View style={styles.supportGroup}>
            {SUPPORT_PHONES.map((phone, index) => (
              <View key={phone.number}>
                {index > 0 && <MenuDivider />}
                <TouchableOpacity
                  style={styles.supportRow}
                  activeOpacity={0.7}
                  onPress={() => handleCall(phone)}
                >
                  <View style={[styles.supportIcon, { backgroundColor: phone.tint }]}>
                    <Ionicons name={phone.icon} size={20} color={phone.iconColor} />
                  </View>
                  <View style={styles.supportContent}>
                    <View style={styles.supportNumberRow}>
                      <Text style={styles.supportNumber}>{phone.number}</Text>
                      <Text style={styles.supportLabel}>{phone.label}</Text>
                    </View>
                    <Text style={styles.supportHelper}>{phone.helper}</Text>
                  </View>
                  <View style={styles.callButton}>
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <SectionHeader title="Sobre o app" />
          <View style={styles.menuGroup}>
            <MenuRow
              icon="information-circle-outline"
              tint="#FBD9E5"
              iconColor="#C43A4A"
              label="Sobre o Minha Saúde Feminina"
              onPress={() => router.push('/sobre')}
            />
            <MenuDivider />
            <MenuRow
              icon="document-text-outline"
              tint="rgba(197, 102, 130, 0.18)"
              iconColor="#C56682"
              label="Política de privacidade"
              onPress={() => router.push('/politica-privacidade')}
            />
            <MenuDivider />
            <MenuRow
              icon="reader-outline"
              tint="rgba(231, 164, 140, 0.22)"
              iconColor="#E7A48C"
              label="Termos de uso"
              onPress={() => router.push('/termos-uso')}
            />
            <MenuDivider />
            <MenuRow
              icon="medkit-outline"
              tint="#FBF4EB"
              iconColor="#1F1F1F"
              label="Encontrar uma UBS"
              helper="Atendimento gratuito perto de você"
              onPress={() => router.push('/perfil/ubs')}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#C43A4A" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Versão 1.0.0</Text>

          <View style={styles.partnership}>
            <View style={styles.partnershipDot} />
            <Text style={styles.partnershipText}>
              Projeto institucional UNIFEBE
            </Text>
            <View style={styles.partnershipDot} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function MenuRow({ icon, tint, iconColor, label, helper, onPress, danger }) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
          {label}
        </Text>
        {helper && <Text style={styles.menuHelper}>{helper}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
    </TouchableOpacity>
  );
}

function MenuToggleRow({
  icon,
  tint,
  iconColor,
  label,
  helper,
  value,
  onValueChange,
}) {
  return (
    <View style={styles.menuRow}>
      <View style={[styles.menuIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        {helper && <Text style={styles.menuHelper}>{helper}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0BFC8', true: '#C56682' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function MenuDivider() {
  return <View style={styles.menuDivider} />;
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
    width: 160,
    height: 160,
    top: -50,
    right: -50,
    backgroundColor: '#FBF4EB',
    opacity: 0.55,
  },
  blobBottom: {
    width: 140,
    height: 140,
    top: 140,
    left: -60,
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
  },
  scroll: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 22,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 2,
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#C56682',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 12,
    color: '#C43A4A',
    fontWeight: '700',
  },
  cycleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 22,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#C56682',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 5,
  },
  cycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cycleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  cycleSubtitle: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
  },
  cycleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF4EB',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  cycleStat: {
    flex: 1,
    alignItems: 'center',
  },
  cycleDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(197, 102, 130, 0.18)',
  },
  cycleStatValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 25,
  },
  cycleStatLabel: {
    fontSize: 10,
    color: '#6B6B6B',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  cycleStartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  cycleStartText: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  sectionHeader: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 22,
    overflow: 'hidden',
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  menuLabelDanger: {
    color: '#C43A4A',
  },
  menuHelper: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.05)',
    marginLeft: 60,
  },
  supportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 22,
  },
  supportHint: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '700',
    paddingBottom: 10,
  },
  supportGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 22,
    overflow: 'hidden',
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportContent: {
    flex: 1,
  },
  supportNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  supportNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#C43A4A',
    letterSpacing: 0.5,
  },
  supportLabel: {
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '700',
    flex: 1,
  },
  supportHelper: {
    fontSize: 11,
    color: '#6B6B6B',
    marginTop: 1,
  },
  callButton: {
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 22,
    marginTop: 24,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(196, 58, 74, 0.2)',
  },
  logoutText: {
    fontSize: 14,
    color: '#C43A4A',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  version: {
    fontSize: 11,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '600',
  },
  partnership: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  partnershipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C56682',
    opacity: 0.5,
  },
  partnershipText: {
    fontSize: 10,
    color: '#9E9E9E',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
