'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AdminShell = dynamic(
  () => import('@/components/admin/layout/AdminShell').then((mod) => mod.AdminShell),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center" dir="rtl" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
          <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin" suppressHydrationWarning />
          <span className="text-xs font-bold text-slate-400" suppressHydrationWarning>جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    ),
  }
);

export default function AdminPage() {
  return <AdminShell />;
}
