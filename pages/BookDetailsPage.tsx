
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Clock, Star, BookOpen, Share2, Heart, ArrowLeft, ArrowRight } from 'lucide-react';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { state, t } = useApp();
  const navigate = useNavigate();
  const lang = state.language;

  const book = state.books.find(b => b.id === id);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Book not found</h2>
        <Link to="/books" className="text-indigo-600 font-bold">Back to library</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/books" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-all">
        <ArrowLeft size={18} className="rtl:rotate-180" />
        <span>{t('browseBooks')}</span>
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cover */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 dark:border-slate-800">
            <img src={book.cover} className="w-full h-auto" />
          </div>
          <div className="flex gap-4">
             <button className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <Heart size={20} className="text-slate-400" />
                <span>Save</span>
             </button>
             <button className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <Share2 size={20} className="text-slate-400" />
                <span>Share</span>
             </button>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">
                {book.category[lang]}
              </div>
              <h1 className="text-5xl font-black">{book.title[lang]}</h1>
              <p className="text-xl text-slate-500 font-medium">{book.author[lang]}</p>
           </div>

           <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600">
                    <Star size={20} className="fill-yellow-600" />
                 </div>
                 <div>
                    <div className="font-bold">{book.rating}</div>
                    <div className="text-xs text-slate-400">Avg Rating</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                    <Clock size={20} />
                 </div>
                 <div>
                    <div className="font-bold">{book.readTime} mins</div>
                    <div className="text-xs text-slate-400">Est. Read</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                    <BookOpen size={20} />
                 </div>
                 <div>
                    <div className="font-bold">Summary</div>
                    <div className="text-xs text-slate-400">Available</div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-2xl font-bold">What's it about?</h3>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {book.summary[lang]}
              </p>
           </div>

           <div className="pt-8">
             <Link to={`/reader/${book.id}`} className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-600/30">
               {t('startReading')}
               <ArrowRight size={24} className="rtl:rotate-180" />
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
