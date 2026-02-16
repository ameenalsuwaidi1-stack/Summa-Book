
import React from 'react';
import { useApp } from '../store';
import { BookCard } from '../components/UI';
import { ArrowRight, Zap, Award, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { state, t } = useApp();
  const featured = state.books.slice(0, 3);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left rtl:lg:text-right space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold border border-indigo-100 dark:border-indigo-800">
              <Zap size={16} />
              <span>{t('latest')}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              {t('heroSub')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 lg:justify-start justify-center">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2">
                {t('getStarted')}
                <ArrowRight size={20} className="rtl:rotate-180" />
              </Link>
              <Link to="/books" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                {t('browseBooks')}
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-10 duration-1000">
             <div className="space-y-6 pt-12">
                <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/seed/book1/400/600" className="w-full h-auto" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/seed/book2/400/600" className="w-full h-auto" />
                </div>
             </div>
             <div className="space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/seed/book3/400/600" className="w-full h-auto" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/seed/book4/400/600" className="w-full h-auto" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 shadow-2xl shadow-indigo-500/5 grid md:grid-cols-3 gap-12 text-center">
           <div>
              <div className="text-4xl font-black text-indigo-600 mb-2">500+</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Bestselling Summaries</div>
           </div>
           <div className="border-x border-slate-100 dark:border-slate-800">
              <div className="text-4xl font-black text-indigo-600 mb-2">12M+</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Minutes Read Yearly</div>
           </div>
           <div>
              <div className="text-4xl font-black text-indigo-600 mb-2">50k+</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Happy Readers</div>
           </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">{t('featured')}</h2>
            <p className="text-slate-500 dark:text-slate-400">{t('popular')}</p>
          </div>
          <Link to="/books" className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
            {t('browseBooks')}
            <ArrowRight size={20} className="rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-24">
         <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SummaBook?</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Our platform is designed to make learning seamless, fast, and enjoyable on any device.</p>
         </div>
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
            {[
              { icon: <Globe />, title: "Bilingual Content", desc: "Switch instantly between Arabic and English summaries with perfectly crafted translations." },
              { icon: <Award />, title: "Premium Curation", desc: "We only select top-tier non-fiction books that provide real, actionable value for your life." },
              { icon: <ShieldCheck />, title: "Reading Progress", desc: "Never lose your place. Our intelligent system tracks your progress across all your devices." }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                 <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
                   {/* Cast to include size prop to fix TypeScript cloning error */}
                   {React.cloneElement(feature.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
                 </div>
                 <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                 <p className="text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
