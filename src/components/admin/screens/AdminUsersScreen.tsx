'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  User,
  Shield,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  X,
  Search,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { AdminRole, AdminUser } from '@/types/admin';

export function AdminUsersScreen() {
  const { adminUsers, addNewAdminUser } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | AdminRole>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add User Modal
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminRole>('teacher');
  const [departmentAr, setDepartmentAr] = useState('هيئة تدريس مسار اللغة الإنجليزية');
  const [specialization, setSpecialization] = useState<'english' | 'french' | 'dual' | 'all'>('english');

  const filteredUsers = adminUsers.filter((u) => {
    const matchesSearch =
      u.fullNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !email) return;

    addNewAdminUser({
      fullNameAr: nameAr,
      fullNameEn: nameEn || nameAr,
      email,
      phone: phone || '+213 770 000 000',
      role,
      departmentAr,
      departmentEn: departmentAr,
      specialization,
    });

    setNameAr('');
    setNameEn('');
    setEmail('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const roleMeta = {
    super_admin: { label: 'المدير العام', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
    administrator: { label: 'إداري', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    teacher: { label: 'معلم', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            فريق العمل والصلاحيات الإدارية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            إدارة حسابات المشرفين، الإداريين، ومعلمي اللغتين الإنجليزية والفرنسية.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={16} />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث بالاسم، البريد الإلكتروني، أو القسم..."
            className="w-full h-11 pr-11 pl-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'super_admin', label: 'المدراء' },
            { id: 'administrator', label: 'الإداريون' },
            { id: 'teacher', label: 'المعلمون' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setFilterRole(r.id as any)}
              className={`px-3 py-1 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                filterRole === r.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((u) => {
          const meta = roleMeta[u.role];
          return (
            <div
              key={u.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                      {u.fullNameAr[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                        {u.fullNameAr}
                      </h3>
                      <div className="text-xs text-slate-400 truncate">{u.fullNameEn}</div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black border ${meta.color} shrink-0`}>
                    {meta.label}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="font-mono">{u.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 pt-1">
                    <GraduationCap size={14} className="text-rose-500 shrink-0" />
                    <span className="truncate">{u.departmentAr}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>تاريخ الإنشاء: {u.createdAt}</span>
                <span className="text-emerald-600 font-bold">نشط</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <UserPlus size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">إضافة مستخدم جديد للنظام</h3>
                  <div className="text-xs text-slate-500">تعيين الصلاحيات والدور الأكاديمي</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم بالعربية:
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: أ. ياسين بلقاضي"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم بالإنجليزية:
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Yassine Belkadi"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@myschool.edu"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الدور والصلاحية (Role):
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="super_admin">المدير العام (Super Admin)</option>
                  <option value="administrator">إداري التسجيل والشؤون الأكاديمية (Administrator)</option>
                  <option value="teacher">معلم / أستاذ لغات (Teacher)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  القسم / التخصص:
                </label>
                <input
                  type="text"
                  value={departmentAr}
                  onChange={(e) => setDepartmentAr(e.target.value)}
                  placeholder="هيئة تدريس اللغة الإنجليزية / إدارة التسجيل"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  حفظ المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
