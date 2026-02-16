
import React, { useState } from 'react';
import { useApp } from '../store';
import { Sidebar } from '../components/Layout';
import { Plus, Edit, Trash2, Search, Upload, BookOpen, Users, BarChart3, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHome: React.FC = () => {
  const { state, loading } = useApp();
  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
       <Sidebar role="admin" />
       <main className="flex-1 p-8 space-y-10">
          <header className="flex items-center justify-between">
             <h1 className="text-3xl font-black">Admin Dashboard</h1>
             <Link to="/admin/upload" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20">
                <Plus size={20} />
                Upload Book
             </Link>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center"><BookOpen size={32} /></div>
                <div>
                   <div className="text-3xl font-black">{state.books.length}</div>
                   <div className="text-slate-500 font-medium">Total Summaries</div>
                </div>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
                <div>
                   <div className="text-3xl font-black">1,240</div>
                   <div className="text-slate-500 font-medium">Active Readers</div>
                </div>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center"><BarChart3 size={32} /></div>
                <div>
                   <div className="text-3xl font-black">42.5k</div>
                   <div className="text-slate-500 font-medium">Total Views</div>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Uploads</h2>
                <Link to="/admin/manage" className="text-indigo-600 font-bold flex items-center gap-1 text-sm">
                   View All <ChevronRight size={16} />
                </Link>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {state.books.slice(0, 5).map(book => (
                  <div key={book.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                     <div className="flex items-center gap-4">
                        <img src={book.cover} className="w-12 h-16 rounded-lg object-cover" />
                        <div>
                           <div className="font-bold">{book.title.en}</div>
                           <div className="text-xs text-slate-500">{book.author.en} &bull; {book.category.en}</div>
                        </div>
                     </div>
                     <div className="text-xs font-bold text-slate-400">
                        Added {new Date(book.createdAt).toLocaleDateString()}
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </main>
    </div>
  );
};

export const AdminManage: React.FC = () => {
  const { state, deleteBook, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = state.books.filter(b => 
    b.title.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBook(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
       <Sidebar role="admin" />
       <main className="flex-1 p-8 space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
                <h1 className="text-3xl font-black">Manage Books</h1>
                <p className="text-slate-500">Edit, delete or view library contents.</p>
             </div>
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search books..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-6 outline-none"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </header>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
             <table className="w-full text-left rtl:text-right border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                   <tr>
                      <th className="p-6">Book Info</th>
                      <th className="p-6">Category</th>
                      <th className="p-6">Stats</th>
                      <th className="p-6 text-center">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {filtered.map(book => (
                     <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="p-6">
                           <div className="flex items-center gap-4">
                              <img src={book.cover} className="w-10 h-14 rounded-lg object-cover" />
                              <div>
                                 <div className="font-bold text-slate-900 dark:text-slate-100">{book.title.en}</div>
                                 <div className="text-xs text-slate-500">{book.author.en}</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold">
                              {book.category.en}
                           </span>
                        </td>
                        <td className="p-6">
                           <div className="text-sm font-bold">{book.views.toLocaleString()} views</div>
                           <div className="text-xs text-slate-400">{book.rating} rating</div>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center justify-center gap-2">
                              <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 rounded-lg transition-all">
                                 <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => setDeleteId(book.id)}
                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Delete Modal */}
          {deleteId && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                     <AlertTriangle size={40} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black">Are you sure?</h3>
                     <p className="text-slate-500">This action cannot be undone. This summary will be permanently deleted from the database.</p>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 font-bold rounded-2xl">Cancel</button>
                     <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20">Delete</button>
                  </div>
               </div>
            </div>
          )}

          {loading && (
             <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold">Processing request...</span>
             </div>
          )}
       </main>
    </div>
  );
};

export const AdminUpload: React.FC = () => {
  const { addBook, loading } = useApp();
  const [formData, setFormData] = useState({
    titleEn: '', titleAr: '', authorEn: '', authorAr: '',
    catEn: '', catAr: '', summaryEn: '', summaryAr: '',
    contentEn: '', contentAr: '', readTime: 15
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook({
      title: { en: formData.titleEn, ar: formData.titleAr },
      author: { en: formData.authorEn, ar: formData.authorAr },
      category: { en: formData.catEn, ar: formData.catAr },
      summary: { en: formData.summaryEn, ar: formData.summaryAr },
      content: { en: formData.contentEn, ar: formData.contentAr },
      cover: `https://picsum.photos/seed/${Math.random()}/400/600`,
      readTime: Number(formData.readTime),
      rating: 5.0,
      views: 0,
      createdAt: new Date().toISOString()
    });
    alert("Book published to the live platform!");
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
       <Sidebar role="admin" />
       <main className="flex-1 p-8 space-y-10">
          <header className="space-y-1">
             <h1 className="text-3xl font-black">Upload Content</h1>
             <p className="text-slate-500">Add a new bilingual summary to the platform.</p>
          </header>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 space-y-10">
             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-xl font-bold border-b pb-2">English Details</h3>
                   <input type="text" placeholder="Title (EN)" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none" onChange={e => setFormData({...formData, titleEn: e.target.value})} />
                   <input type="text" placeholder="Author (EN)" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none" onChange={e => setFormData({...formData, authorEn: e.target.value})} />
                   <input type="text" placeholder="Category (EN)" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none" onChange={e => setFormData({...formData, catEn: e.target.value})} />
                   <textarea placeholder="Summary (EN)" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none h-32" onChange={e => setFormData({...formData, summaryEn: e.target.value})}></textarea>
                </div>
                <div className="space-y-6" dir="rtl">
                   <h3 className="text-xl font-bold border-b pb-2">التفاصيل العربية</h3>
                   <input type="text" placeholder="العنوان" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none" onChange={e => setFormData({...formData, titleAr: e.target.value})} />
                   <input type="text" placeholder="المؤلف" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none" onChange={e => setFormData({...formData, authorAr: e.target.value})} />
                   <input type="text" placeholder="الفئة" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none" onChange={e => setFormData({...formData, catAr: e.target.value})} />
                   <textarea placeholder="الملخص" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none h-32" onChange={e => setFormData({...formData, summaryAr: e.target.value})}></textarea>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-xl font-bold">Content Editor</h3>
                <div className="grid md:grid-cols-2 gap-6">
                   <textarea placeholder="Full Content (EN)" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none h-64" onChange={e => setFormData({...formData, contentEn: e.target.value})}></textarea>
                   <textarea placeholder="المحتوى الكامل" dir="rtl" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none h-64" onChange={e => setFormData({...formData, contentAr: e.target.value})}></textarea>
                </div>
             </div>

             <div className="flex justify-end pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                   {loading ? "Publishing..." : "Publish Summary"}
                </button>
             </div>
          </form>
       </main>
    </div>
  );
};
