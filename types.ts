
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Book {
  id: string;
  title: { en: string; ar: string };
  author: { en: string; ar: string };
  category: { en: string; ar: string };
  cover: string;
  summary: { en: string; ar: string };
  content: { en: string; ar: string };
  readTime: number;
  rating: number;
  views: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  favorites: string[];
  readingProgress: Record<string, number>; // bookId -> progress percentage
  stats: {
    booksRead: number;
    streak: number;
    minutesRead: number;
  };
}

export interface AppState {
  language: Language;
  theme: Theme;
  user: User | null;
  books: Book[];
}
