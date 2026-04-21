import { FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useCallback, useMemo } from 'react';
import { QuoteCard } from '@/components/QuoteCard';
import { getQuotesByCategory, getCategoryById } from '@/hooks/useQuotes';
import { useTheme } from '@/hooks/useTheme';
import { useSpeech } from '@/hooks/useSpeech';
import { FontFamily } from '@/constants/theme';
import { Quote } from '@/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const category = getCategoryById(id);
  const quotes = useMemo(() => getQuotesByCategory(id), [id]);
  const navigation = useNavigation();
  const { isPlaying, currentQuoteId, startAutoPlay, stop } = useSpeech();

  useEffect(() => {
    if (category) {
      navigation.setOptions({ title: `${category.icon} ${category.name}` });
    }
  }, [category, navigation]);

  const renderItem = useCallback(({ item, index }: { item: Quote; index: number }) => (
    <QuoteCard
      quote={item}
      accentColor={category?.color}
      isPlaying={isPlaying && currentQuoteId === item.id}
      onSpeak={() => isPlaying && currentQuoteId === item.id ? stop() : startAutoPlay(quotes, index)}
    />
  ), [category?.color, isPlaying, currentQuoteId, quotes, startAutoPlay, stop]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            style={[
              styles.count,
              { color: colors.textSecondary, fontFamily: FontFamily.ui, paddingHorizontal: spacing.md },
            ]}>
            {quotes.length} câu trích dẫn
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  count: { fontSize: 13, marginBottom: 12 },
});
