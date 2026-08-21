'use client';

import React from 'react';
import {
  Home,
  Compass,
  BarChart3,
  CreditCard,
  User,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { NavTabKey } from '@/lib/constants';

interface BottomNavigationProps {
  activeTab: NavTabKey;
  onTabChange: (tab: NavTabKey) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const navItems = [
    { key: 'dashboard' as NavTabKey, label: t.navDashboard, iconName: 'Home' },
    { key: 'academic' as NavTabKey, label: t.navAcademic, iconName: 'Compass' },
    { key: 'performance' as NavTabKey, label: t.navPerformance, iconName: 'BarChart3' },
    { key: 'financials' as NavTabKey, label: t.navFinancials, iconName: 'CreditCard' },
    { key: 'profile' as NavTabKey, label: t.navProfile, iconName: 'User' },
  ];

  const renderIcon = (iconName: string, isActive: boolean) => {
    const props = {
      size: 20,
      className: `transition-transform duration-200 ${
        isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
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
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-2 py-2 safe-bottom shadow-lg"
      aria-label="Mobile Navigation"
      suppressHydrationWarning
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all select-none min-w-[56px] cursor-pointer ${
                isActive
                  ? 'font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              style={{
                color: isActive ? theme.primary : undefined,
              }}
            >
              <div className="relative">
                {renderIcon(item.iconName, isActive)}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
