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
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
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
          className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ padding: '14px 28px' }}
        >
          <UserPlus size={18} />
          <span>{language === 'ar' ? 'إضافة حساب إداري جديد' : 'Add Admin Account'}</span>
        </button>
      </div>

      {/* Admin Users Roster Table */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs overflow-hidden"
        style={{ marginBottom: '40px' }}
      >
        <div
          className="border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ padding: '24px 36px' }}
        >
          <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black shrink-0">
              <ShieldCheck size={20} />
            </div>
            <span>حسابات فريق الإدارة وهيئة التدريس</span>
          </h4>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            {adminUsers.length} مستخدمين مسجلين
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingRight: '36px', paddingLeft: '20px' }} className="text-right whitespace-nowrap">الاسم الكامل</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">اسم المستخدم</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">الدور (Role)</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">القسم / التخصص</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">البريد الإلكتروني</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '36px', paddingRight: '20px' }} className="text-center whitespace-nowrap">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingRight: '36px', paddingLeft: '20px' }} className="font-black text-slate-900 dark:text-white whitespace-nowrap">
                    {u.fullNameAr} <span className="text-xs text-slate-400 font-bold">({u.fullNameEn})</span>
                  </td>
                  <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center font-mono font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                    @{u.username}
                  </td>
                  <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                    <span
                      className={`inline-block rounded-xl text-xs font-black shadow-2xs ${
                        u.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-500/30'
                          : u.role === 'administrator'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-500/30'
                      }`}
                      style={{ padding: '8px 18px' }}
                    >
                      {u.role === 'super_admin' ? 'المدير العام' : u.role === 'administrator' ? 'مدير عمليات' : 'معلم'}
                    </span>
                  </td>
                  <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {u.departmentAr}
                  </td>
                  <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center font-mono text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                    {u.email}
                  </td>
                  <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '36px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                    <span
                      className="inline-block rounded-xl text-xs font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs"
                      style={{ padding: '6px 16px' }}
                    >
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
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs"
        style={{ padding: '36px 40px', marginBottom: '36px' }}
      >
        <div style={{ marginBottom: '28px' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black shrink-0">
              <Shield size={20} />
            </div>
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
              مصفوفة الصلاحيات المعتمدة (Permission Matrix - Section 32)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5" style={{ paddingRight: isRTL ? '52px' : '0', paddingLeft: isRTL ? '0' : '52px' }}>
            جدول يوضح الصلاحيات الممنوحة لكل دور في النظام بدقة ومرونة تامة.
          </p>
        </div>

        {/* Matrix Table (Section 32) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingRight: '28px', paddingLeft: '20px' }} className="text-right whitespace-nowrap">الخاصية / الوحدة (Feature)</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">المدير العام (Super Admin)</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">مدير العمليات (Admin)</th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '28px', paddingRight: '20px' }} className="text-center whitespace-nowrap">المعلم (Teacher)</th>
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
                  <td style={{ paddingTop: '18px', paddingBottom: '18px', paddingRight: '28px', paddingLeft: '20px' }} className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.feature}
                  </td>
                  <td style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                    <span
                      className="inline-block rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black text-xs border border-purple-500/30 shadow-2xs"
                      style={{ padding: '8px 22px' }}
                    >
                      {row.super}
                    </span>
                  </td>
                  <td style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                    <span
                      className={`inline-block rounded-xl font-black text-xs border shadow-2xs ${
                        row.admin === 'No'
                          ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-500/30'
                      }`}
                      style={{ padding: '8px 20px' }}
                    >
                      {row.admin}
                    </span>
                  </td>
                  <td style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '28px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                    <span
                      className={`inline-block rounded-xl font-bold text-xs border shadow-2xs ${
                        row.teacher === 'No'
                          ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}
                      style={{ padding: '8px 20px' }}
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
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up" style={{ padding: '32px 36px' }}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="font-black text-xl text-slate-900 dark:text-white">إضافة حساب إداري جديد</h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-5 text-xs sm:text-sm font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">الاسم الكامل بالعربية *</label>
                <input
                  type="text"
                  required
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder="أ. سفيان لعور"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  style={{ height: '48px', padding: '12px 18px' }}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">اسم المستخدم (Username) *</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="soufiane.admin"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  style={{ height: '48px', padding: '12px 18px' }}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">الدور والصلاحيات</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                  style={{ height: '48px', padding: '12px 18px' }}
                >
                  <option value="administrator">مدير عمليات وشؤون طلاب (Admin)</option>
                  <option value="super_admin">مدير عام تنفيذي (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">القسم أو الإدارة</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  style={{ height: '48px', padding: '12px 18px' }}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">رقم الهاتف</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+213 770 000 000"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  style={{ height: '48px', padding: '12px 18px' }}
                  dir="ltr"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                  style={{ height: '50px' }}
                >
                  <UserPlus size={18} />
                  <span>إنشاء وتفعيل الحساب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
