
import { Book, User } from './types';

const STORAGE_KEYS = {
  BOOKS: 'summa_books',
  USER: 'summa_current_user',
  SETTINGS: 'summa_settings'
};

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: { en: "Atomic Habits", ar: "العادات الذرية" },
    author: { en: "James Clear", ar: "جيمس كلير" },
    category: { en: "Self-Improvement", ar: "تطوير الذات" },
    cover: "https://picsum.photos/seed/habit/400/600",
    summary: { 
      en: "An easy and proven way to build good habits and break bad ones.",
      ar: "طريقة سهلة ومثبتة لبناء عادات جيدة والتخلص من العادات السيئة."
    },
    content: {
      en: "Habits are the compound interest of self-improvement. Getting 1 percent better every day counts for a lot in the long-run. Forget about goals, focus on systems instead. Atomic Habits provides a proven framework for improving every day.",
      ar: "العادات هي الفائدة المركبة لتطوير الذات. إن التحسن بنسبة 1 بالمائة كل يوم له قيمة كبيرة على المدى الطويل. انسَ الأهداف، ركز على الأنظمة بدلاً من ذلك. يوفر كتاب العادات الذرية إطارًا مثبتًا للتحسن كل يوم."
    },
    readTime: 12,
    rating: 4.8,
    views: 12500,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: { en: "Deep Work", ar: "العمل العميق" },
    author: { en: "Cal Newport", ar: "كال نيوبورت" },
    category: { en: "Productivity", ar: "الإنتاجية" },
    cover: "https://picsum.photos/seed/deep/400/600",
    summary: { 
      en: "Rules for focused success in a distracted world.",
      ar: "قواعد للنجاح المركّز في عالم مشتت."
    },
    content: {
      en: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time. Shallow work is non-cognitively demanding, logistical-style tasks, often performed while distracted.",
      ar: "العمل العميق هو القدرة على التركيز دون تشتيت في مهمة تتطلب قدرات ذهنية عالية. إنها مهارة تسمح لك بإتقان المعلومات المعقدة بسرعة وإنتاج نتائج أفضل في وقت أقل. العمل الضحل هو المهام التي لا تتطلب جهداً ذهنياً كبيراً، وغالباً ما يتم أداؤها أثناء التشتت."
    },
    readTime: 15,
    rating: 4.6,
    views: 8900,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: { en: "The Psychology of Money", ar: "سيكولوجية المال" },
    author: { en: "Morgan Housel", ar: "مورجان هاوسل" },
    category: { en: "Finance", ar: "المال والأعمال" },
    cover: "https://picsum.photos/seed/money/400/600",
    summary: { 
      en: "Timeless lessons on wealth, greed, and happiness.",
      ar: "دروس خالدة في الثروة، الجشع، والسعادة."
    },
    content: {
      en: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field.",
      ar: "النجاح المالي ليس بالضرورة متعلقاً بما تعرفه، بل بكيفية تصرفك. والسلوك من الصعب تعليمه، حتى للأذكياء جداً. المال — الاستثمار، التمويل الشخصي، وقرارات الأعمال — يتم تدريسه عادةً كحقل يعتمد على الرياضيات."
    },
    readTime: 18,
    rating: 4.9,
    views: 15000,
    createdAt: new Date().toISOString()
  }
];

export const db = {
  getBooks: (): Book[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    return JSON.parse(data);
  },

  saveBooks: (books: Book[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { language: 'en', theme: 'light' };
  },

  saveSettings: (settings: { language: string; theme: string }) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};
