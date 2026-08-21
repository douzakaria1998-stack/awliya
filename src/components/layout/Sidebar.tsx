'use client';

import React from 'react';
import {
  Home,
  Compass,
  BarChart3,
  CreditCard,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { NavTabKey } from '@/lib/constants';

interface SidebarProps {
  activeTab: NavTabKey;
  onTabChange: (tab: NavTabKey) => void;
  onOpenAddStudent: () => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const navItems = [
    { key: 'dashboard' as NavTabKey, label: t.navDashboard, iconName: 'Home' },
    { key: 'academic' as NavTabKey, label: t.navAcademic, iconName: 'Compass' },
    { key: 'performance' as NavTabKey, label: t.navPerformance, iconName: 'BarChart3' },
    { key: 'financials' as NavTabKey, label: t.navFinancials, iconName: 'CreditCard' },
    { key: 'profile' as NavTabKey, label: t.navProfile, iconName: 'User' },
  ];

  const renderIcon = (iconName: string, isActive: boolean) => {
    const props = {
      size: 22,
      className: `shrink-0 transition-colors ${
        isActive ? 'stroke-[2.5]' : 'stroke-2'
      }`,
    };

    switch (iconName) {
      case 'Home':
        return <Home {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'CreditCard':
        return <CreditCard {...props} />;
      case 'User':
        return <User {...props} />;
      default:
        return <Home {...props} />;
    }
  };

  return (
    <aside
      className={`hidden md:flex flex-col w-[300px] min-w-[300px] max-w-[300px] shrink-0 bg-white dark:bg-slate-900 ${
        isRTL ? 'border-l' : 'border-r'
      } border-slate-200/80 dark:border-slate-800 min-h-screen sticky top-0 h-screen z-30 justify-between select-none ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      aria-label={t.brandTitle}
      suppressHydrationWarning
    >
      <div>
        {/* 1. Brand Header: Exact height 64px (h-16) with generous 32px right padding */}
        <div
          className="h-16 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
          style={{
            paddingRight: isRTL ? '32px' : '20px',
            paddingLeft: isRTL ? '20px' : '32px',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xs shrink-0"
            style={{ backgroundColor: theme.primary }}
          >
            و
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              {t.brandTitle}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* 2. Navigation Menu with 28px right padding to ensure generous distance from screen edge */}
        <div
          className="pt-6 pb-2"
          style={{
            paddingRight: isRTL ? '28px' : '20px',
            paddingLeft: isRTL ? '20px' : '28px',
          }}
        >
          <nav className="space-y-2.5" aria-label="Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onTabChange(item.key)}
                  className={`w-full flex items-center text-sm sm:text-base leading-6 font-bold transition-all cursor-pointer ${
                    isRTL ? 'text-right' : 'text-left'
                  } ${
                    isActive
                      ? 'font-black shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${theme.primary}18` : undefined,
                    color: isActive ? theme.primary : undefined,
                    paddingRight: isRTL ? '20px' : '16px',
                    paddingLeft: isRTL ? '16px' : '20px',
                    height: '50px',
                    borderRadius: '16px',
                    gap: '16px',
                  }}
                >
                  <div
                    className="w-6 h-6 shrink-0 flex items-center justify-center transition-transform"
                    style={{ color: isActive ? theme.primary : undefined }}
                  >
                    {renderIcon(item.iconName, isActive)}
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Logout button with generous padding */}
      <div
        className="pt-4 pb-4 border-t border-slate-100 dark:border-slate-800 mb-1"
        style={{
          paddingRight: isRTL ? '28px' : '20px',
          paddingLeft: isRTL ? '20px' : '28px',
        }}
      >
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center text-xs sm:text-sm font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
          style={{
            paddingRight: isRTL ? '20px' : '16px',
            paddingLeft: isRTL ? '16px' : '20px',
            height: '48px',
            borderRadius: '14px',
            gap: '14px',
          }}
        >
          <LogOut size={20} className="shrink-0" />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}
