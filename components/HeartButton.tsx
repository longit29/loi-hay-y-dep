import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFavoritesStore } from '@/store/favoritesStore';

interface HeartButtonProps {
  quoteId: string;
  size?: number;
}

export function HeartButton({ quoteId, size = 22 }: HeartButtonProps) {
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.favoriteIds.includes(quoteId));
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    toggle(quoteId);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      accessibilityState={{ selected: isFavorite }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={size}
          color={isFavorite ? '#E91E63' : '#888888'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
});
