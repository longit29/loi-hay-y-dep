# Todo: Lời Hay Ý Đẹp

## PHASE 1 — Foundation

- [x] **Task 1: Project scaffold**
  - Acceptance: `npx expo start` chạy, không lỗi TS
  - Verify: `npx tsc --noEmit` pass
  - Files: `package.json`, `app/_layout.tsx`, `tsconfig.json`

- [x] **Task 2: Types + quotes.json**
  - Acceptance: TypeScript import data không lỗi, đúng shape
  - Verify: `npx tsc --noEmit` pass
  - Files: `types/index.ts`, `data/quotes.json`

- [x] **Task 3: Theme system**
  - Acceptance: dark/light colors switch đúng khi đổi system theme
  - Verify: test thủ công trên Simulator
  - Files: `constants/theme.ts`, `hooks/useTheme.ts`

> **CHECKPOINT 1:** Foundation xong

## PHASE 2 — State + Components

- [x] **Task 4: Favorites store**
  - Acceptance: toggle → kill app → mở lại → state giữ nguyên
  - Verify: test thủ công persist
  - Files: `store/favoritesStore.ts`

- [x] **Task 5: QuoteCard + HeartButton**
  - Acceptance: render đúng light/dark, tim toggle visual + animation; có speaker icon nhưng chưa nối logic TTS (placeholder callback)
  - Verify: test thủ công trên cả 2 theme
  - Files: `components/QuoteCard.tsx`, `components/HeartButton.tsx`

- [x] **Task 6: CategoryCard**
  - Acceptance: render grid 2 cột, navigate vào category
  - Verify: tap card → đi đúng màn hình
  - Files: `components/CategoryCard.tsx`

> **CHECKPOINT 2:** Components render với mock data

## PHASE 3 — Screens

- [x] **Task 7: Home screen (tab Khám phá)**
  - Acceptance: 4 category cards hiển thị, navigate được
  - Files: `app/(tabs)/index.tsx`

- [x] **Task 8: Category detail screen**
  - Acceptance: scroll 50 quotes smooth; nối `useSpeech` → tap speaker đọc câu + auto-advance
  - Files: `app/category/[id].tsx`, `hooks/useQuotes.ts`

- [x] **Task 9: Favorites screen (tab Yêu thích)**
  - Acceptance: quotes đúng, xóa tim → biến mất, empty state đẹp; nối `useSpeech` → tap speaker đọc câu + auto-advance
  - Files: `app/(tabs)/favorites.tsx`

> **CHECKPOINT 3:** Full happy path end-to-end

## PHASE 4 — Polish

- [x] **Task 10: Fonts + icons + tab bar**
  - Acceptance: fonts load trước render, không FOUT
  - Files: `app/_layout.tsx` (update)

- [x] **Task 11: Haptics + copy toast + scroll-to-top**
  - Acceptance: cảm giác native, toast 1.5s, scroll-to-top khi tap tab; haptic khi start/stop TTS
  - Files: `components/QuoteCard.tsx` (update), `app/(tabs)/_layout.tsx`

## PHASE 5 — TTS [ADDED]

- [x] **Task 12: useSpeech hook**
  - Acceptance: `startAutoPlay(quotes, index)` đọc câu tại index, khi xong gọi callback advance; `stop()` dừng ngay; cleanup on unmount; chỉ 1 instance active
  - Verify: test thủ công — đọc câu đầu → tự chuyển → đến cuối → dừng; navigate rời màn hình → TTS dừng
  - Files: `hooks/useSpeech.ts`
  - Depends on: Task 2 (types), Task 8/9 (nơi sử dụng)
  - Note: implement trước Task 8 và 9 để có thể nối vào

> **CHECKPOINT 5:** TTS đọc liên tục, dừng đúng ở cuối danh sách
