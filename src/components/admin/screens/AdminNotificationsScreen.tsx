'use client';

import React from 'react';
import {
  Bell,
  BookCheck,
  CalendarCheck2,
  AlertTriangle,
  Award,
  MessageSquareQuote,
  School,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminNotificationsScreen() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdmin();
  const { isRTL, language } = useLanguage();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'homework':
        return <BookCheck size={18} className="text-purple-600" />;
      case 'attendance':
      case 'absence':
      case 'low_attendance':
        return <AlertTriangle size={18} className="text-amber-600" />;
      case 'assessment':
        return <Award size={18} className="text-indigo-600" />;
      case 'feedback':
        return <MessageSquareQuote size={18} className="text-emerald-600" />;
      default:
        return <Bell size={18} className="text-blue-600" />;
    }
  };

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'مركز التنبيهات وإشعارات المنصة' : 'Notification Center'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'مركز الإشعارات والتعميمات (Notifications Center)' : 'Notifications'}
          </h2>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CheckCheck size={16} />
          <span>{language === 'ar' ? 'تعيين الكل كمقروء' : 'Mark all as read'}</span>
        </button>
      </div>

      {/* Notifications List (Section 37-A) */}
      <div className="space-y-4" style={{ marginBottom: '32px' }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className={`rounded-[24px] border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              !notif.isRead
                ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/60 shadow-2xs'
                : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800'
            }`}
            style={{ padding: '24px 28px' }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-2xs">
                {getCategoryIcon(notif.category)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{notif.titleAr}</h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {notif.messageAr}
                </p>
                <span className="font-mono text-[11px] text-slate-400 block pt-1">{notif.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
