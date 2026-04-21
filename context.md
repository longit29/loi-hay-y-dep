# Project Context

## What this is
Mobile app hiển thị lời hay ý đẹp (Vietnamese quotes) theo chủ đề. Offline-first, không cần tài khoản.

## Tech decisions & why

| Decision | Reason |
|----------|--------|
| Expo SDK 54 + Expo Router v6 | Version lock — expo-router@55 incompatible với expo@54 |
| Zustand (not Context/Redux) | Đủ nhỏ cho state model này, persist dễ dàng |
| AsyncStorage (not MMKV) | Đủ dùng cho array of string IDs, zero native config |
| Local JSON (not API) | Offline-first, zero latency, zero infra |
| `get*` naming in useQuotes.ts | Đây là pure functions, không phải React hooks — đặt `use*` gây confusion với linter |
| `countByCategory` module-level Map | Tránh scan 200 quotes × N renders trên Home screen |
| No iOS toast overlay | Position absolute trong FlatList cell bị clip — dùng checkmark icon thay thế |

## Known tradeoffs (intentional)
- Favorites không sync giữa devices (local only) — v1 scope
- Không có search — v2 feature
- Không có dark/light toggle thủ công — follow system only
- 5 low-severity npm audit vulns trong `jest-expo` (devDep only, không vào production)

## File không cần thiết (có thể xóa sau)
- `components/external-link.tsx` — từ default template, chưa dùng
- `components/haptic-tab.tsx` — từ default template, chưa dùng (tab layout dùng Ionicons trực tiếp)
- `components/hello-wave.tsx`, `parallax-scroll-view.tsx`, `themed-text.tsx`, `themed-view.tsx` — boilerplate
- `components/ui/collapsible.tsx`, `icon-symbol.tsx` — boilerplate
- `app/modal.tsx` — chưa dùng
- `assets/images/partial-react-logo.png`, `react-logo*.png` — từ template

## EAS Project
- Project ID: `b297bb23-ab34-40f4-a981-fbbdf06c049c` (trong app.json)
- Bundle ID iOS: `com.loihayydep.app`
- Package Android: `com.loihayydep.app`

## Test coverage
- `favoritesStore` — toggle, isFavorite, persist, revert on error, double-hydrate
- `useQuotes` helpers — filter, find, empty cases
- `quotesData` — schema, 200 quotes, unique IDs, valid category refs
