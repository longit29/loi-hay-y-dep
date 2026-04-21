# Plan: Lời Hay Ý Đẹp

## Dependency Graph

```
[1] Project scaffold + Expo Router
        ↓
[2] Types + quotes.json (200 quotes)
        ↓
[3] Theme system (light/dark, colors, typography)
        ↓
[4] Zustand store + AsyncStorage (favorites)
        ↓
[5] Components (QuoteCard + speaker icon placeholder, CategoryCard, HeartButton)
        ↓
[6] Home screen          [7] Favorites screen
        ↓
[8] Category detail screen    [12] useSpeech hook [ADDED]
        ↓                              ↓
[9] Copy to clipboard ←────────────────┘ (nối TTS vào Task 8 & 9)
        ↓
[10] Polish: fonts, icons, animations, haptics + TTS haptic
```

## Implementation Phases

### PHASE 1 — Foundation
1. Project scaffold (Expo + TypeScript + Expo Router + deps)
2. Data layer (types/index.ts + data/quotes.json)
3. Theme system (constants/theme.ts + hooks/useTheme.ts)

**CHECKPOINT:** `npx expo start` chạy được, import data không lỗi TypeScript

### PHASE 2 — State + Components
4. Favorites store (Zustand + AsyncStorage persist)
5. QuoteCard + HeartButton (tim animate + copy button)
6. CategoryCard (emoji + màu accent + navigate)

**CHECKPOINT:** Components render đúng với mock data trong cả light/dark

### PHASE 3 — Screens
7. Home screen — FlatList 2 cột CategoryCard
8. Category detail — filter + FlatList QuoteCard
9. Favorites screen — filter từ store + empty state

**CHECKPOINT:** Full happy path end-to-end hoạt động

### PHASE 4 — Polish
10. Fonts (Playfair Display + Inter) + tab bar icons
11. Haptic feedback + copy toast 1.5s + scroll-to-top + TTS haptic

### PHASE 5 — TTS [ADDED]
12. `hooks/useSpeech.ts` — implement trước khi nối vào Task 8 và 9
    - expo-speech `speak()` với `language: 'vi-VN'`, `onDone` callback để advance
    - auto-advance: đọc xong → tăng index → gọi lại `speak()` → đến cuối thì stop
    - cleanup: `useEffect` return → `Speech.stop()`

## Critical Files

```
app/_layout.tsx           — Root layout, tab navigator, font loading
app/(tabs)/index.tsx      — Home screen
app/(tabs)/favorites.tsx  — Favorites screen
app/category/[id].tsx     — Category detail
components/QuoteCard.tsx  — Core display component
store/favoritesStore.ts   — Single source of truth for favorites
data/quotes.json          — 200 quotes
constants/theme.ts        — Colors, typography, spacing
types/index.ts            — Quote, Category interfaces
hooks/useSpeech.ts        — TTS hook: speak, stop, auto-advance [ADDED]
```

## Verification

```bash
npx expo start        # App khởi động
npx tsc --noEmit      # Không có lỗi TypeScript

# Manual:
# 1. Tap tim → filled; kill app → mở lại → vẫn filled
# 2. Tap copy → toast "Đã sao chép!" 1.5s
# 3. Đổi system sang dark/light → theme switch ngay
# 4. Scroll 50 quotes không lag
# 5. iOS Simulator + Android Emulator đều chạy
# 6. Tap speaker → đọc câu, tự chuyển → đến cuối → dừng
# 7. Navigate rời màn hình → TTS dừng ngay
```
