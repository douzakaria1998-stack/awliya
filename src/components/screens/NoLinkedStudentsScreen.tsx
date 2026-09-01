'use client';

import React from 'react';
import {
  Users,
  Clock,
  MessageCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export function NoLinkedStudentsScreen() {
  const { parent } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 animate-fade-in select-none">
      {/* 1. Main Welcome Header Card */}
      <div
        className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden"
        style={{ padding: '32px 32px' }}
      >
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0"
              style={{ background: theme.gradient }}
            >
              {parent?.fullNameAr ? parent.fullNameAr[0] : 'و'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                  {language === 'ar'
                    ? `مرحباً بك، ${parent?.fullNameAr || 'ولي الأمر'}`
                    : `Welcome, ${parent?.fullNameEn || parent?.fullNameAr || 'Parent'}`}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
                  <Clock size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'ar' ? 'بانتظار ربط الطلاب' : 'Awaiting Student Linking'}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {language === 'ar'
                  ? 'تم تفعيل حسابك بنجاح. ستظهر بيانات الأبناء والمسار الأكاديمي فور إضافتهم من طرف الإدارة.'
                  : 'Your account is active. Children profiles and academic data will appear once linked by the administration.'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="h-11 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <MessageCircle size={17} className="shrink-0" />
            <span>{language === 'ar' ? 'تواصل مع الإدارة عبر واتساب' : 'Contact Support via WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* 2. Registered Parent Profile Card */}
      <div
        className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        style={{ padding: '32px 36px' }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 size={16} />
          </div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'بيانات حساب ولي الأمر المسجلة' : 'Registered Parent Account Information'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Email Address */}
          <div
            className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-center transition-all hover:border-purple-300 dark:hover:border-purple-800"
            style={{ padding: '18px 22px' }}
          >
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-bold mb-2">
              <Mail size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</span>
            </div>
            <div className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white truncate">
              {parent?.email || '—'}
            </div>
          </div>

          {/* Phone Number */}
          <div
            className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-center transition-all hover:border-purple-300 dark:hover:border-purple-800"
            style={{ padding: '18px 22px' }}
          >
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-bold mb-2">
              <Phone size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</span>
            </div>
            <div className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white truncate" dir="ltr">
              {parent?.phone || '—'}
            </div>
          </div>

          {/* Residential Address */}
          <div
            className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-center transition-all hover:border-purple-300 dark:hover:border-purple-800"
            style={{ padding: '18px 22px' }}
          >
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-bold mb-2">
              <MapPin size={15} className="text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{language === 'ar' ? 'العنوان السكني' : 'Residential Address'}</span>
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
              {parent?.address || (language === 'ar' ? 'الجزائر العاصمة' : 'Algiers, Algeria')}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Empty State Guidance & Instructions */}
      <div
        className="rounded-3xl bg-slate-50/80 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center"
        style={{ padding: '48px 32px' }}
      >
        <div className="w-18 h-18 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 shadow-xs shrink-0">
          <Users size={34} />
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
          {language === 'ar'
            ? 'لا يوجد طلاب مرتبطين بهذا الحساب حالياً'
            : 'No Students Linked To This Account Yet'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-7 font-medium">
          {language === 'ar'
            ? 'عندما تقوم إدارة المدرسة بربط الطلاب أو تسجيل أبنائك من لوحة التحكم، ستظهر هنا جميع الإحصائيات الأكاديمية، الحضور والغياب، الواجبات المنزلية، والتقييمات تلقائياً.'
            : 'When the administration registers or links your children, all academic indicators, attendance, homework, and assessments will automatically appear here.'}
        </p>

        <a
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
          className="h-11 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <MessageCircle size={17} className="shrink-0" />
          <span>{language === 'ar' ? 'تواصل مع إدارة المدرسة للمتابعة' : 'Contact School Administration'}</span>
        </a>
      </div>
    </div>
  );
}
