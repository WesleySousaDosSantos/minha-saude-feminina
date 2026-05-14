import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DocumentScreen({
  headerTitle,
  documentTitle,
  lastUpdate,
  icon = 'document-text',
  iconColor = '#C43A4A',
  iconBg = '#FBD9E5',
  children,
}) {
  const router = useRouter();

  return (
    <View style={styles.root}>
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
          <Text style={styles.headerBarTitle}>{headerTitle}</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <View style={[styles.titleIcon, { backgroundColor: iconBg }]}>
              <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <Text style={styles.documentTitle}>{documentTitle}</Text>
            <Text style={styles.lastUpdate}>
              Última atualização: {lastUpdate}
            </Text>
          </View>

          <View style={styles.content}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function DocSection({ number, title, children }) {
  return (
    <View style={docStyles.section}>
      <View style={docStyles.sectionHeader}>
        {number && (
          <View style={docStyles.sectionNumber}>
            <Text style={docStyles.sectionNumberText}>{number}</Text>
          </View>
        )}
        <Text style={docStyles.sectionTitle}>{title}</Text>
      </View>
      <View style={docStyles.sectionBody}>{children}</View>
    </View>
  );
}

export function DocParagraph({ children, highlight }) {
  return (
    <Text style={[docStyles.paragraph, highlight && docStyles.paragraphHighlight]}>
      {children}
    </Text>
  );
}

export function DocBullet({ children }) {
  return (
    <View style={docStyles.bulletRow}>
      <View style={docStyles.bulletDot} />
      <Text style={docStyles.bulletText}>{children}</Text>
    </View>
  );
}

export function DocNote({ children, type = 'info' }) {
  const isWarn = type === 'warn';
  return (
    <View style={[docStyles.note, isWarn && docStyles.noteWarn]}>
      <Ionicons
        name={isWarn ? 'warning-outline' : 'information-circle-outline'}
        size={18}
        color={isWarn ? '#C43A4A' : '#C56682'}
      />
      <Text style={[docStyles.noteText, isWarn && docStyles.noteTextWarn]}>
        {children}
      </Text>
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
  headerBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    paddingTop: 8,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  titleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
    marginBottom: 4,
    textAlign: 'center',
  },
  lastUpdate: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  content: {
    marginTop: 6,
  },
});

const docStyles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumberText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.1,
  },
  sectionBody: {
    gap: 10,
  },
  paragraph: {
    fontSize: 13,
    color: '#1F1F1F',
    lineHeight: 20,
  },
  paragraphHighlight: {
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C56682',
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#1F1F1F',
    lineHeight: 20,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(197, 102, 130, 0.08)',
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  noteWarn: {
    backgroundColor: 'rgba(196, 58, 74, 0.1)',
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#1F1F1F',
    lineHeight: 18,
    fontWeight: '600',
  },
  noteTextWarn: {
    color: '#C43A4A',
  },
});
