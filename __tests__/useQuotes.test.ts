/**
 * Tests for useQuotes helpers — pure functions over static JSON data.
 */

import {
  getCategories,
  getQuotesByCategory,
  getQuoteById,
  getQuotesByIds,
  getCategoryById,
} from '../hooks/useQuotes';

describe('getCategories', () => {
  it('returns exactly 4 categories', () => {
    expect(getCategories()).toHaveLength(4);
  });

  it('includes the expected category ids', () => {
    const ids = getCategories().map((c) => c.id);
    expect(ids).toContain('cuoc-song');
    expect(ids).toContain('tinh-yeu');
    expect(ids).toContain('thanh-cong');
    expect(ids).toContain('ban-than');
  });

  it('each category has required fields: id, name, icon, color', () => {
    getCategories().forEach((c) => {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.icon).toBeTruthy();
      expect(c.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe('getQuotesByCategory', () => {
  it('returns 50 quotes for cuoc-song', () => {
    expect(getQuotesByCategory('cuoc-song')).toHaveLength(50);
  });

  it('returns 50 quotes for tinh-yeu', () => {
    expect(getQuotesByCategory('tinh-yeu')).toHaveLength(50);
  });

  it('returns 50 quotes for thanh-cong', () => {
    expect(getQuotesByCategory('thanh-cong')).toHaveLength(50);
  });

  it('returns 50 quotes for ban-than', () => {
    expect(getQuotesByCategory('ban-than')).toHaveLength(50);
  });

  it('returns empty array for unknown category', () => {
    expect(getQuotesByCategory('unknown')).toHaveLength(0);
  });

  it('all returned quotes belong to the requested category', () => {
    const quotes = getQuotesByCategory('tinh-yeu');
    quotes.forEach((q) => {
      expect(q.categoryId).toBe('tinh-yeu');
    });
  });

  it('each quote has required fields: id, text, author, categoryId', () => {
    getQuotesByCategory('cuoc-song').forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.text.length).toBeGreaterThan(10);
      expect(q.author).toBeTruthy();
      expect(q.categoryId).toBe('cuoc-song');
    });
  });
});

describe('getQuoteById', () => {
  it('finds a quote by known id', () => {
    const q = getQuoteById('cs001');
    expect(q).toBeDefined();
    expect(q?.id).toBe('cs001');
  });

  it('returns undefined for unknown id', () => {
    expect(getQuoteById('nonexistent-id')).toBeUndefined();
  });
});

describe('getQuotesByIds', () => {
  it('returns quotes matching the given ids in order', () => {
    const quotes = getQuotesByIds(['cs001', 'ty001']);
    expect(quotes).toHaveLength(2);
    expect(quotes[0].id).toBe('cs001');
    expect(quotes[1].id).toBe('ty001');
  });

  it('returns empty array for empty input', () => {
    expect(getQuotesByIds([])).toHaveLength(0);
  });

  it('skips ids that do not exist', () => {
    const quotes = getQuotesByIds(['cs001', 'bad-id', 'ty001']);
    expect(quotes).toHaveLength(2);
  });
});

describe('getCategoryById', () => {
  it('finds a category by known id', () => {
    const cat = getCategoryById('cuoc-song');
    expect(cat).toBeDefined();
    expect(cat?.name).toBe('Cuộc sống');
  });

  it('returns undefined for unknown id', () => {
    expect(getCategoryById('xyz')).toBeUndefined();
  });
});
