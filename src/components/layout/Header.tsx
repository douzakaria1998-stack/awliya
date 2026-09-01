'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Shield,
  UserPlus,
  Check,
  CheckCheck,
  Globe,
  BookOpen,
  CreditCard,
  Calendar,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';
import { NavTabKey, PerformanceTabKey, getStudentGenderNoun, SHOW_ADD_STUDENT_BUTTON } from '@/lib/constants';
import { Language, translateHomeworkTitle, translateTeacherNote } from '@/lib/translations';

interface HeaderProps {
  activeTab?: NavTabKey;
  onOpenAddStudent: () => void;
  onNavigate?: (tab: NavTabKey, subTab?: PerformanceTabKey) => void;
}

export function Header({ activeTab = 'dashboard', onOpenAddStudent, onNavigate }: HeaderProps) {
  const {
    students,
    activeStudent,
    setActiveStudentId,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStudent();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { parent, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (isLangOpen && langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      if (isNotifOpen && notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isLangOpen, isNotifOpen, isProfileOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationDetails = (type: string) => {
    switch (type) {
      case 'homework':
        return {
          icon: <BookOpen size={16} className="text-violet-600 dark:text-violet-400" />,
          bg: 'bg-violet-50 dark:bg-violet-950/50 border-violet-200/80 dark:border-violet-800/60',
          badgeText: language === 'ar' ? 'واجب منزلي' : language === 'fr' ? 'Devoir' : 'Homework',
        };
      case 'payment':
        return {
          icon: <CreditCard size={16} className="text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/60',
          badgeText: language === 'ar' ? 'رسوم ودفع' : language === 'fr' ? 'Paiement' : 'Tuition & Payment',
        };
      case 'attendance':
        return {
          icon: <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/60',
          badgeText: language === 'ar' ? 'حضور وغياب' : language === 'fr' ? 'Présence' : 'Attendance',
        };
      case 'feedback':
        return {
          icon: <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />,
          bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800/60',
          badgeText: language === 'ar' ? 'ملاحظة المعلم' : language === 'fr' ? 'Remarque' : 'Teacher Note',
        };
      default:
        return {
          icon: <Sparkles size={16} className="text-slate-600 dark:text-slate-400" />,
          bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700',
          badgeText: language === 'ar' ? 'إشعار عام' : language === 'fr' ? 'Notification' : 'Notice',
        };
    }
  };

  const formatNotifDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = language === 'ar' ? (hours >= 12 ? 'م' : 'ص') : (hours >= 12 ? 'PM' : 'AM');
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    } catch {
      return dateStr;
    }
  };

  const getScreenTitle = (tab: NavTabKey) => {
    switch (tab) {
      case 'dashboard':
        return t.navDashboard;
      case 'academic':
        return t.navAcademic;
      case 'performance':
        return t.navPerformance;
      case 'financials':
        return t.navFinancials;
      case 'profile':
        return t.navProfile;
      default:
        return t.navDashboard;
    }
  };

  const currentTitle = getScreenTitle(activeTab);
  const parentInitial = parent.fullNameAr.split(' ')[0]?.[0] || 'A';

  const languagesList: { code: Language; label: string; flagUrl: string }[] = [
    { code: 'ar', label: 'العربية', flagUrl: 'https://flagcdn.com/w80/sa.png' },
    { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w80/gb.png' },
    { code: 'fr', label: 'Français', flagUrl: 'https://flagcdn.com/w80/fr.png' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header
      className="w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 flex items-center shadow-2xs select-none"
      style={{
        paddingRight: isRTL ? '56px' : '48px',
        paddingLeft: isRTL ? '48px' : '56px',
      }}
      suppressHydrationWarning
    >
      {/* Container aligned with cards grid */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        {/* Screen Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {currentTitle}
          </h1>
        </div>

        {/* Controls: Language Switcher, Dark Mode, Notifications, Parent Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher Dropdown */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsProfileOpen(false);
                setIsNotifOpen(false);
              }}
              className="rounded-full bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-all shadow-2xs"
              style={{
                height: '42px',
                paddingRight: '14px',
                paddingLeft: '14px',
                gap: '10px',
              }}
              title="تغيير اللغة / Change Language / Changer la langue"
            >
              <img
                src={currentLangObj.flagUrl}
                alt={currentLangObj.label}
                className="w-5 h-5 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700"
              />
              <span className="hidden sm:inline font-mono uppercase tracking-wider font-extrabold">{currentLangObj.code}</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 shrink-0 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Language Menu */}
            {isLangOpen && (
              <div
                className={`absolute top-full mt-2 min-w-[210px] bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-fade-in-up ${
                  isRTL ? 'left-0 text-right' : 'right-0 text-left'
                }`}
                style={{
                  padding: '8px',
                  borderRadius: '20px',
                }}
              >
                <div className="space-y-1">
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                        language === item.code
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '14px',
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <img
                          src={item.flagUrl}
                          alt={item.label}
                          className="w-5 h-5 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-bold text-xs sm:text-sm">{item.label}</span>
                      </span>
                      {language === item.code && <Check size={16} className="stroke-[3] shrink-0 text-rose-600 dark:text-rose-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.toggleTheme}
            aria-label={t.toggleTheme}
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Notification Bell Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
                setIsLangOpen(false);
              }}
              className="relative w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={t.notifications}
              title={t.notifications}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div
                className={`absolute top-full mt-3 w-[360px] sm:w-[420px] bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-700 shadow-2xl z-50 animate-fade-in-up select-none ${
                  isRTL ? 'left-0 text-right' : 'right-0 text-left'
                }`}
                style={{
                  padding: '24px',
                  borderRadius: '28px',
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
                  style={{ paddingBottom: '16px', marginBottom: '18px' }}
                >
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-slate-700 dark:text-slate-200 shrink-0" />
                    <span className="font-black text-base text-slate-900 dark:text-white">
                      {t.notifications}
                    </span>
                    {unreadCount > 0 && (
                      <span
                        className="inline-flex items-center justify-center text-xs font-black bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-2xs"
                        style={{ padding: '4px 12px', borderRadius: '12px', height: '26px' }}
                      >
                        {unreadCount} {language === 'ar' ? 'جديدة' : language === 'fr' ? 'non lus' : 'unread'}
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                      style={{ padding: '6px 14px', borderRadius: '12px' }}
                    >
                      <CheckCheck size={15} />
                      <span>{t.markAllRead}</span>
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 dark:text-slate-500">
                      <Bell size={36} className="mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-bold">{t.noNotifications}</p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const details = getNotificationDetails(notif.type);
                      const notifStudent = students.find((s) => s.id === notif.studentId);
                      const stTheme = notifStudent
                        ? levelThemes[notifStudent.currentLevel as LevelId] || levelThemes[1]
                        : undefined;

                      return (
                        <div
                          key={notif.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.studentId) {
                              setActiveStudentId(notif.studentId);
                            }
                            if (notif.routeTo && onNavigate) {
                              const targetSubTab = notif.actionPayload?.tab as PerformanceTabKey | undefined;
                              onNavigate(notif.routeTo as NavTabKey, targetSubTab);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`group border transition-all cursor-pointer flex items-start ${
                            notif.isRead
                              ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 opacity-85 hover:opacity-100'
                              : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '20px',
                            gap: '16px',
                          }}
                        >
                          {/* Type Icon */}
                          <div
                            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center shrink-0 border ${details.bg}`}
                          >
                            {details.icon}
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1 space-y-1.5">
                            {/* Student Badge */}
                            {notifStudent && (
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-flex items-center gap-1.5 rounded-full font-black select-none shadow-2xs"
                                  style={{
                                    backgroundColor: `${stTheme?.primary || theme.primary}18`,
                                    color: stTheme?.primary || theme.primary,
                                    fontSize: '11px',
                                    paddingRight: '10px',
                                    paddingLeft: '10px',
                                    paddingTop: '2px',
                                    paddingBottom: '2px',
                                  }}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: stTheme?.primary || theme.primary }}
                                  />
                                  <span>{notifStudent.fullNameAr}</span>
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-3">
                              <span
                                className={`text-sm font-black truncate block ${
                                  notif.isRead
                                    ? 'text-slate-700 dark:text-slate-300'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {language === 'ar' ? notif.titleAr : notif.type === 'homework' ? t.homeworkNeedsRevision : notif.titleAr}
                              </span>
                              {!notif.isRead && (
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-200 dark:ring-rose-950" />
                              )}
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                              {language === 'ar' ? notif.messageAr : notif.type === 'homework' ? t.homeworkNeedsRevisionDesc : notif.messageAr}
                            </p>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                <Clock size={12} className="shrink-0" />
                                <span>{formatNotifDate(notif.date)}</span>
                              </div>
                              <span
                                className="text-[11px] font-bold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
                                style={{ color: theme.primary }}
                              >
                                <span>{language === 'ar' ? 'عرض التفاصيل' : language === 'fr' ? 'Voir détails' : 'View Details'}</span>
                                <span className="text-xs">{isRTL ? '←' : '→'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Parent Profile Pill */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsLangOpen(false);
                setIsNotifOpen(false);
              }}
              className="rounded-full bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs flex items-center cursor-pointer transition-all"
              style={{
                height: '42px',
                paddingRight: isRTL ? '12px' : '18px',
                paddingLeft: isRTL ? '18px' : '12px',
                gap: '14px',
              }}
            >
              {/* Avatar circle */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-2xs"
                style={{ backgroundColor: theme.primary }}
              >
                {parentInitial}
              </div>

              {/* Parent First Name */}
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {parent.fullNameAr.split(' ')[0] || 'Ahmed'}
              </span>

              {/* Dropdown Chevron */}
              <ChevronDown
                size={15}
                className={`text-slate-400 shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown for quick student switching */}
            {isProfileOpen && (
              <div
                className={`absolute top-full mt-3 w-80 sm:w-84 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-700 shadow-2xl z-50 animate-fade-in-up select-none ${
                  isRTL ? 'left-0 text-right' : 'right-0 text-left'
                }`}
                style={{ padding: '20px 22px' }}
              >
                {/* Dropdown Header */}
                <div className="flex items-center gap-2.5 pb-4 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.registeredStudents}
                  </span>
                  <span
                    className="inline-flex items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs select-none"
                    style={{
                      backgroundColor: theme.primary,
                      minWidth: '22px',
                      height: '22px',
                      padding: '0 7px',
                      fontSize: '11px',
                    }}
                  >
                    {students.length}
                  </span>
                </div>

                {/* Students List */}
                <div className="space-y-3">
                  {students.length === 0 ? (
                    <div className="text-center py-4 text-xs font-bold text-slate-400">
                      {language === 'ar' ? 'لا يوجد طلاب مرتبطين بهذا الحساب بعد' : 'No students linked yet'}
                    </div>
                  ) : (
                    students.map((st) => {
                      const isSelected = activeStudent ? st.id === activeStudent.id : false;
                      const stTheme = levelThemes[st.currentLevel as LevelId] || levelThemes[1];

                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setActiveStudentId(st.id);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-2xl transition-all cursor-pointer select-none ${
                            isRTL ? 'text-right' : 'text-left'
                          } ${
                            isSelected
                              ? 'bg-slate-50 dark:bg-slate-800/90 ring-1.5 ring-slate-200 dark:ring-slate-700 shadow-2xs'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                          style={{ padding: '12px 14px' }}
                        >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-2xs"
                            style={{ backgroundColor: stTheme.primary }}
                          >
                            {st.fullNameAr.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block leading-snug truncate">
                              {st.fullNameAr}
                            </span>
                            {st.status === 'pending' ? (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block" style={{ marginTop: '3px' }}>
                                {language === 'ar' ? 'قيد المراجعة والاعتماد' : language === 'fr' ? 'En cours de validation' : 'Pending Approval'}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium block" style={{ marginTop: '5px' }}>
                                {t.level} {st.currentLevel}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            className="w-4 h-4 min-w-[16px] min-h-[16px] rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
                </div>

                {/* Logout Button */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{language === 'ar' ? 'تسجيل الخروج' : language === 'fr' ? 'Se Déconnecter' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
