
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ArrowLeft, Settings, Type, Moon, Sun, Maximize2, Minimize2, Bookmark, CheckCircle2 } from 'lucide-react';

const ReaderPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, t, updateProgress } = useApp();
  const [fontSize, setFontSize] = useState(20);
  const [isDarkMode, setIsDarkMode] = useState(state.theme === 'dark');
  const [progress, setProgress] = useState(0);
  const readerRef = useRef<HTMLDivElement>(null);
  
  const book = state.books.find(b => b.id === id);
  const lang = state.language;

  useEffect(() => {
    const handleScroll = () => {
      if (!readerRef.current) return;
      const element = readerRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const currentScroll = element.scrollTop;
      const percentage = Math.round((currentScroll / totalHeight) * 100);
      setProgress(percentage);
    };

    const element = readerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    // Save progress periodically or on unmount
    return () => {
      if (id && progress > 0) {
        updateProgress(id, progress);
      }
    };
  }, [id, progress, updateProgress]);

  if (!book) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} transition-colors`}>
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} className="rtl:rotate-180" />
          </button>
          <div>
            <h1 className="font-bold text-sm leading-tight line-clamp-1">{book.title[lang]}</h1>
            <p className="text-[10px] text-slate-400">{book.author[lang]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button onClick={() => setFontSize(f => Math.min(f + 2, 40))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
             <Type size={18} />
           </button>
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">
             {t('save')}
           </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full flex-shrink-0">
        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Content */}
      <main ref={readerRef} className="flex-1 overflow-y-auto pt-16 pb-32 scroll-smooth">
        <div className="max-w-2xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black leading-tight mb-2">{book.title[lang]}</h2>
              <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
                 <span>{book.author[lang]}</span>
                 <span>&bull;</span>
                 <span>{book.readTime} mins</span>
              </div>
           </div>

           <div 
             className="prose prose-lg dark:prose-invert max-w-none leading-relaxed tracking-wide"
             style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
           >
              {book.content[lang].split('\n').map((para, i) => (
                <p key={i} className="mb-8">{para}</p>
              ))}
              
              <div className="mt-20 p-12 bg-slate-100 dark:bg-slate-900 rounded-[3rem] text-center space-y-6">
                 <CheckCircle2 size={64} className="mx-auto text-green-500" />
                 <h3 className="text-3xl font-black">You've finished!</h3>
                 <p className="text-slate-500">Congratulations on completing another summary. Keep the momentum going.</p>
                 <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700">
                    Go to Dashboard
                 </button>
              </div>
           </div>
        </div>
      </main>

      {/* Bottom Floating Stats */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-8 text-xs font-bold text-slate-500">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>{progress}% Completed</span>
         </div>
         <div className="flex items-center gap-2">
            <Bookmark size={14} />
            <span>Chapter 1/1</span>
         </div>
      </div>
    </div>
  );
};

export default ReaderPage;
