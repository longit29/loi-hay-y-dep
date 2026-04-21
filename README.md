# Lời Hay Ý Đẹp

Ứng dụng mobile lưu trữ những câu nói hay, ý nghĩa theo chủ đề. Hoạt động hoàn toàn offline.

## Tính năng

- **200 câu trích dẫn** chia theo 4 chủ đề: Cuộc sống, Tình yêu, Thành công, Bản thân
- **Yêu thích** — lưu câu trích dẫn, tự động persist khi tắt/mở app
- **Sao chép** — copy nội dung vào clipboard chỉ với 1 tap
- **Dark / Light mode** — tự động theo cài đặt hệ thống
- **Không cần tài khoản**, không cần internet

## Yêu cầu

- Node.js 18+
- iOS Simulator hoặc Android Emulator (hoặc thiết bị thật + Expo Go)

## Cài đặt

```bash
npm install
npx expo start
```

Quét QR code bằng **Expo Go** app, hoặc nhấn `i` (iOS) / `a` (Android).

## Lệnh

```bash
npm start              # Dev server
npm run android        # Android emulator
npm run ios            # iOS simulator (cần macOS)
npm test               # 42 tests
npm run test:coverage  # Tests + coverage
npx tsc --noEmit       # TypeScript check
npx expo lint          # ESLint
```

## Cấu trúc

```
app/
  (tabs)/
    index.tsx       — Trang chủ: danh sách chủ đề
    favorites.tsx   — Câu đã yêu thích
  category/[id].tsx — Danh sách quotes trong chủ đề
components/
  QuoteCard.tsx     — Hiển thị quote + copy + tim
  CategoryCard.tsx  — Card chủ đề
  HeartButton.tsx   — Nút yêu thích với animation
store/
  favoritesStore.ts — Zustand + AsyncStorage persist
data/
  quotes.json       — 200 câu trích dẫn
constants/
  theme.ts          — Màu, font, spacing (light/dark)
```

## Build production

```bash
npm install -g eas-cli
eas login
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

## Tech stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Navigation | Expo Router v6 |
| State | Zustand v5 |
| Storage | AsyncStorage v2 |
| Language | TypeScript 5.9 |
| Fonts | Playfair Display + Inter |
| Tests | Jest + jest-expo (42 tests) |
