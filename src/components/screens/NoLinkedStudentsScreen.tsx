'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Clock,
  School,
  MessageCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export function NoLinkedStudentsScreen() {
  const { parent } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in select-none">
      {/* 1. Main Welcome Header Card */}
      <div
        className="rounded-[32px] bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden"
        style={{ padding: '36px 32px' }}
      >
        <div
          className="absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0"
              style={{ background: theme.gradient }}
            >
              {parent?.fullNameAr ? parent.fullNameAr[0] : 'و'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'ar'
                    ? `مرحباً بك، ${parent?.fullNameAr || 'ولي الأمر'}`
                    : `Welcome, ${parent?.fullNameEn || parent?.fullNameAr || 'Parent'}`}
                </h1>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center gap-1.5 shadow-2xs">
                  <Clock size={13} className="shrink-0" />
                  <span>{language === 'ar' ? 'بانتظار ربط الطلاب' : 'Awaiting Student Linking'}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
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
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-md transition-all cursor-pointer shrink-0 px-5 py-3 hover:scale-105 active:scale-95"
          >
            <MessageCircle size={16} />
            <span>{language === 'ar' ? 'تواصل مع الإدارة عبر واتساب' : 'Contact Support via WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* 2. Registered Parent Profile Card */}
      <div
        className="rounded-[28px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        style={{ padding: '28px 28px' }}
      >
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{language === 'ar' ? 'بيانات حساب ولي الأمر المسجلة:' : 'Registered Parent Account Information:'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1.5">
              <Mail size={14} />
              <span>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</span>
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
              {parent?.email || '—'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1.5">
              <Phone size={14} />
              <span>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</span>
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 truncate block" dir="ltr">
              {parent?.phone || '—'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 block mb-1 flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{language === 'ar' ? 'العنوان السكني' : 'Address'}</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate block">
              {parent?.address || (language === 'ar' ? 'الجزائر العاصمة' : 'Algiers, Algeria')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Empty State Guidance & Instructions */}
      <div
        className="rounded-[28px] bg-slate-50/80 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 text-center"
        style={{ padding: '44px 28px' }}
      >
        <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-sm">
          <Users size={32} />
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
          {language === 'ar'
            ? 'لا يوجد طلاب مرتبطين بهذا الحساب حالياً'
            : 'No Students Linked To This Account Yet'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
          {language === 'ar'
            ? 'عندما تقوم إدارة المدرسة بربط الطلاب أو تسجيل أبنائك من لوحة التحكم، ستظهر هنا جميع الإحصائيات الأكاديمية، الحضور والغياب، الواجبات المنزلية، والتقييمات تلقائياً.'
            : 'When the administration registers or links your children, all academic indicators, attendance, homework, and assessments will automatically appear here.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105"
          >
            <MessageCircle size={15} />
            <span>{language === 'ar' ? 'تواصل مع إدارة المدرسة للمتابعة' : 'Contact School Administration'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
