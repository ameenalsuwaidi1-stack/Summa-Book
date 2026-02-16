
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { BookCard } from '../components/UI';
import { Search, Filter, SortAsc, LayoutGrid, List } from 'lucide-react';

const BooksPage: React.FC = () => {
  const { state, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const lang = state.language;

  const categories = useMemo(() => {
    const cats = new Set(state.books.map(b => b.category[lang]));
    return ['all', ...Array.from(cats)];
  }, [state.books, lang]);

  const filteredBooks = state.books.filter(book => {
    const matchesSearch = book.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author[lang].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category[lang] === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl font-black">{t('browseBooks')}</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-4" size={20} />
            <input 
              type="text" 
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 rtl:pl-6 rtl:pr-12 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                selectedCategory === cat 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
              }`}
            >
              {cat === 'all' ? t('allCategories') : cat}
            </button>
          ))}
        </div>
      </header>

      {filteredBooks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
           <Search size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-6" />
           <p className="text-xl font-bold text-slate-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
