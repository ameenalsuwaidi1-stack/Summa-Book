import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Language, Theme, Book } from './types';
import { translations } from './translations';
import { db } from './db';
import { api } from './api';

interface AppContextType {
  state: AppState;
  loading: boolean;
  t: (key: keyof typeof translations['en']) => string;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateProgress: (bookId: string, progress: number) => void;
  refreshBooks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<AppState>(() => {
    const settings = db.getSettings();
    const user = db.getCurrentUser();
    const books = db.getBooks();

    return {
      language: settings.language as Language,
      theme: settings.theme as Theme,
      user,
      books
    };
  });

  useEffect(() => {
    db.saveSettings({ language: state.language, theme: state.theme });
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = state.language === 'ar' ? 'rtl bg-slate-50 dark:bg-slate-950' : 'bg-slate-50 dark:bg-slate-950';
  }, [state.language, state.theme]);

  useEffect(() => {
    db.saveBooks(state.books);
  }, [state.books]);

  useEffect(() => {
    db.saveCurrentUser(state.user);
  }, [state.user]);

  const t = useCallback((key: keyof typeof translations['en']) => {
    return translations[state.language][key] || key;
  }, [state.language]);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'en' ? 'ar' : 'en' }));
  };

  const refreshBooks = async () => {
    setLoading(true);
    try {
      const books = await api.fetchBooks();
      if (books.length > 0) {
        setState(prev => ({ ...prev, books }));
      }
    } catch (error) {
      console.warn('API unavailable, using local books cache.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshBooks();
  }, []);

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const user = await api.login(email, pass);
      setState(prev => ({ ...prev, user }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      await api.register(name, email, pass);
      return handleLogin(email, pass);
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await api.logout();
    setState(prev => ({ ...prev, user: null }));
    setLoading(false);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    setLoading(true);
    try {
      await api.updateBook(updatedBook);
      await refreshBooks();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    setLoading(true);
    try {
      await api.deleteBook(id);
      await refreshBooks();
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook: Omit<Book, 'id'>) => {
    setLoading(true);
    try {
      await api.addBook(newBook);
      await refreshBooks();
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (bookId: string, progress: number) => {
    if (!state.user) return;
    void api.trackProgress(state.user.id, bookId, progress);
    setState(prev => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          readingProgress: { ...prev.user.readingProgress, [bookId]: progress }
        }
      };
    });
  };

  return (
    <AppContext.Provider value={{
      state, loading, t, toggleTheme, toggleLanguage,
      login: handleLogin, register: handleRegister, logout: handleLogout,
      updateBook: handleUpdateBook, deleteBook: handleDeleteBook,
      addBook: handleAddBook, updateProgress, refreshBooks
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
