import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  DUVIDAS,
  DUVIDAS_CATEGORIES,
  DUVIDAS_CATEGORY_LABEL,
  searchDuvidas,
} from '../lib/duvidas';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DuvidasFrequentes() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(
    () => searchDuvidas(search, activeCategory),
    [search, activeCategory]
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
          <Text style={styles.headerTitle}>Dúvidas frequentes</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.intro}>
            <Text style={styles.introTitle}>
              <Text style={styles.introTitleAccent}>É normal isso?</Text>
            </Text>
            <Text style={styles.introSubtitle}>
              Respostas para as dúvidas mais comuns, validadas pela equipe da
              UBS e da UNIFEBE.
            </Text>
          </View>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#C56682" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar uma dúvida..."
              placeholderTextColor="#9E9E9E"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#9E9E9E" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {DUVIDAS_CATEGORIES.map((c) => {
              const active = activeCategory === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  activeOpacity={0.85}
                  onPress={() => setActiveCategory(c.id)}
                >
                  <Ionicons
                    name={c.icon}
                    size={14}
                    color={active ? '#FFFFFF' : '#C56682'}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      active && styles.categoryLabelActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {filtered.length} {filtered.length === 1 ? 'dúvida' : 'dúvidas'}
            </Text>
            <Text style={styles.listHint}>Toque para ver a resposta</Text>
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search" size={28} color="#C56682" />
              </View>
              <Text style={styles.emptyTitle}>Nada encontrado</Text>
              <Text style={styles.emptyText}>
                Tente outra palavra ou explore outra categoria
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((d) => {
                const isOpen = expanded === d.id;
                return (
                  <View
                    key={d.id}
                    style={[styles.faqCard, isOpen && styles.faqCardOpen]}
                  >
                    <TouchableOpacity
                      style={styles.faqHeader}
                      activeOpacity={0.7}
                      onPress={() => toggle(d.id)}
                    >
                      <View style={styles.faqHeaderLeft}>
                        <View style={styles.faqIcon}>
                          <Ionicons
                            name="help"
                            size={14}
                            color="#FFFFFF"
                          />
                        </View>
                        <View style={styles.faqHeaderText}>
                          <Text style={styles.faqCategory}>
                            {DUVIDAS_CATEGORY_LABEL[d.category]}
                          </Text>
                          <Text style={styles.faqQuestion}>{d.question}</Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.chevronWrap,
                          isOpen && styles.chevronWrapOpen,
                        ]}
                      >
                        <Ionicons
                          name={isOpen ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color={isOpen ? '#C43A4A' : '#C56682'}
                        />
                      </View>
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.faqBody}>
                        <View style={styles.faqDivider} />
                        {d.answer.split('\n\n').map((paragraph, i) => (
                          <Text key={i} style={styles.faqAnswer}>
                            {paragraph}
                          </Text>
                        ))}
                        <View style={styles.authorRow}>
                          <Ionicons
                            name="medkit"
                            size={12}
                            color="#C56682"
                          />
                          <Text style={styles.authorText}>{d.author}</Text>
                          <View style={styles.validatedBadge}>
                            <Ionicons
                              name="checkmark-circle"
                              size={11}
                              color="#C56682"
                            />
                            <Text style={styles.validatedText}>Validado</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.helpCard}>
            <View style={styles.helpIcon}>
              <Ionicons name="alert-circle" size={20} color="#C43A4A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helpTitle}>Não encontrou sua dúvida?</Text>
              <Text style={styles.helpText}>
                Procure a UBS mais próxima. O atendimento é gratuito,
                confidencial e seu direito.
              </Text>
            </View>
          </View>

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B6B6B"
            />
            <Text style={styles.disclaimerText}>
              Conteúdo educativo não substitui consulta médica. Em emergências,
              ligue 192 (SAMU).
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
    width: 200,
    height: 200,
    top: -80,
    right: -70,
    backgroundColor: '#FBF4EB',
    opacity: 0.55,
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
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 16,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  introTitleAccent: {
    color: '#C43A4A',
  },
  introSubtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 22,
    height: 48,
    shadowColor: '#C56682',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F1F1F',
  },
  categoriesRow: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  categoryChipActive: {
    backgroundColor: '#C56682',
    borderColor: '#C56682',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 22,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  listHint: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 22,
    gap: 8,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  faqCardOpen: {
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 4,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 10,
  },
  faqHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  faqIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  faqHeaderText: {
    flex: 1,
  },
  faqCategory: {
    fontSize: 10,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 19,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronWrapOpen: {
    backgroundColor: 'rgba(196, 58, 74, 0.14)',
  },
  faqBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  faqDivider: {
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.05)',
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 21,
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 31, 31, 0.05)',
  },
  authorText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '700',
  },
  validatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  validatedText: {
    fontSize: 10,
    color: '#C56682',
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 22,
    marginTop: 24,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#C43A4A',
  },
  helpIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(196, 58, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 2,
  },
  helpText: {
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 22,
    marginTop: 18,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 16,
  },
});
