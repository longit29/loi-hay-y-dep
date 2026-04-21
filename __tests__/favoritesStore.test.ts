/**
 * Tests for favoritesStore — toggle, isFavorite, state transitions
 */

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavoritesStore } from '../store/favoritesStore';

const STORAGE_KEY = 'loi-hay-y-dep:favorites';

beforeEach(() => {
  useFavoritesStore.setState({ favoriteIds: [], hydrated: false });
  jest.clearAllMocks();
});

describe('favoritesStore — toggle', () => {
  it('adds a quote id when toggled for the first time', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    expect(useFavoritesStore.getState().favoriteIds).toContain('cs001');
  });

  it('removes a quote id when toggled a second time', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    await useFavoritesStore.getState().toggle('cs001');
    expect(useFavoritesStore.getState().favoriteIds).not.toContain('cs001');
  });

  it('can hold multiple favorites independently', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    await useFavoritesStore.getState().toggle('ty001');
    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds).toContain('cs001');
    expect(favoriteIds).toContain('ty001');
    expect(favoriteIds).toHaveLength(2);
  });

  it('removing one favorite does not affect others', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    await useFavoritesStore.getState().toggle('ty001');
    await useFavoritesStore.getState().toggle('cs001');
    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds).not.toContain('cs001');
    expect(favoriteIds).toContain('ty001');
  });
});

describe('favoritesStore — isFavorite', () => {
  it('returns false for an id that has not been toggled', () => {
    expect(useFavoritesStore.getState().isFavorite('cs001')).toBe(false);
  });

  it('returns true after toggling an id on', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    expect(useFavoritesStore.getState().isFavorite('cs001')).toBe(true);
  });

  it('returns false after toggling an id off', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    await useFavoritesStore.getState().toggle('cs001');
    expect(useFavoritesStore.getState().isFavorite('cs001')).toBe(false);
  });
});

describe('favoritesStore — AsyncStorage persistence', () => {
  it('calls AsyncStorage.setItem with namespaced key when toggling', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(['cs001'])
    );
  });

  it('saves empty array to AsyncStorage when last favorite is removed', async () => {
    await useFavoritesStore.getState().toggle('cs001');
    await useFavoritesStore.getState().toggle('cs001');
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      STORAGE_KEY,
      JSON.stringify([])
    );
  });

  it('hydrate loads favorites from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(['cs001', 'ty001'])
    );
    await useFavoritesStore.getState().hydrate();
    const { favoriteIds, hydrated } = useFavoritesStore.getState();
    expect(favoriteIds).toEqual(['cs001', 'ty001']);
    expect(hydrated).toBe(true);
  });

  it('hydrate sets hydrated=true even on AsyncStorage error', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      new Error('storage unavailable')
    );
    await useFavoritesStore.getState().hydrate();
    expect(useFavoritesStore.getState().hydrated).toBe(true);
  });

  it('reverts in-memory state when AsyncStorage.setItem fails', async () => {
    // Pre-seed a favorite
    useFavoritesStore.setState({ favoriteIds: ['cs001'], hydrated: true });
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
      new Error('disk full')
    );
    await useFavoritesStore.getState().toggle('ty001');
    // Should revert to original ['cs001'] because write failed
    expect(useFavoritesStore.getState().favoriteIds).toEqual(['cs001']);
  });

  it('calling hydrate twice does not duplicate entries', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(['cs001'])
    );
    await useFavoritesStore.getState().hydrate();
    await useFavoritesStore.getState().hydrate();
    expect(useFavoritesStore.getState().favoriteIds).toEqual(['cs001']);
  });
});
