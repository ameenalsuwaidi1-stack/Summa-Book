
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../store';
import { 
  Menu, X, Sun, Moon, Languages, BookOpen, 
  LayoutDashboard, User, LogOut, Settings, 
  Search, ShieldCheck, PlusCircle, List
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { state, t, toggleTheme, toggleLanguage, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t('browseBooks'), path: '/books' },
    { name: t('about'), path: '/' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              <BookOpen className="w-8 h-8" />
              <span>{t('brand')}</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium">
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Languages size={20} />
            </button>

            {state.user ? (
              <div className="flex items-center gap-4">
                <Link to={state.user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
                  {state.user.role === 'admin' ? <ShieldCheck size={18} /> : <LayoutDashboard size={18} />}
                  <span>{state.user.role === 'admin' ? t('admin') : t('dashboard')}</span>
                </Link>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium">{t('login')}</Link>
                <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md">{t('register')}</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2"><Moon size={18} /></button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2"><Menu size={24} /></button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="block text-lg font-medium py-2">{link.name}</Link>
          ))}
          <button onClick={toggleLanguage} className="flex items-center gap-2 w-full py-2 text-lg font-medium">
            <Languages size={20} /> {state.language === 'en' ? 'العربية' : 'English'}
          </button>
          {state.user ? (
            <Link to="/dashboard" className="block w-full py-3 bg-indigo-600 text-white text-center rounded-lg">{t('dashboard')}</Link>
          ) : (
            <Link to="/login" className="block w-full py-3 bg-indigo-600 text-white text-center rounded-lg">{t('login')}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export const Sidebar: React.FC<{ role: 'user' | 'admin' }> = ({ role }) => {
  const { t, state } = useApp();
  const menuItems = role === 'admin' ? [
    { icon: <LayoutDashboard size={20} />, label: t('dashboard'), path: '/admin' },
    { icon: <PlusCircle size={20} />, label: t('upload'), path: '/admin/upload' },
    { icon: <List size={20} />, label: t('manageBooks'), path: '/admin/manage' },
    { icon: <Settings size={20} />, label: t('profile'), path: '/profile' },
  ] : [
    { icon: <LayoutDashboard size={20} />, label: t('dashboard'), path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: t('browseBooks'), path: '/books' },
    { icon: <User size={20} />, label: t('profile'), path: '/profile' },
    { icon: <Settings size={20} />, label: t('settings'), path: '/settings' },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-64px)] hidden lg:block sticky top-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
      <div className="flex flex-col gap-1">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      
      {state.user && (
        <div className="mt-auto pt-8">
           <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
             <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2">{t('myStats')}</p>
             <div className="flex justify-between items-center text-sm font-semibold mb-1">
                <span>{t('booksRead')}</span>
                <span className="text-indigo-600">{state.user.stats.booksRead}</span>
             </div>
             <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[65%]"></div>
             </div>
           </div>
        </div>
      )}
    </aside>
  );
};

export const Footer: React.FC = () => {
  const { t } = useApp();
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-2xl mb-6">
          <BookOpen className="w-8 h-8" />
          <span>{t('brand')}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
          {t('heroSub')}
        </p>
        <div className="flex flex-wrap justify-center gap-8 mb-10 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">{t('about')}</Link>
          <Link to="/" className="hover:text-indigo-600 transition-colors">{t('contact')}</Link>
          <Link to="/" className="hover:text-indigo-600 transition-colors">{t('privacy')}</Link>
          <Link to="/" className="hover:text-indigo-600 transition-colors">{t('terms')}</Link>
        </div>
        <div className="text-slate-400 dark:text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} {t('brand')}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
