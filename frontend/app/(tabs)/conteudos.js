import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ARTICLES, CATEGORIES, CATEGORY_LABEL } from '../../lib/articles';

export default function Conteudos() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const featured = ARTICLES.find((a) => a.featured);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (a.featured && !term && activeCategory === 'all') return false;
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (term) {
        const haystack = `${a.title} ${a.excerpt}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [search, activeCategory]);

  return (
    <View style={styles.root}>
      <View style={[styles.blob, styles.blobTop]} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Conteúdos</Text>
            <Text style={styles.subtitle}>
              Informação acolhedora, validada por profissionais
            </Text>
          </View>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#C56682" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar artigo..."
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
            {CATEGORIES.map((c) => {
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

          {featured && activeCategory === 'all' && search.trim() === '' && (
            <TouchableOpacity
              style={styles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/conteudo/${featured.id}`)}
            >
              <View
                style={[
                  styles.featuredImage,
                  { backgroundColor: featured.color },
                ]}
              >
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={12} color="#C43A4A" />
                  <Text style={styles.featuredBadgeText}>EM DESTAQUE</Text>
                </View>
                <Ionicons
                  name={featured.icon}
                  size={64}
                  color="rgba(255, 255, 255, 0.85)"
                  style={styles.featuredIcon}
                />
              </View>
              <View style={styles.featuredBody}>
                <Text style={styles.featuredCategory}>
                  {CATEGORY_LABEL[featured.category]}
                </Text>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <Text style={styles.featuredExcerpt} numberOfLines={2}>
                  {featured.excerpt}
                </Text>
                <View style={styles.featuredFooter}>
                  <View style={styles.readTimeRow}>
                    <Ionicons name="time-outline" size={13} color="#6B6B6B" />
                    <Text style={styles.readTimeText}>
                      {featured.readTime} min de leitura
                    </Text>
                  </View>
                  <View style={styles.validatedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#C56682" />
                    <Text style={styles.validatedText}>Validado</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {activeCategory === 'all' ? 'Para você' : CATEGORY_LABEL[activeCategory]}
            </Text>
            <Text style={styles.listCount}>
              {filtered.length} {filtered.length === 1 ? 'artigo' : 'artigos'}
            </Text>
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
              {filtered.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/conteudo/${article.id}`)}
                >
                  <View
                    style={[
                      styles.articleImage,
                      { backgroundColor: article.color },
                    ]}
                  >
                    <Ionicons
                      name={article.icon}
                      size={28}
                      color={article.iconColor || 'rgba(255, 255, 255, 0.9)'}
                    />
                  </View>
                  <View style={styles.articleBody}>
                    <Text style={styles.articleCategory}>
                      {CATEGORY_LABEL[article.category]}
                    </Text>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <View style={styles.articleFooter}>
                      <Ionicons name="time-outline" size={12} color="#9E9E9E" />
                      <Text style={styles.articleReadTime}>
                        {article.readTime} min
                      </Text>
                      <View style={styles.dotSeparator} />
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#C56682"
                      />
                      <Text style={styles.articleValidated}>Validado</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B6B6B"
            />
            <Text style={styles.disclaimerText}>
              Conteúdos educativos não substituem consulta médica. Em caso de
              dúvidas, procure a UBS.
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
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 240,
    height: 240,
    top: -100,
    right: -80,
    backgroundColor: '#FBD9E5',
    opacity: 0.45,
  },
  scroll: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 4,
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
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
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
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 22,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#C56682',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  featuredImage: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C43A4A',
    letterSpacing: 0.6,
  },
  featuredIcon: {
    opacity: 0.95,
  },
  featuredBody: {
    padding: 16,
  },
  featuredCategory: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    lineHeight: 23,
    marginBottom: 6,
  },
  featuredExcerpt: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 18,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readTimeText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  validatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  validatedText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  listCount: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 22,
    gap: 12,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  articleImage: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleBody: {
    flex: 1,
    padding: 12,
    paddingLeft: 14,
    justifyContent: 'center',
  },
  articleCategory: {
    fontSize: 10,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 19,
    marginBottom: 6,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleReadTime: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9E9E9E',
    marginHorizontal: 4,
  },
  articleValidated: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 22,
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
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 22,
    marginTop: 22,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 16,
  },
});
