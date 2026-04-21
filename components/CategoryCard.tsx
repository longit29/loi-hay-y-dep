import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Category } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { FontFamily } from '@/constants/theme';

interface CategoryCardProps {
  category: Category;
  quoteCount: number;
}

export function CategoryCard({ category, quoteCount }: CategoryCardProps) {
  const { colors, spacing, radius } = useTheme();

  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${quoteCount} câu trích dẫn`}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.md,
          margin: spacing.sm / 2,
        },
      ]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category.color + '22' },
        ]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text
        style={[
          styles.name,
          { color: colors.text, fontFamily: FontFamily.uiBold },
        ]}>
        {category.name}
      </Text>
      <Text
        style={[
          styles.count,
          { color: colors.textSecondary, fontFamily: FontFamily.ui },
        ]}>
        {quoteCount} câu
      </Text>
      <View style={[styles.accent, { backgroundColor: category.color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: { fontSize: 22 },
  name: { fontSize: 15, marginBottom: 4 },
  count: { fontSize: 12 },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
