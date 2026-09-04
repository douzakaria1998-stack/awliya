'use client';

import dynamic from 'next/dynamic';

const AdminShell = dynamic(
  () => import('@/components/admin/layout/AdminShell').then((mod) => mod.AdminShell),
  { ssr: false }
);

export default function AdminPage() {
  return <AdminShell />;
}

