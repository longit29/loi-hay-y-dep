/**
 * Data integrity tests — validates quotes.json matches expected schema
 * and has no duplicates or malformed entries.
 */

import data from '../data/quotes.json';
import { QuotesData } from '../types';

const typedData = data as QuotesData;

describe('quotes.json — structure', () => {
  it('has categories array', () => {
    expect(Array.isArray(typedData.categories)).toBe(true);
  });

  it('has quotes array', () => {
    expect(Array.isArray(typedData.quotes)).toBe(true);
  });

  it('has exactly 4 categories', () => {
    expect(typedData.categories).toHaveLength(4);
  });

  it('has exactly 200 quotes total', () => {
    expect(typedData.quotes).toHaveLength(200);
  });

  it('has 50 quotes per category', () => {
    const categoryIds = typedData.categories.map((c) => c.id);
    categoryIds.forEach((id) => {
      const count = typedData.quotes.filter((q) => q.categoryId === id).length;
      expect(count).toBe(50);
    });
  });
});

describe('quotes.json — quote ids are unique', () => {
  it('no duplicate quote ids', () => {
    const ids = typedData.quotes.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('quotes.json — all quotes reference valid categories', () => {
  it('every quote.categoryId exists in categories', () => {
    const validIds = new Set(typedData.categories.map((c) => c.id));
    typedData.quotes.forEach((q) => {
      expect(validIds.has(q.categoryId)).toBe(true);
    });
  });
});

describe('quotes.json — quote content', () => {
  it('every quote has non-empty text', () => {
    typedData.quotes.forEach((q) => {
      expect(q.text.trim().length).toBeGreaterThan(0);
    });
  });

  it('every quote has non-empty author', () => {
    typedData.quotes.forEach((q) => {
      expect(q.author.trim().length).toBeGreaterThan(0);
    });
  });

  it('no quote text is shorter than 20 characters', () => {
    typedData.quotes.forEach((q) => {
      expect(q.text.length).toBeGreaterThanOrEqual(20);
    });
  });
});

describe('quotes.json — category shape', () => {
  it('every category has a valid hex color', () => {
    typedData.categories.forEach((c) => {
      expect(c.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('every category has a non-empty icon', () => {
    typedData.categories.forEach((c) => {
      expect(c.icon.trim().length).toBeGreaterThan(0);
    });
  });
});
