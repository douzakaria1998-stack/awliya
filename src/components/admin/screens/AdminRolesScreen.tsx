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
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Crown,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole, AdminUser } from '@/types/admin';
import { ConfirmModal } from '../modals/ConfirmModal';
import { generateAutoPassword } from '@/lib/utils';

export function AdminRolesScreen() {
  const {
    adminUsers,
    rolePermissions,
    updateRolePermissions,
    addNewAdminUser,
    updateAdminUser,
    deleteAdminUser,
    currentRole,
    currentAdmin,
  } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [selectedRoleId, setSelectedRoleId] = useState<AdminRole>('administrator');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  // Edit User State
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('administrator');
  const [editDept, setEditDept] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Confirmation Modals State
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

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
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
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
    setNewNameAr('');
    setNewNameEn('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword(generateAutoPassword());
    setNewRole('administrator');
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
      password: newPassword.trim() || 'admin123',
      status: 'active',
    });

    setNewNameAr('');
    setNewNameEn('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setNewRole('administrator');
    setModalStep(1);
    setIsAddUserOpen(false);
  };

  // Open Edit User Modal
  const handleOpenEditUser = (user: AdminUser) => {
    setEditingUserId(user.id);
    setEditNameAr(user.fullNameAr);
    setEditNameEn(user.fullNameEn);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditDept(user.departmentAr || '');
    setEditStatus(user.status || 'active');
    setEditPassword('');
    setShowEditPassword(false);
    setIsEditUserOpen(true);
  };

  // Submit Edit Form -> triggers ConfirmModal
  const handleSubmitEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameAr || !editUsername) return;
    setIsConfirmEditOpen(true);
  };

  // Confirm and apply Edit changes
  const handleConfirmEdit = () => {
    if (!editingUserId) return;

    updateAdminUser(editingUserId, {
      fullNameAr: editNameAr,
      fullNameEn: editNameEn || editNameAr,
      username: editUsername.toLowerCase().trim(),
      email: editEmail || `${editUsername.toLowerCase().trim()}@myschool.edu`,
      phone: editPhone,
      role: editRole,
      departmentAr: editDept,
      departmentEn: editDept,
      status: editStatus,
      ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
    });

    setIsConfirmEditOpen(false);
    setIsEditUserOpen(false);
    setEditingUserId(null);
  };

  // Delete User Click
  const handleDeleteUserClick = (user: AdminUser) => {
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteAdminUser(userToDelete.id);
    setIsConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  if (currentRole !== 'super_admin') {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-3">
        <ShieldCheck size={36} className="text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'ar' ? 'صلاحية محصورة بالمدير العام التنفيذي فقط' : 'Super Admin Access Only'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {language === 'ar'
            ? 'وفقاً لمحددات الأمان، المدير العام هو الوحيد المخول بإدارة حسابات المشرفين وتعديل مصفوفة الصلاحيات.'
            : 'According to security policies, only the Super Admin can manage admin accounts and security matrices.'}
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
            <span>{language === 'ar' ? 'حسابات فريق الإدارة وهيئة التدريس' : 'Staff & Faculty Accounts'}</span>
          </h4>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            {adminUsers.length} {language === 'ar' ? 'مستخدمين مسجلين' : 'registered users'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingRight: '36px', paddingLeft: '20px' }} className="text-right whitespace-nowrap">
                  {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                  {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                </th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                  {language === 'ar' ? 'الدور (Role)' : 'Role'}
                </th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                  {language === 'ar' ? 'القسم / التخصص' : 'Department'}
                </th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th style={{ paddingTop: '18px', paddingBottom: '18px', paddingLeft: '36px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminUsers.map((u) => {
                const isPrimarySuperAdmin = u.id === 'usr-super-01';
                const isCurrentSelf = u.id === currentAdmin.id;

                return (
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
                        {u.role === 'super_admin'
                          ? language === 'ar' ? 'المدير العام' : 'Super Admin'
                          : u.role === 'administrator'
                          ? language === 'ar' ? 'مدير عمليات' : 'Administrator'
                          : language === 'ar' ? 'معلم' : 'Teacher'}
                      </span>
                    </td>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                      {u.departmentAr}
                    </td>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center font-mono text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {u.email}
                    </td>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                      <span
                        className={`inline-block rounded-xl text-xs font-black border shadow-2xs ${
                          u.status === 'inactive'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/30'
                            : u.status === 'suspended'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-500/30'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/30'
                        }`}
                        style={{ padding: '6px 16px' }}
                      >
                        {u.status === 'inactive'
                          ? language === 'ar' ? 'غير نشط' : 'Inactive'
                          : u.status === 'suspended'
                          ? language === 'ar' ? 'موقوف' : 'Suspended'
                          : language === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    </td>
                    <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '36px', paddingRight: '20px' }} className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                          title={language === 'ar' ? 'تعديل الحساب وتغيير كلمة المرور' : 'Edit account & change password'}
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteUserClick(u)}
                          disabled={isPrimarySuperAdmin}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs disabled:opacity-30 disabled:pointer-events-none"
                          title={
                            isPrimarySuperAdmin
                              ? language === 'ar' ? 'لا يمكن حذف الحساب الرئيسي للمدير العام' : 'Cannot delete primary super admin'
                              : language === 'ar' ? 'حذف الحساب' : 'Delete account'
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                {language === 'ar' ? 'مصفوفة الصلاحيات المخصصة (Access Control Matrix)' : 'Custom Access Control Matrix'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'تحديد الصلاحيات الدقيقة لكل رتبة إدارية في المنظومة (Section 31 & Section 32).'
                  : 'Fine-grained permission controls per role hierarchy.'}
              </p>
            </div>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {(['super_admin', 'administrator', 'teacher'] as AdminRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRoleId(role)}
              className={`rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
                selectedRoleId === role
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 scale-102'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60'
              }`}
              style={{ padding: '12px 24px' }}
            >
              {role === 'super_admin' && <ShieldCheck size={16} />}
              {role === 'administrator' && <UserCheck size={16} />}
              {role === 'teacher' && <GraduationCap size={16} />}
              <span>
                {role === 'super_admin'
                  ? language === 'ar' ? 'المدير العام (Super Admin)' : 'Super Admin'
                  : role === 'administrator'
                  ? language === 'ar' ? 'مدير عمليات (Administrator)' : 'Administrator'
                  : language === 'ar' ? 'معلم / مؤطر (Teacher)' : 'Teacher'}
              </span>
            </button>
          ))}
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availablePermissionsList.map((mod) => {
            const hasAccess = currentRoleConfig?.modules?.[mod.id as keyof typeof currentRoleConfig.modules] ?? true;
            return (
              <div
                key={mod.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {language === 'ar' ? mod.labelAr : mod.labelEn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    mod_{mod.id}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    hasAccess
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400'
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                >
                  {hasAccess ? <Check size={13} className="stroke-[3]" /> : <X size={13} className="stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. EDIT ADMIN USER MODAL */}
      {/* ========================================== */}
      {isEditUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-xs">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تعديل بيانات الحساب الإداري' : 'Edit Admin Account'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'تعديل الصلاحيات، البيانات، وتغيير كلمة المرور' : 'Update credentials, roles, and password'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditUserOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitEditForm} className="overflow-y-auto p-6 space-y-4 flex-1">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'الاسم الكامل بالعربية *' : 'Full Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'الاسم بالإنجليزية' : 'Full Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'اسم المستخدم (Username) *' : 'Username *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-purple-600 dark:text-purple-400 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Phone & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'القسم أو الإدارة' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'الدور الوظيفي (Role)' : 'Role'}
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as AdminRole)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                  >
                    <option value="administrator">{language === 'ar' ? 'مدير عمليات (Administrator)' : 'Administrator'}</option>
                    <option value="super_admin">{language === 'ar' ? 'مدير عام تنفيذي (Super Admin)' : 'Super Admin'}</option>
                    <option value="teacher">{language === 'ar' ? 'معلم ومؤطر (Teacher)' : 'Teacher'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                  >
                    <option value="active">{language === 'ar' ? 'نشط (Active)' : 'Active'}</option>
                    <option value="inactive">{language === 'ar' ? 'غير نشط (Inactive)' : 'Inactive'}</option>
                    <option value="suspended">{language === 'ar' ? 'موقوف مؤقتاً (Suspended)' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Password Change Box */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-800/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
                    <KeyRound size={15} className="text-purple-600" />
                    <span>{language === 'ar' ? 'تغيير كلمة المرور (Change Password)' : 'Change Password'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditPassword(generateAutoPassword())}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>{language === 'ar' ? 'توليد تلقائي' : 'Auto Generate'}</span>
                  </button>
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'اترك فارغاً للاحتفاظ بكلمة المرور الحالية'
                        : 'Leave blank to keep current password'
                    }
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1.5 rounded-lg"
                    style={{ right: isRTL ? 'auto' : '8px', left: isRTL ? '8px' : 'auto' }}
                  >
                    {showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {language === 'ar'
                    ? 'في حال إدخال كلمة مرور جديدة سيتم تحديث بيانات الدخول فوراً.'
                    : 'Entering a new password updates user credentials immediately.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer text-center"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} />
                  <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. ADD USER MODAL */}
      {/* ========================================== */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-xs">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إضافة حساب إداري جديد' : 'Create New Admin Account'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {modalStep === 1
                      ? language === 'ar' ? 'الخطوة 1: المعلومات والبيانات الأساسية' : 'Step 1: Basic Credentials'
                      : language === 'ar' ? 'الخطوة 2: تحديد الدور والصلاحيات' : 'Step 2: Role & Permissions'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 flex-1">
              {modalStep === 1 ? (
                <form onSubmit={(e) => { e.preventDefault(); if (newNameAr && newUsername) setModalStep(2); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'ar' ? 'الاسم الكامل بالعربية *' : 'Full Name (Arabic) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newNameAr}
                      onChange={(e) => setNewNameAr(e.target.value)}
                      placeholder="أ. سفيان لعور"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'ar' ? 'اسم المستخدم (Username) *' : 'Username *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="soufiane.admin"
                      dir="ltr"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-purple-600 dark:text-purple-400 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="soufiane@myschool.edu"
                        dir="ltr"
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      </label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+213 770 000 000"
                        dir="ltr"
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <KeyRound size={14} className="text-purple-600" />
                        <span>{language === 'ar' ? 'كلمة المرور الأولية' : 'Initial Password'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewPassword(generateAutoPassword())}
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>{language === 'ar' ? 'توليد تلقائي' : 'Generate'}</span>
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1.5"
                        style={{ right: isRTL ? 'auto' : '8px', left: isRTL ? '8px' : 'auto' }}
                      >
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    <span>{language === 'ar' ? 'التالي: تحديد الدور والصلاحيات' : 'Next: Select Role & Permissions'}</span>
                    {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreateAdminUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {language === 'ar' ? 'اختر الدور الوظيفي للحساب:' : 'Select Account Role:'}
                    </label>

                    <div className="space-y-2">
                      {/* Administrator */}
                      <div
                        onClick={() => handleSelectRole('administrator')}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          newRole === 'administrator'
                            ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
                            : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-black shrink-0">
                            <UserCheck size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 dark:text-white">
                              {language === 'ar' ? 'مدير عمليات وشؤون طلاب (Administrator)' : 'Operations Admin'}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {language === 'ar' ? 'إدارة شاملة للطلاب، الأفواج، الحضور، والتسجيل' : 'Students, classes, and registration'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          newRole === 'administrator' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {newRole === 'administrator' && <Check size={10} className="stroke-[3]" />}
                        </div>
                      </div>

                      {/* Super Admin */}
                      <div
                        onClick={() => handleSelectRole('super_admin')}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          newRole === 'super_admin'
                            ? 'bg-purple-50/90 dark:bg-purple-950/50 border-purple-500 ring-1 ring-purple-500/20 shadow-xs'
                            : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-black shrink-0">
                            <ShieldCheck size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{language === 'ar' ? 'مدير عام تنفيذي (Super Admin)' : 'Super Admin'}</span>
                              <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">100%</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {language === 'ar' ? 'صلاحيات مطلقة لإدارة الحسابات، الأمان، وإعدادات النظام' : 'Full access to system & security'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          newRole === 'super_admin' ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                        }`}>
                          {newRole === 'super_admin' && <Check size={10} className="stroke-[3]" />}
                        </div>
                      </div>

                      {/* Teacher */}
                      <div
                        onClick={() => handleSelectRole('teacher')}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          newRole === 'teacher'
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/20 shadow-xs'
                            : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-black shrink-0">
                            <GraduationCap size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 dark:text-white">
                              {language === 'ar' ? 'معلم ومؤطر أكاديمي (Teacher)' : 'Teacher'}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {language === 'ar' ? 'متابعة أفواجه ورصد الحضور والواجبات' : 'Classes, attendance, and grading'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          newRole === 'teacher' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {newRole === 'teacher' && <Check size={10} className="stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Selection */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? 'الصلاحيات الممنوحة:' : 'Granted Permissions:'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllPermissions}
                          className="text-[10px] text-purple-600 font-bold hover:underline cursor-pointer"
                        >
                          {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleClearAllPermissions}
                          className="text-[10px] text-slate-400 font-bold hover:underline cursor-pointer"
                        >
                          {language === 'ar' ? 'إلغاء الكل' : 'Clear All'}
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
                            className={`rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer select-none px-2 py-1 ${
                              isSelected
                                ? 'bg-purple-600 text-white border border-purple-500 shadow-2xs'
                                : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-white/25 text-white' : 'border border-slate-300'
                            }`}>
                              {isSelected && <Check size={8} className="stroke-[3]" />}
                            </div>
                            <span>{language === 'ar' ? perm.labelAr : perm.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1"
                    >
                      {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                      <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>{language === 'ar' ? 'تأكيد وتفعيل الحساب' : 'Confirm & Create'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. CONFIRMATION MODAL FOR EDIT */}
      {/* ========================================== */}
      <ConfirmModal
        isOpen={isConfirmEditOpen}
        onClose={() => setIsConfirmEditOpen(false)}
        onConfirm={handleConfirmEdit}
        title={language === 'ar' ? 'تأكيد تعديل بيانات الحساب' : 'Confirm Account Update'}
        message={
          language === 'ar'
            ? `هل أنت متأكد من حفظ التعديلات على حساب المستخدم (@${editUsername})؟`
            : `Are you sure you want to save changes for user account (@${editUsername})?`
        }
        confirmText={language === 'ar' ? 'تأكيد الحفظ' : 'Confirm Save'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
        variant="primary"
        icon="edit"
      />

      {/* ========================================== */}
      {/* 4. CONFIRMATION MODAL FOR DELETE */}
      {/* ========================================== */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={language === 'ar' ? 'تأكيد حذف الحساب الإداري' : 'Confirm Account Deletion'}
        message={
          language === 'ar'
            ? `هل أنت متأكد من رغبتك في حذف حساب "${userToDelete?.fullNameAr}" (@${userToDelete?.username}) نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`
            : `Are you sure you want to permanently delete account "${userToDelete?.fullNameEn}" (@${userToDelete?.username})? This action cannot be undone.`
        }
        confirmText={language === 'ar' ? 'تأكيد الحذف نهائياً' : 'Delete Permanently'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
        variant="danger"
        icon="trash"
      />
    </div>
  );
}
