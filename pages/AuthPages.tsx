
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store';
import { BookOpen, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, t } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
           <div className="inline-flex w-16 h-16 items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20 mb-4">
              <BookOpen size={32} />
           </div>
           <h2 className="text-3xl font-black">{t('login')}</h2>
           <p className="text-slate-500">Welcome back to your library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="email" 
                   required
                   placeholder="Email address"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="password" 
                   required
                   placeholder="Password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
           </div>

           <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
              {t('login')}
              <ArrowRight size={20} />
           </button>
        </form>

        <div className="relative">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
           <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-slate-500">Or continue with</span></div>
        </div>

        <button className="w-full py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
           <Github size={20} />
           GitHub
        </button>

        <p className="text-center text-slate-500 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold underline decoration-2 underline-offset-4">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { login, t } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
           <h2 className="text-3xl font-black">{t('register')}</h2>
           <p className="text-slate-500">Start your knowledge journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="text" 
                   required
                   placeholder="Full Name"
                   value={name}
                   onChange={e => setName(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="email" 
                   required
                   placeholder="Email address"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="password" 
                   required
                   placeholder="Password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
           </div>

           <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
              Create Account
           </button>
        </form>

        <p className="text-center text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold underline decoration-2 underline-offset-4">{t('login')}</Link>
        </p>
      </div>
    </div>
  );
};
