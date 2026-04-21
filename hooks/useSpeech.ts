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
  // Incremented on every stop/startAutoPlay — stale onDone callbacks check this before acting
  const sessionRef = useRef(0);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    Speech.stop();
    setIsPlaying(false);
    setCurrentQuoteId(null);
  }, []);

  // speakAt is stable (empty deps) and reads quotesRef which is always current.
  // Each invocation captures `session`; if sessionRef has advanced, the callback is stale and ignored.
  const speakAt = useCallback((session: number, index: number) => {
    if (session !== sessionRef.current) return;
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
      onDone: () => speakAt(session, index + 1),
      onError: () => {
        if (session !== sessionRef.current) return;
        setIsPlaying(false);
        setCurrentQuoteId(null);
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startAutoPlay = useCallback((quotes: Quote[], startIndex: number) => {
    Speech.stop();
    sessionRef.current += 1;
    quotesRef.current = quotes;
    setIsPlaying(true);
    speakAt(sessionRef.current, startIndex);
  }, [speakAt]);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  return { isPlaying, currentQuoteId, startAutoPlay, stop };
}
