'use client';

import dynamic from 'next/dynamic';

const AppLayout = dynamic(
  () => import('@/components/layout/AppLayout').then((mod) => mod.AppLayout),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 flex items-center justify-center"
        suppressHydrationWarning
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"
          suppressHydrationWarning
        />
      </div>
    ),
  }
);

export default function Home() {
  return <AppLayout />;
}
