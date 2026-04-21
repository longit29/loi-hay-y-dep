/**
 * Tests for useSpeech hook — startAutoPlay, stop, auto-advance, cleanup
 */

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

import * as Speech from 'expo-speech';
import { renderHook, act } from '@testing-library/react-native';
import { useSpeech } from '@/hooks/useSpeech';
import { Quote } from '@/types';

const mockSpeak = Speech.speak as jest.Mock;
const mockStop = Speech.stop as jest.Mock;

const quotes: Quote[] = [
  { id: 'q1', text: 'Text 1', author: 'Author 1', categoryId: 'cat1' },
  { id: 'q2', text: 'Text 2', author: 'Author 2', categoryId: 'cat1' },
  { id: 'q3', text: 'Text 3', author: 'Author 3', categoryId: 'cat1' },
];

beforeEach(() => {
  mockSpeak.mockClear();
  mockStop.mockClear();
});

describe('useSpeech — initial state', () => {
  it('starts with isPlaying false and currentQuoteId null', () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentQuoteId).toBeNull();
  });
});

describe('useSpeech — startAutoPlay', () => {
  it('sets isPlaying true and currentQuoteId to the starting quote', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentQuoteId).toBe('q1');
  });

  it('calls Speech.speak with formatted text and vi-VN language', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    expect(mockSpeak).toHaveBeenCalledWith(
      'Text 1 — Author 1',
      expect.objectContaining({ language: 'vi-VN' })
    );
  });

  it('can start from a non-zero index', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 1); });
    expect(result.current.currentQuoteId).toBe('q2');
  });

  it('advances to next quote when onDone fires', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    act(() => { mockSpeak.mock.calls[0][1].onDone(); });
    expect(result.current.currentQuoteId).toBe('q2');
    expect(mockSpeak).toHaveBeenCalledTimes(2);
  });

  it('stops after the last quote finishes', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 2); });
    act(() => { mockSpeak.mock.calls[0][1].onDone(); });
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentQuoteId).toBeNull();
  });

  it('calls Speech.stop before starting a new session', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    mockStop.mockClear(); // reset to isolate the second startAutoPlay call
    act(() => { result.current.startAutoPlay(quotes, 1); });
    expect(mockStop).toHaveBeenCalledTimes(1);
  });
});

describe('useSpeech — stop', () => {
  it('resets isPlaying and currentQuoteId', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    act(() => { result.current.stop(); });
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentQuoteId).toBeNull();
  });

  it('calls Speech.stop()', () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    act(() => { result.current.stop(); });
    expect(mockStop).toHaveBeenCalled();
  });
});

describe('useSpeech — cleanup', () => {
  it('calls Speech.stop on unmount', () => {
    const { unmount, result } = renderHook(() => useSpeech());
    act(() => { result.current.startAutoPlay(quotes, 0); });
    unmount();
    expect(mockStop).toHaveBeenCalled();
  });
});
