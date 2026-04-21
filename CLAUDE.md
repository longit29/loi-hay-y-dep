# loi-hay-y-dep — Claude Code Instructions

## Project
React Native (Expo SDK 54) mobile app: quotes by category, favorites persisted locally.
See `SPEC.md` for full spec and `tasks/plan.md` for architecture decisions.

## Commands
```bash
npx expo start          # dev server
npm test                # jest (52 tests)
npm run test:coverage   # with coverage
npx tsc --noEmit        # type check
npx expo lint           # eslint
npx eas build           # production build
```

## Structure
```
app/(tabs)/index.tsx      — Home: 4 category cards
app/(tabs)/favorites.tsx  — Saved quotes (hydration guard)
app/category/[id].tsx     — 50 quotes per category
components/QuoteCard.tsx  — Quote display + copy + heart + speaker (isPlaying, onSpeak props)
components/HeartButton.tsx
components/CategoryCard.tsx
store/favoritesStore.ts   — Zustand + AsyncStorage persist
data/quotes.json          — 200 quotes (50 × 4 categories)
constants/theme.ts        — Colors (light/dark), Spacing, Radius, FontFamily
hooks/useTheme.ts         — Wrap useColorScheme → theme object
hooks/useQuotes.ts        — getCategories, getQuotesByCategory, etc.
hooks/useSpeech.ts        — TTS: startAutoPlay(quotes, index), stop(), isPlaying, currentQuoteId
types/index.ts            — Quote, Category, QuotesData
```

## Key Conventions
- Helpers over static data use `get*` naming (NOT `use*` — they are not hooks)
- `toggle()` in favoritesStore is async — awaits AsyncStorage, reverts on failure
- AsyncStorage key: `loi-hay-y-dep:favorites` (namespaced)
- All FlatList `renderItem` wrapped in `useCallback`
- `countByCategory` pre-computed at module load in `index.tsx`
- Fonts: Playfair Display Italic for quotes, Inter for UI
- Unicode curly quotes: `\u201C` / `\u201D` (NOT HTML entities)

## TTS (expo-speech)
- `useSpeech` is ephemeral — no store, resets on unmount (Speech.stop() in useEffect cleanup)
- `startAutoPlay(quotes, index)` uses `onDone` callback for auto-advance; reads from `quotesRef` (ref, not state) to avoid stale closures
- `QuoteCard` receives `onSpeak` + `isPlaying` from the screen, NOT from a global store — speaker button only renders when `onSpeak` is provided
- TTS text format: `"${quote.text} — ${quote.author}"`, language: `vi-VN`
- Tap speaker on playing card → stops; tap on another card → stops current, starts new

## Boundaries
- **Always:** TypeScript strict (`noImplicitAny`), `accessibilityRole` on all touchables
- **Ask first:** Adding categories, changing quotes.json shape, adding dependencies
- **Never:** Network requests, user permissions, storing data outside AsyncStorage
