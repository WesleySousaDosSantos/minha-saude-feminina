import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  getArticleById,
  getRelated,
  CATEGORY_LABEL,
} from '../../lib/articles';

export default function ConteudoDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const article = getArticleById(String(id));
  const related = getRelated(article);
  const [saved, setSaved] = useState(false);

  if (!article) {
    return (
      <View style={styles.notFoundRoot}>
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
          </View>
          <View style={styles.notFoundBody}>
            <View style={styles.notFoundIcon}>
              <Ionicons name="document-text-outline" size={36} color="#C56682" />
            </View>
            <Text style={styles.notFoundTitle}>Conteúdo não encontrado</Text>
            <Text style={styles.notFoundText}>
              Esse artigo pode ter sido removido ou ainda não está disponível.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.excerpt}\n\nLeia em Minha Saúde Feminina.`,
      });
    } catch {}
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.hero, { backgroundColor: article.color }]}>
            <View style={styles.headerBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.back()}
                hitSlop={12}
              >
                <Ionicons name="chevron-back" size={22} color="#1F1F1F" />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setSaved(!saved)}
                  hitSlop={12}
                >
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={saved ? '#C43A4A' : '#1F1F1F'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleShare}
                  hitSlop={12}
                >
                  <Ionicons name="share-social-outline" size={20} color="#1F1F1F" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroIconWrap}>
              <Ionicons
                name={article.icon}
                size={84}
                color={article.iconColor || 'rgba(255, 255, 255, 0.85)'}
              />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {CATEGORY_LABEL[article.category]}
              </Text>
            </View>

            <Text style={styles.title}>{article.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.authorAvatar}>
                <Ionicons name="medkit" size={14} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.authorName}>{article.author}</Text>
                <Text style={styles.publishedAt}>
                  Publicado em {article.publishedAt}
                </Text>
              </View>
              <View style={styles.readTimeBadge}>
                <Ionicons name="time-outline" size={12} color="#C56682" />
                <Text style={styles.readTimeText}>{article.readTime} min</Text>
              </View>
            </View>

            <View style={styles.validatedRow}>
              <Ionicons name="checkmark-circle" size={14} color="#C56682" />
              <Text style={styles.validatedText}>
                Conteúdo validado por profissionais da saúde
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.body}>
              {article.body.map((block, i) => {
                if (block.type === 'heading') {
                  return (
                    <Text key={i} style={styles.heading}>
                      {block.text}
                    </Text>
                  );
                }
                if (block.type === 'paragraph') {
                  return (
                    <Text key={i} style={styles.paragraph}>
                      {block.text}
                    </Text>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <View key={i} style={styles.list}>
                      {block.items.map((item, j) => (
                        <View key={j} style={styles.listItem}>
                          <View style={styles.bullet} />
                          <Text style={styles.listText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  );
                }
                return null;
              })}
            </View>

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Esse conteúdo foi útil?</Text>
              <View style={styles.feedbackButtons}>
                <TouchableOpacity style={styles.feedbackButton} activeOpacity={0.85}>
                  <Ionicons name="thumbs-up-outline" size={18} color="#C56682" />
                  <Text style={styles.feedbackButtonText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackButton} activeOpacity={0.85}>
                  <Ionicons name="thumbs-down-outline" size={18} color="#C56682" />
                  <Text style={styles.feedbackButtonText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>

            {related.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={styles.relatedTitle}>Continue lendo</Text>
                {related.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={styles.relatedCard}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/conteudo/${r.id}`)}
                  >
                    <View
                      style={[styles.relatedImage, { backgroundColor: r.color }]}
                    >
                      <Ionicons
                        name={r.icon}
                        size={22}
                        color={r.iconColor || 'rgba(255, 255, 255, 0.9)'}
                      />
                    </View>
                    <View style={styles.relatedBody}>
                      <Text style={styles.relatedCategory}>
                        {CATEGORY_LABEL[r.category]}
                      </Text>
                      <Text style={styles.relatedItemTitle} numberOfLines={2}>
                        {r.title}
                      </Text>
                      <View style={styles.relatedFooter}>
                        <Ionicons name="time-outline" size={11} color="#9E9E9E" />
                        <Text style={styles.relatedReadTime}>
                          {r.readTime} min
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
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
                Este conteúdo é educativo e não substitui consulta médica. Em
                caso de dúvidas, procure a UBS mais próxima.
              </Text>
            </View>
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
  notFoundRoot: {
    flex: 1,
    backgroundColor: '#FBF4EB',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 32,
  },
  hero: {
    paddingBottom: 28,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  heroIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 28,
    paddingBottom: 8,
  },
  content: {
    backgroundColor: '#FBF4EB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197, 102, 130, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F1F1F',
    lineHeight: 31,
    letterSpacing: 0.1,
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C56682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  publishedAt: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(197, 102, 130, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  readTimeText: {
    fontSize: 11,
    color: '#C56682',
    fontWeight: '800',
  },
  validatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  validatedText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.08)',
    marginVertical: 22,
  },
  body: {
    gap: 14,
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
    marginTop: 10,
    letterSpacing: 0.1,
  },
  paragraph: {
    fontSize: 15,
    color: '#1F1F1F',
    lineHeight: 23,
  },
  list: {
    gap: 10,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C56682',
    marginTop: 9,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#1F1F1F',
    lineHeight: 22,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 28,
    shadowColor: '#C56682',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 12,
    textAlign: 'center',
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  feedbackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FBF4EB',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 102, 130, 0.14)',
  },
  feedbackButtonText: {
    fontSize: 13,
    color: '#C56682',
    fontWeight: '700',
  },
  relatedSection: {
    marginTop: 28,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 12,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    paddingRight: 10,
    gap: 12,
    marginBottom: 8,
    shadowColor: '#C56682',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  relatedImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedBody: {
    flex: 1,
  },
  relatedCategory: {
    fontSize: 9,
    color: '#C56682',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  relatedItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 17,
    marginBottom: 4,
  },
  relatedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  relatedReadTime: {
    fontSize: 10,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#6B6B6B',
    lineHeight: 16,
  },
  notFoundBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  notFoundIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FBD9E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  notFoundText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
  },
});
