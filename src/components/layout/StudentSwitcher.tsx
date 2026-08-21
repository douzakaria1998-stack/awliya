'use client';

import React, { useState } from 'react';
import { ChevronDown, UserPlus, Sparkles, Check } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';

interface StudentSwitcherProps {
  onOpenAddStudent: () => void;
}

export function StudentSwitcher({ onOpenAddStudent }: StudentSwitcherProps) {
  const { students, activeStudent, setActiveStudentId } = useStudent();
  const [isOpen, setIsOpen] = useState(false);

  const activeLevelTheme = levelThemes[activeStudent.currentLevel];

  const handleSelectStudent = (id: string) => {
    setActiveStudentId(id);
    setIsOpen(false);
  };

  return (
    <div className="relative z-30">
      {/* Active Student Bar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          {/* Avatar with dynamic level color ring */}
          <div
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-base shadow-sm ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
            style={{
              background: activeLevelTheme.gradient,
              borderColor: activeLevelTheme.primary,
            }}
          >
            {activeStudent.nicknameAr ? activeStudent.nicknameAr[0] : activeStudent.fullNameAr[0]}
            <span
              className="absolute -bottom-1 -left-1 px-1.5 py-0.2 rounded-full text-[9px] font-black text-white bg-slate-900/90 shadow"
              style={{ backgroundColor: activeLevelTheme.primaryDark }}
            >
              L{activeStudent.currentLevel}
            </span>
          </div>

          {/* Student Info */}
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {activeStudent.fullNameAr}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10.5px] font-bold text-white shadow-xs"
                style={{ backgroundColor: activeLevelTheme.primary }}
              >
                {activeLevelTheme.shortNameAr}
              </span>
            </div>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[210px]">
              {activeStudent.enrolledPathAr}
            </p>
          </div>
        </div>

        {/* Chevron */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown size={16} />
        </div>
      </button>

      {/* Backdrop for closing */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in-up">
          <div className="flex items-center justify-between px-2 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              الأبناء المسجلون ({students.length})
            </span>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              تغيير اللون حسب المستوى
            </span>
          </div>

          {/* Students List */}
          <div className="space-y-1.5 my-1.5 max-h-60 overflow-y-auto">
            {students.map((student) => {
              const isSelected = student.id === activeStudent.id;
              const theme = levelThemes[student.currentLevel as LevelId] || levelThemes[1];

              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleSelectStudent(student.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-right ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-slate-800/80 ring-1.5 ring-offset-1'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.primary : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Level Colored Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0"
                      style={{ background: theme.gradient }}
                    >
                      {student.nicknameAr ? student.nicknameAr[0] : student.fullNameAr[0]}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {student.fullNameAr}
                        </span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: theme.primary }}
                        >
                          المستوى {student.currentLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                          {student.enrolledPathAr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          ({student.currentLevelProgress}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Student Action Button */}
          <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAddStudent();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <UserPlus size={15} />
              <span>إضافة طالب جديد (ربط ابن)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
