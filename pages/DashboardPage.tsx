
import React from 'react';
import { useApp } from '../store';
import { Sidebar } from '../components/Layout';
import { BookCard } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, Flame, Calendar, BookOpen } from 'lucide-react';

const data = [
  { name: 'Mon', mins: 12 },
  { name: 'Tue', mins: 45 },
  { name: 'Wed', mins: 30 },
  { name: 'Thu', mins: 15 },
  { name: 'Fri', mins: 55 },
  { name: 'Sat', mins: 70 },
  { name: 'Sun', mins: 40 },
];

const DashboardPage: React.FC = () => {
  const { state, t } = useApp();
  const user = state.user;
  const continueReading = state.books.slice(0, 2);

  if (!user) return null;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar role="user" />
      <main className="flex-1 p-4 lg:p-10 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black">{t('welcomeBack')}, {user.name}! 👋</h1>
              <p className="text-slate-500 font-medium">Ready to gain some new wisdom today?</p>
           </div>
           <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src={user.avatar} className="w-12 h-12 rounded-xl" />
              <div className="pr-4">
                 <div className="font-bold text-sm">Free Account</div>
                 <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Silver Badge</div>
              </div>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: t('booksRead'), value: user.stats.booksRead, icon: <BookOpen />, color: "bg-blue-600" },
             { label: t('streak'), value: `${user.stats.streak} Days`, icon: <Flame />, color: "bg-orange-500" },
             { label: t('minutes'), value: user.stats.minutesRead, icon: <TrendingUp />, color: "bg-green-500" },
             { label: "Points", value: 1240, icon: <Award />, color: "bg-purple-600" }
           ].map((stat, i) => (
             <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all">
                <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Chart */}
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                   <Calendar size={20} className="text-indigo-600" />
                   Weekly Reading Activity
                 </h3>
                 <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold py-2 px-4 rounded-xl border-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                       <defs>
                          <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <Tooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                       />
                       <Area type="monotone" dataKey="mins" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorMins)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Continue Reading */}
           <div className="space-y-6">
              <h3 className="text-xl font-bold px-2">{t('continueReading')}</h3>
              <div className="space-y-4">
                 {continueReading.map(book => (
                   <div key={book.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex gap-4 hover:shadow-lg transition-all group">
                      <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0">
                         <img src={book.cover} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                         <div>
                            <h4 className="font-bold text-sm mb-1 line-clamp-1">{book.title[state.language]}</h4>
                            <p className="text-xs text-slate-400">{book.author[state.language]}</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                               <span>Progress</span>
                               <span className="text-indigo-600">65%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600 w-[65%] rounded-full"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
                 <button className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                    View My Library
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
