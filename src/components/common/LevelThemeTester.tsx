'use client';

import React, { useState } from 'react';
import { Palette, ChevronDown, Sparkles } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';

export function LevelThemeTester() {
  const { activeStudent, changeActiveStudentLevel } = useStudent();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = levelThemes[activeStudent.currentLevel];

  return (
    <div className="w-full bg-slate-900 text-white text-xs border-b border-slate-800 px-3 py-1.5 transition-all">
      <div className="flex items-center justify-between">
        {/* Toggle Bar */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white"
        >
          <Palette size={13} className="text-amber-400" />
          <span>اختبار السمات الـ 10 (المستوى الحالي: {activeStudent.currentLevel})</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          {isDarkMode ? '☀️ وضع النهار' : '🌙 وضع الليل'}
        </button>
      </div>

      {/* Expanded 10 Level Quick Switcher */}
      {isOpen && (
        <div className="mt-2 pt-2 border-t border-slate-800 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400">
              اختر أي مستوى لاختبار تحول ألوان التطبيق فورياً:
            </span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.2 rounded text-white"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {currentTheme.nameAr}
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1 my-1">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as LevelId[]).map((lvl) => {
              const th = levelThemes[lvl];
              const isActive = activeStudent.currentLevel === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => changeActiveStudentLevel(lvl)}
                  className={`h-7 rounded-md text-[10px] font-black text-white transition-all flex items-center justify-center ${
                    isActive ? 'ring-2 ring-white scale-105 shadow' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: th.primary }}
                  title={th.nameAr}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
