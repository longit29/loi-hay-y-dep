import { View, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useCallback } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { getCategories } from '@/hooks/useQuotes';
import { useTheme } from '@/hooks/useTheme';
import { FontFamily } from '@/constants/theme';
import { Category } from '@/types';
import quotesData from '@/data/quotes.json';

// Pre-computed once at module load — avoids scanning 200 quotes on every render
const countByCategory: Record<string, number> = {};
for (const q of quotesData.quotes) {
  countByCategory[q.categoryId] = (countByCategory[q.categoryId] ?? 0) + 1;
}

const categories = getCategories();

export default function HomeScreen() {
  const { colors, spacing } = useTheme();

  const renderItem = useCallback(({ item }: { item: Category }) => (
    <CategoryCard category={item} quoteCount={countByCategory[item.id] ?? 0} />
  ), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: FontFamily.uiBold }]}>
          Lời Hay Ý Đẹp
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: FontFamily.ui }]}>
          Chọn một chủ đề để khám phá
        </Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={[styles.grid, { padding: spacing.sm }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  grid: { flexGrow: 1 },
});
