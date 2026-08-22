'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Plus,
  Check,
  X,
  Sparkles,
  UserPlus,
  Shield,
  KeyRound,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole, AdminUser } from '@/types/admin';

export function AdminRolesScreen() {
  const { adminUsers, rolePermissions, updateRolePermissions, addNewAdminUser, currentRole } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [selectedRoleId, setSelectedRoleId] = useState<AdminRole>('administrator');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New User Form State
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('administrator');
  const [newDept, setNewDept] = useState('إدارة شؤون التسجيل');

  const currentRoleConfig = rolePermissions.find((r) => r.roleId === selectedRoleId) || rolePermissions[0];

  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr || !newUsername) return;

    addNewAdminUser({
      fullNameAr: newNameAr,
      fullNameEn: newNameEn || newNameAr,
      username: newUsername.toLowerCase().trim(),
      email: newEmail || `${newUsername.toLowerCase().trim()}@myschool.edu`,
      phone: newPhone,
      role: newRole,
      departmentAr: newDept,
      departmentEn: newDept,
      status: 'active',
    });

    setNewNameAr('');
    setNewNameEn('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setIsAddUserOpen(false);
  };

  if (currentRole !== 'super_admin') {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-3">
        <ShieldCheck size={36} className="text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-900 dark:text-white">صلاحية محصورة بالمدير العام التنفيذي فقط</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          وفقاً لمحددات الأمان (Section 3.1 & Section 31)، المدير العام هو الوحيد المخول بإدارة حسابات المشرفين وتعديل مصفوفة الصلاحيات.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full pb-10 space-y-6 select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'الأمان والصلاحيات الإدارية المتقدمة' : 'Security & Access Control'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'إدارة الأدوار والصلاحيات (Admin Role Control)' : 'Admin Roles & Permissions'}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus size={16} />
          <span>{language === 'ar' ? '+ إضافة حساب إداري جديد' : '+ Add Admin Account'}</span>
        </button>
      </div>

      {/* Admin Users Roster Table */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-purple-600" />
            <span>حسابات فريق الإدارة وهيئة التدريس</span>
          </h4>
          <span className="text-xs text-slate-400">{adminUsers.length} مستخدمين مسجلين</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">الاسم الكامل</th>
                <th className="py-3.5 px-4 text-center">اسم المستخدم</th>
                <th className="py-3.5 px-4 text-center">الدور (Role)</th>
                <th className="py-3.5 px-4 text-center">القسم / التخصص</th>
                <th className="py-3.5 px-4 text-center">البريد الإلكتروني</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    {u.fullNameAr} ({u.fullNameEn})
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-purple-600">
                    @{u.username}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-500/30'
                          : u.role === 'administrator'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {u.role === 'super_admin' ? 'المدير العام' : u.role === 'administrator' ? 'مدير عمليات' : 'معلم'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">
                    {u.departmentAr}
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-slate-500 dark:text-slate-400 text-xs">
                    {u.email}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      نشط
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix (Section 31, 32 in PDF) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs space-y-6"
        style={{ padding: '28px 32px' }}
      >
        <div>
          <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Shield size={20} className="text-purple-600" />
            <span>مصفوفة الصلاحيات المعتمدة (Permission Matrix - Section 32)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            جدول يوضح الصلاحيات الممنوحة لكل دور في النظام بدقة ومرونة تامة.
          </p>
        </div>

        {/* Matrix Table (Section 32) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">الخاصية / الوحدة (Feature)</th>
                <th className="py-3.5 px-4 text-center">المدير العام (Super Admin)</th>
                <th className="py-3.5 px-4 text-center">مدير العمليات (Admin)</th>
                <th className="py-3.5 px-4 text-center">المعلم (Teacher)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {[
                { feature: 'Dashboard (لوحة المؤشرات)', super: 'Full', admin: 'Full / Restricted', teacher: 'Personal' },
                { feature: 'Students (إدارة الطلاب)', super: 'Full', admin: 'Full', teacher: 'Own students' },
                { feature: 'Parents (إدارة أولياء الأمور)', super: 'Full', admin: 'Full', teacher: 'Related parents' },
                { feature: 'Teachers (إدارة المعلمين)', super: 'Full', admin: 'Optional', teacher: 'No' },
                { feature: 'Groups (إدارة الأفواج)', super: 'Full', admin: 'Full', teacher: 'Own groups' },
                { feature: 'Academic Path (المسار والمنهج)', super: 'Full', admin: 'Manage', teacher: 'View / Progress' },
                { feature: 'Attendance (رصد الحضور)', super: 'Full', admin: 'Full', teacher: 'Own groups' },
                { feature: 'Performance (الواجبات والأداء)', super: 'Full', admin: 'Full', teacher: 'Own students' },
                { feature: 'Assessments (تقييم المهارات)', super: 'Full', admin: 'Full', teacher: 'Own students' },
                { feature: 'Admin Roles (إدارة الصلاحيات)', super: 'Full', admin: 'No', teacher: 'No' },
                { feature: 'System Settings (إعدادات المنظومة)', super: 'Full', admin: 'No', teacher: 'No' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs">
                      {row.super}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
                      {row.admin}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                        row.teacher === 'No'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {row.teacher}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Admin User (Section 31) */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">إضافة حساب إداري جديد</h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل بالعربية *</label>
                <input
                  type="text"
                  required
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder="أ. سفيان لعور"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">اسم المستخدم (Username) *</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="soufiane.admin"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-purple-600"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الدور والصلاحيات</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="administrator">مدير عمليات وشؤون طلاب (Admin)</option>
                  <option value="super_admin">مدير عام تنفيذي (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">القسم أو الإدارة</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+213 770 000 000"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  إنشاء وتفعيل الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
