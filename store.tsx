
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Language, Theme, User, Book } from './types';
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
    const books = await api.fetchBooks();
    setState(prev => ({ ...prev, books }));
    setLoading(false);
  };

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const user = await api.login(email, pass);
      setState(prev => ({ ...prev, user }));
      return true;
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
    await api.updateBook(updatedBook);
    await refreshBooks();
  };

  const handleDeleteBook = async (id: string) => {
    setLoading(true);
    await api.deleteBook(id);
    await refreshBooks();
  };

  const handleAddBook = async (newBook: Omit<Book, 'id'>) => {
    setLoading(true);
    await api.addBook(newBook);
    await refreshBooks();
  };

  const updateProgress = (bookId: string, progress: number) => {
    if (!state.user) return;
    api.trackProgress(state.user.id, bookId, progress);
    // Silent state update for UI responsiveness
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
      login: handleLogin, logout: handleLogout, 
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
