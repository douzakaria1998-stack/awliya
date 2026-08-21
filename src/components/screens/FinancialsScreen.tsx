'use client';

import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  Download,
  Bell,
  Receipt,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { StudentSwitcher } from '../layout/StudentSwitcher';

interface FinancialsScreenProps {
  onOpenAddStudent: () => void;
}

export function FinancialsScreen({ onOpenAddStudent }: FinancialsScreenProps) {
  const {
    fees,
    payments,
    financialSummary,
    notificationSettings,
    updateNotificationSettings,
  } = useStudent();
  const { theme } = useTheme();

  const [downloadedReceiptId, setDownloadedReceiptId] = useState<string | null>(null);

  const pendingFees = fees.filter((f) => f.status === 'pending');

  // Dynamic note depending on balance and pending courses status
  const getDynamicNotice = () => {
    if (financialSummary.currentBalance === 0 || pendingFees.length === 0) {
      return {
        title: 'تاريخ اختتام الدورة الحالية:',
        text: 'تاريخ نهاية الدورة: 30 جوان 2025',
        icon: <Calendar size={20} className="shrink-0" />,
      };
    }

    if (pendingFees.length === 1) {
      return {
        title: 'تنبيه دفع الرسوم:',
        text: 'يرجى التقرب من المؤسسة من اجل دفع حقوق الدورة الجديدة',
        icon: <Wallet size={20} className="shrink-0" />,
      };
    }

    return {
      title: 'تنبيه تسوية المستحقات:',
      text: 'يرجى التقرب من المؤسسة من اجل تسوية الوضعية وتسديد الديون',
      icon: <AlertCircle size={20} className="shrink-0" />,
    };
  };

  const dynamicNotice = getDynamicNotice();

  const handleDownloadReceipt = (id: string) => {
    setDownloadedReceiptId(id);
    setTimeout(() => {
      setDownloadedReceiptId(null);
    }, 2000);
  };

  const handleToggleCourseExpiryAlert = () => {
    updateNotificationSettings({
      courseExpiry: !notificationSettings.courseExpiry,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" style={{ paddingBottom: '48px' }}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
        style={{ marginTop: '28px', marginBottom: '20px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">الإدارة المالية والاشتراكات</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            المالية والفواتير
          </h1>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* Stacked Containers: Current Balance Card + Fee Tracking under each other */}
      <div className="space-y-6">
        {/* Module 1: الرصيد الحالي (Current Balance Hero Card - Full Width Banner) */}
        <div
          className="dynamic-hero-card relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{
            background: theme.gradient,
            padding: '28px 32px',
            borderRadius: '24px',
          }}
        >
          <div>
            <div className="relative z-10 mb-2">
              <span className="text-xs sm:text-sm font-bold text-white/90 whitespace-nowrap">
                المبلغ المستحق
              </span>
            </div>

            <div className="relative z-10 flex items-baseline gap-2.5 my-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {financialSummary.currentBalance}
              </span>
              <span className="text-xl sm:text-2xl font-black text-white/95">{financialSummary.currency || 'د.ج'}</span>
            </div>
          </div>

          {/* Dynamic Notice Banner */}
          <div
            className="rounded-2xl bg-white/15 backdrop-blur-xs text-white border border-white/20 shadow-xs relative z-10 flex items-center gap-3.5"
            style={{
              padding: '16px 20px',
              maxWidth: '440px',
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {dynamicNotice.icon}
            </div>
            <div>
              <span className="text-xs font-bold text-white/80 block">{dynamicNotice.title}</span>
              <span className="text-xs sm:text-sm font-black text-white leading-relaxed block mt-0.5">
                {dynamicNotice.text}
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: الدورات والرسوم غير المسددة (Only appears if there are unpaid courses, completely hidden when all are paid) */}
        {pendingFees.length > 0 && (
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5"
            style={{
              padding: '28px 32px',
              borderRadius: '24px',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ marginBottom: '6px' }}>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span>الدورات والرسوم المطلوب سدادها</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  قائمة الدورات والرسوم غير المسددة الخاصة بالطالب
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-xl">
                  المبلغ المطلوب: {financialSummary.currentBalance} {financialSummary.currency || 'د.ج'}
                </span>
              </div>
            </div>

            {/* List of Unpaid / Not Paid Courses */}
            <div className="space-y-3.5 pt-1">
              {pendingFees.map((fee, index) => (
                <div
                  key={`${fee.id}-${index}`}
                  className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  style={{
                    padding: '18px 22px',
                    borderRadius: '20px',
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      {fee.isCurrentCourse && (
                        <span className="inline-flex items-center rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 px-3 py-1 shadow-2xs select-none">
                          🎓 الدورة الحالية النشطة
                        </span>
                      )}
                      <span className="text-xs text-amber-800 dark:text-amber-400 font-bold">
                        {fee.categoryAr}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {fee.courseNameAr || fee.descriptionAr}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">
                      موعد الاستحقاق: {fee.dueDate}
                    </span>
                  </div>

                  <div className="text-left flex items-center gap-3.5 shrink-0">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono block whitespace-nowrap">
                        {fee.amount} {financialSummary.currency || 'د.ج'}
                      </span>
                      <span className="inline-flex items-center justify-center rounded-full text-xs font-black mt-1 px-3 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        مطلوب سدادها
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Module 3: سجل المدفوعات (Payment History & Receipts) */}
      <div className="space-y-4" style={{ marginTop: '32px' }}>
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Receipt size={20} className="text-slate-500 shrink-0" />
          <span>سجل العمليات والإيصالات السابقة:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {payments.map((pay, index) => (
            <div
              key={`${pay.id}-${index}`}
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
              style={{
                padding: '22px 26px',
                borderRadius: '24px',
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                    {pay.descriptionAr}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                    <span className="font-mono">{pay.date}</span>
                    <span>•</span>
                    <span>{pay.methodAr}</span>
                  </div>
                </div>
              </div>

              <div className="text-left flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono block whitespace-nowrap">
                    {pay.amount} {pay.currency}
                  </span>
                  <span className="text-xs font-mono text-slate-400 block mt-0.5 whitespace-nowrap">
                    {pay.receiptNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadReceipt(pay.id)}
                  title="تحميل الإيصال"
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {downloadedReceiptId === pay.id ? (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  ) : (
                    <Download size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module 4: Notification Setting Toggle for Course Expiry */}
      <div
        className="bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
        style={{
          padding: '22px 28px',
          borderRadius: '24px',
          marginTop: '28px',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Bell size={22} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              تنبيه عند اقتراب انتهاء الدورة
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              إرسال إشعار تذكير قبل 10 أيام من موعد تجديد الاشتراك
            </p>
          </div>
        </div>

        {/* Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={notificationSettings.courseExpiry}
            onChange={handleToggleCourseExpiryAlert}
            className="sr-only peer"
          />
          <div
            className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-xs"
            style={{
              backgroundColor: notificationSettings.courseExpiry ? theme.primary : undefined,
            }}
          />
        </label>
      </div>
    </div>
  );
}
