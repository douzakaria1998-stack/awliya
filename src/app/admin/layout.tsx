import React from 'react';
import type { Metadata } from 'next';
import { AdminProvider } from '@/context/AdminContext';

export const metadata: Metadata = {
  title: 'لوحة التحكم الإدارية • Control Panel | My School',
  description: 'Admin Control Panel with Role-Based Access Control for Super Admin, Administrators, and Teachers.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div suppressHydrationWarning className="min-h-screen w-full">
        {children}
      </div>
    </AdminProvider>
  );
}
