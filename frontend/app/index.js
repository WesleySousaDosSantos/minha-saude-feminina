import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();
  const pulse = useRef(new Animated.Value(1)).current;
  const arrow = useRef(new Animated.Value(0)).current;

  const handleContinue = () => {
    if (!ready) return;
    if (isAuthenticated) {
      router.replace('/hoje');
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(arrow, {
          toValue: 6,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(arrow, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse, arrow]);

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.95}
      onPress={handleContinue}
    >
      <StatusBar style="light" />

      <LinearGradient
        colors={['#C56682', '#C56682', '#FBD9E5']}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      >
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
        <View style={[styles.blob, styles.blobThree]} />
        <View style={[styles.blob, styles.blobFour]} />

        <View style={styles.content}>
          <Animated.View
            style={[styles.iconWrap, { transform: [{ scale: pulse }] }]}
          >
            <View style={styles.haloOuter}>
              <View style={styles.haloInner}>
                <View style={styles.iconCircle}>
                  <Ionicons name="heart" size={52} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </Animated.View>

          <View style={styles.titleWrap}>
            <Text style={styles.titleLight}>Minha Saúde</Text>
            <Text style={styles.titleBold}>Feminina</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.tagline}>
            Cuidar da sua saúde{'\n'}é um ato de amor-próprio.
          </Text>
        </View>

        <Animated.View
          style={[styles.footer, { transform: [{ translateY: arrow }] }]}
        >
          <Ionicons
            name="chevron-down"
            size={22}
            color="rgba(196, 58, 74, 0.85)"
          />
          <Text style={styles.tapText}>TOQUE PARA CONTINUAR</Text>
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobOne: {
    width: 280,
    height: 280,
    top: -70,
    right: -90,
    backgroundColor: '#FBD9E5',
    opacity: 0.18,
  },
  blobTwo: {
    width: 200,
    height: 200,
    top: height * 0.32,
    left: -80,
    backgroundColor: '#FBF4EB',
    opacity: 0.14,
  },
  blobThree: {
    width: 170,
    height: 170,
    bottom: -50,
    right: -40,
    backgroundColor: '#FBD9E5',
    opacity: 0.18,
  },
  blobFour: {
    width: 90,
    height: 90,
    top: height * 0.16,
    left: width * 0.22,
    backgroundColor: '#FBF4EB',
    opacity: 0.12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  haloOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloInner: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 10,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 22,
  },
  titleLight: {
    fontSize: 24,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.92)',
    letterSpacing: 1.2,
  },
  titleBold: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  divider: {
    width: 56,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 1,
    marginBottom: 22,
  },
  tagline: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
    paddingHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
  },
  tapText: {
    fontSize: 12,
    color: 'rgba(196, 58, 74, 0.85)',
    letterSpacing: 2,
    marginTop: 4,
    fontWeight: '600',
  },
});
