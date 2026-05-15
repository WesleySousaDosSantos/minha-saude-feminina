import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useAuth } from '../../lib/AuthContext';
import { useUpdateMeMutation } from '../../services/queries';
import { parseISODate } from '../../lib/cycle';

function formatBirthDate(date) {
  const months = [
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
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

export default function EditarPerfil() {
  const router = useRouter();
  const { user, patchUser } = useAuth();
  const updateMutation = useUpdateMeMutation();

  const initialBirth = useMemo(
    () => parseISODate(user?.birthDate) || new Date(1995, 0, 1),
    [user?.birthDate]
  );

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [birthDate, setBirthDate] = useState(initialBirth);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [focused, setFocused] = useState(null);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSave = name.trim().length >= 2 && validEmail;

  const dirty =
    name !== (user?.name || '') ||
    phone !== (user?.phone || '') ||
    avatar !== (user?.avatar || null) ||
    birthDate.getTime() !== initialBirth.getTime();

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso às fotos para escolher uma imagem de perfil.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    if (!asset.base64) return;
    const nextAvatar = `data:image/jpeg;base64,${asset.base64}`;
    const previous = avatar;
    setAvatar(nextAvatar);
    updateMutation.mutate(
      { avatar: nextAvatar },
      {
        onSuccess: (updatedUser) => patchUser(updatedUser),
        onError: (err) => {
          setAvatar(previous);
          Alert.alert(
            'Não foi possível salvar a foto',
            err?.message || 'Tente novamente.'
          );
        },
      }
    );
  };

  const goBack = () => {
    if (dirty) {
      Alert.alert(
        'Sair sem salvar?',
        'Você tem alterações que ainda não foram salvas.',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: birthDate,
        mode: 'date',
        maximumDate: new Date(),
        onChange: (_, selected) => {
          if (selected) setBirthDate(selected);
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const handleSave = () => {
    if (!canSave || !dirty || updateMutation.isPending) return;
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      birthDate: birthDate.toISOString(),
    };
    if (avatar !== (user?.avatar || null)) {
      payload.avatar = avatar;
    }
    updateMutation.mutate(payload, {
      onSuccess: (updatedUser) => {
        patchUser(updatedUser);
        Alert.alert('Perfil atualizado', 'Suas informações foram salvas.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (err) =>
        Alert.alert(
          'Não foi possível salvar',
          err?.message || 'Tente novamente.'
        ),
    });
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View style={styles.root}>
      <View style={styles.headerBg} />
      <View style={[styles.blob, styles.blobTop]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconButton} onPress={goBack} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{initials || 'M'}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.avatarEditButton}
                  activeOpacity={0.85}
                  onPress={pickImage}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarHelper}>Toque na câmera para alterar</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados pessoais</Text>

              <Field
                label="Nome completo"
                icon="person-outline"
                value={name}
                onChangeText={setName}
                placeholder="Como devemos te chamar"
                focused={focused === 'name'}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />

              <Field
                label="Email"
                icon="mail-outline"
                value={email}
                onChangeText={() => {}}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                focused={false}
                onFocus={() => {}}
                onBlur={() => {}}
                editable={false}
              />

              <Field
                label="Telefone (opcional)"
                icon="call-outline"
                value={phone}
                onChangeText={setPhone}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                focused={focused === 'phone'}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
              />

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Data de nascimento</Text>
                <TouchableOpacity
                  style={styles.dateCard}
                  activeOpacity={0.85}
                  onPress={openDatePicker}
                >
                  <Ionicons name="calendar-outline" size={20} color="#C56682" />
                  <Text style={styles.dateValue}>{formatBirthDate(birthDate)}</Text>
                  <Ionicons name="chevron-down" size={18} color="#9E9E9E" />
                </TouchableOpacity>

                {showIOSPicker && (
                  <View style={styles.iosPicker}>
                    <DateTimePicker
                      value={birthDate}
                      mode="date"
                      display="spinner"
                      maximumDate={new Date()}
                      onChange={(_, selected) => {
                        if (selected) setBirthDate(selected);
                      }}
                    />
                    <TouchableOpacity
                      style={styles.iosPickerDone}
                      onPress={() => setShowIOSPicker(false)}
                    >
                      <Text style={styles.iosPickerDoneText}>Pronto</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.privacyCard}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#C56682"
              />
              <Text style={styles.privacyText}>
                Seus dados são confidenciais e usados apenas para o seu
                acompanhamento conforme a LGPD.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!canSave || !dirty || updateMutation.isPending) &&
                  styles.saveButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!canSave || !dirty || updateMutation.isPending}
              onPress={handleSave}
            >
              {updateMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Salvar alterações</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  focused,
  onFocus,
  onBlur,
  editable = true,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <Ionicons
          name={icon}
          size={18}
          color={focused ? '#C43A4A' : '#C56682'}
        />
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
        />
      </View>
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
  avatarSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 22,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarEditButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarHelper: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 22,
    padding: 18,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B6B6B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapFocused: {
    borderColor: '#C43A4A',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#1F1F1F',
    marginLeft: 10,
  },
  inputDisabled: {
    color: '#9E9E9E',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  dateValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  iosPicker: {
    backgroundColor: '#FBF4EB',
    borderRadius: 12,
    marginTop: 8,
    paddingBottom: 8,
  },
  iosPickerDone: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  iosPickerDoneText: {
    color: '#C56682',
    fontSize: 15,
    fontWeight: '700',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(197, 102, 130, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 22,
    marginTop: 16,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C43A4A',
    height: 56,
    borderRadius: 14,
    marginHorizontal: 22,
    marginTop: 24,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#E0BFC8',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
