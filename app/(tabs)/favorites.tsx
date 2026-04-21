import { View, FlatList, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { QuoteCard } from '@/components/QuoteCard';
import { getQuotesByIds } from '@/hooks/useQuotes';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useTheme } from '@/hooks/useTheme';
import { useSpeech } from '@/hooks/useSpeech';
import { FontFamily } from '@/constants/theme';
import { Quote } from '@/types';

export default function FavoritesScreen() {
  const { colors, spacing } = useTheme();
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const hydrated = useFavoritesStore((s) => s.hydrated);
  const favorites = useMemo(() => getQuotesByIds(favoriteIds), [favoriteIds]);
  const { isPlaying, currentQuoteId, startAutoPlay, stop } = useSpeech();

  const renderItem = useCallback(({ item, index }: { item: Quote; index: number }) => (
    <QuoteCard
      quote={item}
      isPlaying={isPlaying && currentQuoteId === item.id}
      onSpeak={() => isPlaying && currentQuoteId === item.id ? stop() : startAutoPlay(favorites, index)}
    />
  ), [isPlaying, currentQuoteId, favorites, startAutoPlay, stop]);

  // Wait for AsyncStorage to hydrate before showing empty state
  if (!hydrated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.tint} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: FontFamily.uiBold }]}>
          Yêu thích
        </Text>
        {favorites.length > 0 && (
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: FontFamily.ui }]}>
            {favorites.length} câu đã lưu
          </Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: FontFamily.uiBold }]}>
            Chưa có câu nào
          </Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary, fontFamily: FontFamily.ui }]}>
            Tap ♡ trên bất kỳ câu trích dẫn nào để lưu vào đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1 },
  header: { paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18 },
  emptyHint: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
