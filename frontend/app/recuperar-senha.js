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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForgotPasswordMutation } from '../services/queries';

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const forgotMutation = useForgotPasswordMutation();

  const handleSubmit = () => {
    if (!validEmail || forgotMutation.isPending) return;
    forgotMutation.mutate(email.trim(), {
      onSuccess: () => setSubmitted(true),
      onError: () => setSubmitted(true),
    });
  };
  const loading = forgotMutation.isPending;

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

          {submitted ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>Email enviado</Text>
              <Text style={styles.successText}>
                Enviamos um link de recuperação para{'\n'}
                <Text style={styles.successEmail}>{email.trim()}</Text>
              </Text>
              <Text style={styles.successHelper}>
                Confira sua caixa de entrada e a pasta de spam.{'\n'}O link
                expira em 30 minutos.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => router.replace('/login')}
              >
                <Text style={styles.primaryButtonText}>Voltar ao login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
              >
                <Text style={styles.resendText}>Usar outro email</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-closed" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.title}>Esqueci minha senha</Text>
                <Text style={styles.subtitle}>
                  Informe seu email cadastrado.{'\n'}Vamos te enviar um link para
                  criar uma nova senha.
                </Text>
              </View>

              <View style={styles.form}>
                <View
                  style={[
                    styles.inputWrap,
                    emailFocused && styles.inputWrapFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={emailFocused ? '#C43A4A' : '#C56682'}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu e-mail"
                    placeholderTextColor="#9E9E9E"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!validEmail || loading) && styles.primaryButtonDisabled,
                  ]}
                  activeOpacity={0.85}
                  disabled={!validEmail || loading}
                  onPress={handleSubmit}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Enviando...' : 'Enviar link'}
                  </Text>
                  {!loading && (
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                <View style={styles.helpCard}>
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="#C56682"
                  />
                  <Text style={styles.helpText}>
                    Se você se cadastrou com Google, basta voltar e entrar com
                    Google novamente.
                  </Text>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <Text style={styles.bottomText}>Lembrou da senha?</Text>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => router.replace('/login')}
                >
                  <Text style={styles.bottomLink}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    marginTop: 24,
    marginBottom: 36,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 10,
    letterSpacing: 0.2,
    textAlign: 'center',
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
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.18)',
  },
  inputWrapFocused: {
    borderColor: '#C43A4A',
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 15,
    color: '#1F1F1F',
    marginLeft: 12,
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
    backgroundColor: '#E0BFC8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 32,
  },
  bottomText: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  bottomLink: {
    fontSize: 14,
    color: '#C56682',
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#C56682',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  successText: {
    fontSize: 15,
    color: '#1F1F1F',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 14,
  },
  successEmail: {
    fontWeight: '800',
    color: '#C43A4A',
  },
  successHelper: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 32,
  },
  resendButton: {
    marginTop: 14,
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#C56682',
    fontWeight: '700',
  },
});
