'use client';

import dynamic from 'next/dynamic';

const AppLayout = dynamic(
  () => import('@/components/layout/AppLayout').then((mod) => mod.AppLayout),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="flex flex-col items-center gap-3.5" suppressHydrationWarning>
          <div className="w-12 h-12 rounded-2xl bg-rose-600 animate-pulse flex items-center justify-center text-white font-black text-xl shadow-lg">
            أ
          </div>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">
            جاري تحميل بوابة أولياء الأمور...
          </span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <AppLayout />;
}
