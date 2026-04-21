# Spec: Lời Hay Ý Đẹp — Mobile Quotes App

## Objective

Ứng dụng mobile giúp người dùng khám phá, lưu, và đọc những câu nói hay theo chủ đề. Không cần tài khoản, không cần mạng — trải nghiệm đơn giản, đẹp mắt, tập trung vào nội dung.

**User:** Người dùng phổ thông muốn đọc quotes hàng ngày để lấy cảm hứng.

**Success criteria:**
- Mở app → thấy danh sách chủ đề ngay lập tức (< 300ms)
- Chọn chủ đề → xem quotes trong chủ đề đó
- Tap tim → quote được lưu vào Favorites, persist qua restart app
- Tap copy → quote được copy vào clipboard, hiện toast "Đã sao chép!"
- Vào tab Yêu thích → thấy đúng các quotes đã lưu
- Dark/light mode tự động theo system theme
- Tap speaker → app đọc câu đó bằng giọng nói (vi-VN), tự động chuyển sang câu kế tiếp
- Tap stop → dừng phát ngay lập tức

---

## Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | React Native + Expo | SDK 52+ |
| Language | TypeScript | 5.x |
| Navigation | Expo Router | v4 |
| State | Zustand | 5.x |
| Storage | AsyncStorage | 2.x |
| Clipboard | expo-clipboard | — |
| Haptics | expo-haptics | — |
| **Speech** | **expo-speech** | **—** |
| Icons | @expo/vector-icons (Ionicons) | — |
| Fonts | Playfair Display + Inter (expo-google-fonts) | — |

---

## Commands

```bash
# Khởi tạo project
npx create-expo-app@latest loi-hay-y-dep --template blank-typescript

# Dev
npx expo start

# Type check
npx tsc --noEmit

# Lint
npx eslint . --ext .ts,.tsx
```

---

## Project Structure

```
loi-hay-y-dep/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # Tab: Khám phá (danh sách chủ đề)
│   │   └── favorites.tsx       # Tab: Yêu thích
│   ├── category/[id].tsx       # Danh sách quotes theo chủ đề
│   └── _layout.tsx             # Root layout + tab bar + font loading
├── components/
│   ├── QuoteCard.tsx           # Card hiển thị 1 quote (text + author + actions)
│   ├── CategoryCard.tsx        # Card chủ đề ở màn home
│   └── HeartButton.tsx         # Nút yêu thích với animation
├── store/
│   └── favoritesStore.ts       # Zustand store + AsyncStorage sync
├── data/
│   └── quotes.json             # 4 categories × 50 quotes = 200 quotes
├── hooks/
│   ├── useQuotes.ts            # Hook lọc quotes theo categoryId
│   ├── useTheme.ts             # Hook trả về colors/typography theo colorScheme
│   └── useSpeech.ts            # Hook TTS: speak, stop, isPlaying, auto-advance
├── constants/
│   └── theme.ts                # Colors, typography, spacing cho light/dark
└── types/
    └── index.ts                # Quote, Category interfaces
```

---

## Data Shape (quotes.json)

```json
{
  "categories": [
    { "id": "cuoc-song", "name": "Cuộc sống", "icon": "🌿", "color": "#4CAF50" },
    { "id": "tinh-yeu",  "name": "Tình yêu",  "icon": "❤️", "color": "#E91E63" },
    { "id": "thanh-cong","name": "Thành công","icon": "🔥", "color": "#FF9800" },
    { "id": "ban-than",  "name": "Bản thân",  "icon": "✨", "color": "#9C27B0" }
  ],
  "quotes": [
    {
      "id": "1",
      "text": "Cuộc sống không phải là chờ cơn bão qua đi, mà là học cách nhảy múa dưới mưa.",
      "author": "Vivian Greene",
      "categoryId": "cuoc-song"
    }
  ]
}
```

---

## UI Style

**Design language:** Minimal, typography-first. Dark mode mặc định, chữ nổi bật, mỗi quote có không gian để thở.

```
Màu nền chính (dark):   #0F0F0F
Màu nền chính (light):  #FAFAFA
Màu card (dark):        #1A1A1A
Màu card (light):       #FFFFFF
Màu accent:             theo từng category
Màu chữ chính (dark):   #F5F5F5
Màu chữ chính (light):  #1A1A1A
Màu chữ phụ:            #888888
Font quote:             Playfair Display Italic
Font UI:                Inter
Border radius:          16px
Spacing unit:           8px
```

---

## Code Style

```typescript
// types/index.ts — interfaces rõ ràng, không dùng any
export interface Quote {
  id: string;
  text: string;
  author: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// hooks/useTheme.ts — wrap useColorScheme
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
```

---

## TTS Feature [ADDED]

**Behavior:**
- Mỗi QuoteCard có nút speaker icon (Ionicons: `volume-high` / `stop-circle`)
- Nhấn speaker → đọc `"${quote.text} — ${quote.author}"` bằng `expo-speech` với `language: 'vi-VN'`
- Khi đọc xong → tự động advance index → đọc câu tiếp theo trong danh sách hiện tại
- Khi đến cuối danh sách → dừng (không loop)
- Nhấn stop (hoặc nhấn lại speaker) → `Speech.stop()`, trạng thái reset
- Chỉ 1 câu đang phát tại một thời điểm — bắt đầu câu mới tự động stop câu cũ
- Áp dụng ở Category detail screen và Favorites screen

**Hook interface (`hooks/useSpeech.ts`):**
```typescript
interface UseSpeechReturn {
  isPlaying: boolean;
  currentQuoteId: string | null;
  startAutoPlay: (quotes: Quote[], startIndex: number) => void;
  stop: () => void;
}
```

**State lưu trong hook** (không cần store — ephemeral, reset khi unmount):
- `isPlaying: boolean`
- `currentIndex: number`
- `quotes: Quote[]` (ref)

---

## Testing Strategy

Manual testing checklist (v1 — không cần test framework):

- [ ] Favorites persist sau khi kill app và mở lại
- [ ] Tap tim 2 lần → toggle (thêm rồi xóa)
- [ ] Copy toast hiện đúng 1.5s rồi biến mất
- [ ] Dark/light mode switch đúng khi đổi system theme
- [ ] Scroll 50 quotes smooth, không lag
- [ ] Chạy được trên cả iOS Simulator và Android Emulator
- [ ] Không crash khi quotes.json rỗng
- [ ] Tap speaker → app đọc đúng câu, giọng vi-VN
- [ ] Đọc xong câu → tự động chuyển sang câu kế tiếp
- [ ] Đến cuối danh sách → dừng, không crash
- [ ] Tap stop → dừng ngay, icon reset
- [ ] Navigate rời màn hình → TTS dừng (cleanup on unmount)

---

## Boundaries

- **Always:** TypeScript strict mode, không dùng `any`; follow naming conventions (camelCase vars, PascalCase components)
- **Ask first:** Thêm category mới; thay đổi data shape của quotes.json; thêm dependencies mới
- **Never:** Gọi network request; yêu cầu permission từ user; lưu data ra ngoài AsyncStorage

---

## Open Questions

*(Đã giải quyết)*
- ~~Bao nhiêu quotes?~~ → 50/category (200 tổng)
- ~~Copy clipboard?~~ → Có, với toast feedback
- ~~Light/dark?~~ → Cả hai, theo system theme
