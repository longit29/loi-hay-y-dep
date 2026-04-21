import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'loi-hay-y-dep:favorites';

interface FavoritesState {
  favoriteIds: string[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      set({ favoriteIds: ids, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  toggle: async (id: string) => {
    const { favoriteIds } = get();
    const next = favoriteIds.includes(id)
      ? favoriteIds.filter((fid) => fid !== id)
      : [...favoriteIds, id];
    set({ favoriteIds: next });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Revert in-memory state if persistence fails
      set({ favoriteIds });
    }
  },

  isFavorite: (id: string) => get().favoriteIds.includes(id),
}));
