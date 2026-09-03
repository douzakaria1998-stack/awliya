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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole, AdminUser } from '@/types/admin';

export function AdminRolesScreen() {
  const { adminUsers, rolePermissions, updateRolePermissions, addNewAdminUser, currentRole } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [selectedRoleId, setSelectedRoleId] = useState<AdminRole>('administrator');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  // Available Modules & Permissions list
  const availablePermissionsList = [
    { id: 'dashboard', labelAr: 'لوحة المؤشرات والتحليلات', labelEn: 'Dashboard & Analytics' },
    { id: 'students', labelAr: 'إدارة الطلاب والتسجيل', labelEn: 'Students & Registration' },
    { id: 'parents', labelAr: 'أولياء الأمور والتواصل', labelEn: 'Parents & Contact' },
    { id: 'teachers', labelAr: 'هيئة التدريس والمعلمين', labelEn: 'Teachers & Staff' },
    { id: 'groups', labelAr: 'الأفواج والمجموعات', labelEn: 'Groups & Schedules' },
    { id: 'academic', labelAr: 'المسار والمنهج التعليمي', labelEn: 'Academic Path & Curriculum' },
    { id: 'attendance', labelAr: 'رصد الحضور والغياب', labelEn: 'Attendance Sessions' },
    { id: 'performance', labelAr: 'الواجبات والأداء المنزلي', labelEn: 'Homework & Performance' },
    { id: 'assessments', labelAr: 'تقييم المهارات والاختبارات', labelEn: 'Skills & Assessments' },
    { id: 'admin_roles', labelAr: 'إدارة الصلاحيات والأمان', labelEn: 'Security & Roles' },
    { id: 'system_settings', labelAr: 'إعدادات المنظومة والشهادات', labelEn: 'System Settings' },
  ];

  const defaultRolePermissions: Record<AdminRole, string[]> = {
    super_admin: [
      'dashboard',
      'students',
      'parents',
      'teachers',
      'groups',
      'academic',
      'attendance',
      'performance',
      'assessments',
      'admin_roles',
      'system_settings',
    ],
    administrator: [
      'dashboard',
      'students',
      'parents',
      'groups',
      'academic',
      'attendance',
      'performance',
      'assessments',
    ],
    teacher: [
      'groups',
      'attendance',
      'performance',
      'assessments',
    ],
  };

  // New User Form State
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('administrator');
  const [newDept, setNewDept] = useState('إدارة شؤون التسجيل');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(defaultRolePermissions['administrator']);

  const handleSelectRole = (role: AdminRole) => {
    setNewRole(role);
    setSelectedPermissions(defaultRolePermissions[role] || []);
  };

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSelectAllPermissions = () => {
    setSelectedPermissions(availablePermissionsList.map((p) => p.id));
  };

  const handleClearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const currentRoleConfig = rolePermissions.find((r) => r.roleId === selectedRoleId) || rolePermissions[0];

  const handleOpenAddUser = () => {
    setModalStep(1);
    setSelectedPermissions(defaultRolePermissions['administrator']);
    setIsAddUserOpen(true);
  };

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
    setNewRole('administrator');
    setModalStep(1);
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
          onClick={handleOpenAddUser}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-fade-in-up"
            style={{ padding: '20px 24px' }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '10px', marginBottom: '12px' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black shrink-0">
                  {modalStep === 1 ? <UserPlus size={15} /> : <ShieldCheck size={15} />}
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                    {modalStep === 1 ? 'إضافة حساب إداري جديد' : 'تحديد الدور والصلاحيات الممنوحة'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {modalStep === 1
                      ? 'الخطوة 1 من 2: تعيين البيانات الشخصية ورقم التواصل'
                      : `الخطوة 2 من 2: تفويض الصلاحيات لـ ${newNameAr || 'المشرف'}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* STEP 1: Basic Information */}
            {modalStep === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newNameAr.trim() && newUsername.trim()) {
                    setModalStep(2);
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '4px' }}
                  >
                    الاسم الكامل بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="أ. سفيان لعور"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '38px', padding: '6px 12px' }}
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '4px' }}
                  >
                    اسم المستخدم (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="soufiane.admin"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 font-mono font-bold text-xs text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '38px', padding: '6px 12px' }}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '4px' }}
                  >
                    القسم أو الإدارة
                  </label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="إدارة شؤون التسجيل"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all"
                    style={{ height: '38px', padding: '6px 12px' }}
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '4px' }}
                  >
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+213 770 000 000"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '38px', padding: '6px 12px' }}
                    dir="ltr"
                  />
                </div>

                <div style={{ paddingTop: '4px' }}>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
                    style={{ height: '40px' }}
                  >
                    <span>{language === 'ar' ? 'التالي: تحديد الدور والصلاحيات' : 'Next: Select Role & Permissions'}</span>
                    {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Role & Permissions Selection Popup */}
            {modalStep === 2 && (
              <form onSubmit={handleCreateAdminUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '6px' }}
                  >
                    اختر الدور الوظيفي للحساب (Select Account Role):
                  </label>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Option 1: Administrator */}
                    <div
                      onClick={() => handleSelectRole('administrator')}
                      className={`rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        newRole === 'administrator'
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      style={{ padding: '8px 12px' }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-black shrink-0">
                          <UserCheck size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>مدير عمليات وشؤون طلاب (Administrator)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight truncate">
                            إدارة شاملة للطلاب، الأفواج، الحضور، والتسجيل
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-1.5 ${
                        newRole === 'administrator' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {newRole === 'administrator' && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </div>

                    {/* Option 2: Super Admin */}
                    <div
                      onClick={() => handleSelectRole('super_admin')}
                      className={`rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        newRole === 'super_admin'
                          ? 'bg-purple-50/90 dark:bg-purple-950/50 border-purple-500 ring-1 ring-purple-500/20 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      style={{ padding: '8px 12px' }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-black shrink-0">
                          <ShieldCheck size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5">
                            <span>مدير عام تنفيذي (Super Admin)</span>
                            <span className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 px-1.5 py-0.2 rounded-md font-bold">
                              100%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight truncate">
                            صلاحيات مطلقة لإدارة الحسابات، الأمان، وإعدادات النظام
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-1.5 ${
                        newRole === 'super_admin' ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {newRole === 'super_admin' && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </div>

                    {/* Option 3: Teacher */}
                    <div
                      onClick={() => handleSelectRole('teacher')}
                      className={`rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        newRole === 'teacher'
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      style={{ padding: '8px 12px' }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-black shrink-0">
                          <GraduationCap size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>معلم ومؤطر أكاديمي (Teacher)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight truncate">
                            متابعة أفواجه الخاصة ورصد الحضور والواجبات والتقييمات
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-1.5 ${
                        newRole === 'teacher' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {newRole === 'teacher' && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Selectable Permissions Box */}
                <div
                  className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
                  style={{ padding: '10px 12px' }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Sparkles size={12} className="text-purple-600" />
                      <span>الصلاحيات الممنوحة:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="text-[10px] text-purple-600 hover:text-purple-700 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                      >
                        تحديد الكل
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <button
                        type="button"
                        onClick={handleClearAllPermissions}
                        className="text-[10px] text-slate-400 hover:text-rose-500 font-bold hover:underline cursor-pointer"
                      >
                        إلغاء الكل
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                    {availablePermissionsList.map((perm) => {
                      const isSelected = selectedPermissions.includes(perm.id);
                      return (
                        <button
                          key={perm.id}
                          type="button"
                          onClick={() => handleTogglePermission(perm.id)}
                          className={`rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer select-none hover:scale-102 active:scale-95 ${
                            isSelected
                              ? 'bg-purple-600 text-white border border-purple-500 shadow-2xs font-bold'
                              : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                          style={{ padding: '4px 8px' }}
                        >
                          <div
                            className={`w-3 h-3 rounded flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-white/25 text-white' : 'border border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <Check size={8} className="stroke-[3]" />}
                          </div>
                          <span>{language === 'ar' ? perm.labelAr : perm.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions: Back & Confirm */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1"
                    style={{ height: '38px' }}
                  >
                    {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                    <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    style={{ height: '38px' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{language === 'ar' ? 'تأكيد وتفعيل الحساب' : 'Confirm & Create'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
