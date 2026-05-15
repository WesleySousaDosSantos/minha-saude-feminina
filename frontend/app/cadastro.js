import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../lib/AuthContext';

export default function Cadastro() {
  const router = useRouter();
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [focused, setFocused] = useState({
    nome: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const setFocus = (field, value) =>
    setFocused((prev) => ({ ...prev, [field]: value }));

  const registerMutation = useMutation({
    mutationFn: () =>
      register({
        name: nome.trim(),
        email: email.trim(),
        password,
        termsAccepted: acceptedTerms,
      }),
    onSuccess: () => router.replace('/onboarding'),
    onError: (err) =>
      Alert.alert(
        'Não foi possível criar a conta',
        err?.message || 'Tente novamente.'
      ),
  });

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const formReady =
    nome.trim().length >= 2 &&
    validEmail &&
    password.length >= 6 &&
    confirmPassword === password &&
    acceptedTerms;
  const canSubmit = formReady && !registerMutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'A confirmação não bate com a senha.');
      return;
    }
    registerMutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color="#1F1F1F" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="heart" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.welcome}>Vamos começar</Text>
            <Text style={styles.subtitle}>
              Crie sua conta para acompanhar{'\n'}sua saúde dia a dia
            </Text>
          </View>

          <View style={styles.form}>
            <View
              style={[
                styles.inputWrap,
                focused.nome && styles.inputWrapFocused,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={focused.nome ? '#C43A4A' : '#C56682'}
              />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#9E9E9E"
                value={nome}
                onChangeText={setNome}
                onFocus={() => setFocus('nome', true)}
                onBlur={() => setFocus('nome', false)}
                autoCapitalize="words"
              />
            </View>

            <View
              style={[
                styles.inputWrap,
                focused.email && styles.inputWrapFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={focused.email ? '#C43A4A' : '#C56682'}
              />
              <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocus('email', true)}
                onBlur={() => setFocus('email', false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View
              style={[
                styles.inputWrap,
                focused.password && styles.inputWrapFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused.password ? '#C43A4A' : '#C56682'}
              />
              <TextInput
                style={styles.input}
                placeholder="Crie uma senha"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocus('password', true)}
                onBlur={() => setFocus('password', false)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#C56682"
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputWrap,
                focused.confirmPassword && styles.inputWrapFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused.confirmPassword ? '#C43A4A' : '#C56682'}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirme a senha"
                placeholderTextColor="#9E9E9E"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocus('confirmPassword', true)}
                onBlur={() => setFocus('confirmPassword', false)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={8}
              >
                <Ionicons
                  name={
                    showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                  }
                  size={20}
                  color="#C56682"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termsText}>
                Aceito os <Text style={styles.termsLink}>termos de uso</Text>{' '}
                e a{' '}
                <Text style={styles.termsLink}>política de privacidade</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                !canSubmit && styles.primaryButtonDisabled,
              ]}
              disabled={!canSubmit}
              activeOpacity={0.85}
              onPress={handleSubmit}
            >
              {registerMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Criar minha conta</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              !acceptedTerms && styles.secondaryButtonDisabled,
            ]}
            disabled={!acceptedTerms}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={18} color="#1F1F1F" />
            <Text style={styles.secondaryButtonText}>Cadastrar com Google</Text>
          </TouchableOpacity>

          <View style={styles.signin}>
            <Text style={styles.signinText}>Já tem conta?</Text>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.signinLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FBD9E5',
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 260,
    height: 260,
    top: -90,
    right: -80,
    backgroundColor: '#FBF4EB',
    opacity: 0.7,
  },
  blobBottom: {
    width: 220,
    height: 220,
    bottom: -80,
    left: -70,
    backgroundColor: '#FFFFFF',
    opacity: 0.45,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 28,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 7,
  },
  welcome: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.18)',
  },
  inputWrapFocused: {
    borderColor: '#C43A4A',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: '#1F1F1F',
    marginLeft: 12,
    marginRight: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C56682',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 18,
  },
  termsLink: {
    color: '#C56682',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#C56682',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#C56682',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(197, 102, 130, 0.45)',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.12)',
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(31, 31, 31, 0.1)',
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    color: '#1F1F1F',
    fontSize: 15,
    fontWeight: '600',
  },
  signin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 28,
  },
  signinText: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  signinLink: {
    fontSize: 14,
    color: '#C56682',
    fontWeight: '700',
  },
});
