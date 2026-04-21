import { useState, useRef, useEffect, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Quote } from '@/types';

export interface UseSpeechReturn {
  isPlaying: boolean;
  currentQuoteId: string | null;
  startAutoPlay: (quotes: Quote[], startIndex: number) => void;
  stop: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null);
  const quotesRef = useRef<Quote[]>([]);

  const stop = useCallback(() => {
    Speech.stop();
    setIsPlaying(false);
    setCurrentQuoteId(null);
  }, []);

  // speakAt is stable (empty deps) and reads quotesRef which is always current
  const speakAt = useCallback((index: number) => {
    const quotes = quotesRef.current;
    if (index >= quotes.length) {
      setIsPlaying(false);
      setCurrentQuoteId(null);
      return;
    }
    const quote = quotes[index];
    setCurrentQuoteId(quote.id);
    Speech.speak(`${quote.text} — ${quote.author}`, {
      language: 'vi-VN',
      onDone: () => speakAt(index + 1),
      onError: () => {
        setIsPlaying(false);
        setCurrentQuoteId(null);
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startAutoPlay = useCallback((quotes: Quote[], startIndex: number) => {
    Speech.stop();
    quotesRef.current = quotes;
    setIsPlaying(true);
    speakAt(startIndex);
  }, [speakAt]);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  return { isPlaying, currentQuoteId, startAutoPlay, stop };
}
