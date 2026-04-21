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

export interface QuotesData {
  categories: Category[];
  quotes: Quote[];
}
