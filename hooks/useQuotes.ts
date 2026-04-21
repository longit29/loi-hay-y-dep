import quotesData from '@/data/quotes.json';
import { Quote, Category, QuotesData } from '@/types';

const data = quotesData as QuotesData;

export function getCategories(): Category[] {
  return data.categories;
}

export function getQuotesByCategory(categoryId: string): Quote[] {
  return data.quotes.filter((q) => q.categoryId === categoryId);
}

export function getQuoteById(id: string): Quote | undefined {
  return data.quotes.find((q) => q.id === id);
}

export function getQuotesByIds(ids: string[]): Quote[] {
  return ids
    .map((id) => data.quotes.find((q) => q.id === id))
    .filter((q): q is Quote => q !== undefined);
}

export function getCategoryById(id: string): Category | undefined {
  return data.categories.find((c) => c.id === id);
}
