
import React from 'react';
import { Book, Language } from '../types';
import { useApp } from '../store';
import { Star, Clock, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const { state, t } = useApp();
  const lang = state.language;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img src={book.cover} alt={book.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {book.rating}
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
           <Link to={`/book/${book.id}`} className="block w-full py-2 bg-white text-black text-center text-sm font-bold rounded-lg">
             {t('startReading')}
           </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
          <span>{book.category[lang]}</span>
        </div>
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{book.title[lang]}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{book.author[lang]}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{book.readTime} {t('readingTime')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{book.views > 1000 ? `${(book.views/1000).toFixed(1)}k` : book.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`}></div>
);

export const Toast: React.FC<{ message: string; type?: 'info' | 'success' | 'error'; onClose: () => void }> = ({ message, type = 'info', onClose }) => {
  const colors = {
    info: 'bg-slate-800 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white'
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${colors[type]}`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full transition-colors">&times;</button>
    </div>
  );
};
