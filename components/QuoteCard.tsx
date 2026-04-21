import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Platform } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Quote } from '@/types';
import { HeartButton } from './HeartButton';
import { useTheme } from '@/hooks/useTheme';
import { FontFamily } from '@/constants/theme';

interface QuoteCardProps {
  quote: Quote;
  accentColor?: string;
  isPlaying?: boolean;
  onSpeak?: () => void;
}

export function QuoteCard({ quote, accentColor, isPlaying = false, onSpeak }: QuoteCardProps) {
  const { colors, spacing, radius } = useTheme();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timer on unmount to prevent state update on unmounted component
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    await Clipboard.setStringAsync(`\u201C${quote.text}\u201D \u2014 ${quote.author}`);
    setCopied(true);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Đã sao chép!', ToastAndroid.SHORT);
    }
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  }, [quote.text, quote.author]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.md,
          marginHorizontal: spacing.md,
          marginBottom: spacing.md,
          borderLeftWidth: 3,
          borderLeftColor: accentColor ?? colors.tint,
        },
      ]}>
      <Text
        style={[
          styles.quoteText,
          { color: colors.text, fontFamily: FontFamily.quote },
        ]}>
        {'\u201C'}{quote.text}{'\u201D'}
      </Text>
      <Text
        style={[
          styles.author,
          { color: colors.textSecondary, fontFamily: FontFamily.ui },
        ]}>
        — {quote.author}
      </Text>
      <View style={styles.actions}>
        {onSpeak && (
          <TouchableOpacity
            onPress={onSpeak}
            style={styles.actionBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Dừng đọc' : 'Đọc câu trích dẫn'}>
            <Ionicons
              name={isPlaying ? 'stop-circle' : 'volume-high-outline'}
              size={20}
              color={isPlaying ? (accentColor ?? colors.tint) : colors.icon}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleCopy}
          style={styles.actionBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sao chép câu trích dẫn">
          <Ionicons
            name={copied ? 'checkmark-circle' : 'copy-outline'}
            size={20}
            color={copied ? '#4CAF50' : colors.icon}
          />
        </TouchableOpacity>
        <HeartButton quoteId={quote.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: { fontSize: 17, lineHeight: 27, marginBottom: 12 },
  author: { fontSize: 13, marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4 },
  actionBtn: { padding: 8 },
});
