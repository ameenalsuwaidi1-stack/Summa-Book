
import { Book, User } from './types';

// The base URL for your API on cPanel
const API_BASE = '/api/index.php';

export const api = {
  login: async (email: string, pass: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) throw new Error('Invalid login');
    const rawUser = await res.json();
    
    // Transform flat DB structure to nested TS structure
    return {
      ...rawUser,
      favorites: [],
      readingProgress: {},
      stats: { booksRead: 12, streak: 5, minutesRead: 450 }
    };
  },

  logout: async () => {
    // Session cleanup if needed
  },

  fetchBooks: async (): Promise<Book[]> => {
    const res = await fetch(`${API_BASE}/books`);
    const data = await res.json();
    
    // Map DB flat rows to nested Book objects
    return data.map((b: any) => ({
      id: b.id,
      title: { en: b.title_en, ar: b.title_ar },
      author: { en: b.author_en, ar: b.author_ar },
      category: { en: b.category_en, ar: b.category_ar },
      summary: { en: b.summary_en, ar: b.summary_ar },
      content: { en: b.content_en, ar: b.content_ar },
      cover: b.cover,
      readTime: b.readTime,
      rating: parseFloat(b.rating),
      views: b.views,
      createdAt: b.createdAt
    }));
  },

  addBook: async (book: Omit<Book, 'id'>): Promise<void> => {
    await fetch(`${API_BASE}/books`, {
      method: 'POST',
      body: JSON.stringify(book)
    });
  },

  // Added updateBook method to fix the error in store.tsx
  updateBook: async (book: Book): Promise<void> => {
    await fetch(`${API_BASE}/books/${book.id}`, {
      method: 'PUT',
      body: JSON.stringify(book)
    });
  },

  deleteBook: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE'
    });
  },

  trackProgress: async (userId: string, bookId: string, progress: number) => {
    await fetch(`${API_BASE}/progress`, {
      method: 'POST',
      body: JSON.stringify({ userId, bookId, progress })
    });
  }
};
