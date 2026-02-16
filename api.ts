import { Book, User } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api/index.php';

const defaultStats = { booksRead: 0, streak: 0, minutesRead: 0 };

const mapUser = (rawUser: Record<string, unknown>): User => ({
  id: String(rawUser.id),
  name: String(rawUser.name || ''),
  email: String(rawUser.email || ''),
  avatar: String(rawUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'),
  role: rawUser.role === 'admin' ? 'admin' : 'user',
  favorites: [],
  readingProgress: {},
  stats: defaultStats
});

const mapBook = (b: Record<string, any>): Book => ({
  id: String(b.id),
  title: { en: b.title_en, ar: b.title_ar },
  author: { en: b.author_en, ar: b.author_ar },
  category: { en: b.category_en, ar: b.category_ar },
  summary: { en: b.summary_en, ar: b.summary_ar },
  content: { en: b.content_en, ar: b.content_ar },
  cover: b.cover,
  readTime: Number(b.readTime || 10),
  rating: Number(b.rating || 0),
  views: Number(b.views || 0),
  createdAt: b.createdAt || new Date().toISOString()
});

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
};

export const api = {
  login: async (email: string, pass: string): Promise<User> => {
    const rawUser = await request<Record<string, unknown>>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });

    return mapUser(rawUser);
  },

  register: async (name: string, email: string, pass: string): Promise<void> => {
    await request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: pass })
    });
  },

  logout: async () => {
    return Promise.resolve();
  },

  fetchBooks: async (): Promise<Book[]> => {
    const data = await request<Record<string, any>[]>('/books');
    return data.map(mapBook);
  },

  addBook: async (book: Omit<Book, 'id'>): Promise<void> => {
    await request('/books', {
      method: 'POST',
      body: JSON.stringify(book)
    });
  },

  updateBook: async (book: Book): Promise<void> => {
    await request(`/books/${book.id}`, {
      method: 'PUT',
      body: JSON.stringify(book)
    });
  },

  deleteBook: async (id: string): Promise<void> => {
    await request(`/books/${id}`, {
      method: 'DELETE'
    });
  },

  trackProgress: async (userId: string, bookId: string, progress: number) => {
    await request('/progress', {
      method: 'POST',
      body: JSON.stringify({ userId, bookId, progress })
    });
  }
};
