'use client';

import React, { useState } from 'react';
import { X, BookCheck, AlertCircle, CheckCircle2, Clock, Send, Sparkles, Check } from 'lucide-react';
import { Homework } from '@/types';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';

interface HomeworkDetailModalProps {
  homework: Homework | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HomeworkDetailModal({ homework, isOpen, onClose }: HomeworkDetailModalProps) {
  const { submitHomeworkRevision } = useStudent();
  const { theme } = useTheme();

  const [parentNote, setParentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !homework) return null;

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitHomeworkRevision(homework.id, parentNote);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
          style={{ padding: '24px 30px' }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                homework.status === 'needs_revision'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}
            >
              {homework.status === 'needs_revision' ? (
                <AlertCircle size={24} />
              ) : (
                <BookCheck size={24} />
              )}
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                تفاصيل الواجب المنزلي
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                المستوى {homework.level} • {homework.subjectAr}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="py-14 px-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4 shadow-md">
              <Check size={36} strokeWidth={3} />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1.5">
              تم إرسال إعادة التسميع بنجاح!
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              تم إشعار المعلم لمراجعة الواجب وتعديل التقييم.
            </p>
          </div>
        ) : (
          <div
            className="overflow-y-auto text-right flex flex-col"
            style={{
              padding: '28px 32px',
              gap: '22px',
              maxHeight: '75vh',
            }}
          >
            {/* Title & Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-400">
                  عنوان الواجب:
                </span>
                {homework.status === 'needs_revision' && (
                  <span
                    className="inline-flex items-center rounded-full text-xs font-black bg-amber-500 text-white shadow-xs animate-pulse select-none"
                    style={{
                      height: '32px',
                      paddingRight: '16px',
                      paddingLeft: '16px',
                    }}
                  >
                    بحاجة إلى مراجعة
                  </span>
                )}
                {homework.status === 'completed' && (
                  <span
                    className="inline-flex items-center rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-2xs select-none"
                    style={{
                      height: '32px',
                      paddingRight: '16px',
                      paddingLeft: '16px',
                    }}
                  >
                    مكتمل ✓
                  </span>
                )}
                {homework.status !== 'needs_revision' && homework.status !== 'completed' && (
                  <span
                    className="inline-flex items-center rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 select-none"
                    style={{
                      height: '32px',
                      paddingRight: '16px',
                      paddingLeft: '16px',
                    }}
                  >
                    قيد الانتظار
                  </span>
                )}
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                {homework.titleAr}
              </h4>
            </div>

            {/* Teacher Note Box (Important highlight for needs revision) */}
            {homework.teacherNote && (
              <div
                className="rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs"
                style={{ padding: '18px 22px' }}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span>توجيه وملاحظة المعلم:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                  "{homework.teacherNote}"
                </p>
              </div>
            )}

            {/* Due Date & Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                style={{ padding: '18px 22px' }}
              >
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1.5">
                  <Clock size={16} />
                  <span>تاريخ الاستحقاق</span>
                </div>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                  {homework.dueDate}
                </span>
              </div>

              {homework.score !== undefined && (
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                  style={{ padding: '18px 22px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold mb-1.5 block">الدرجة الحالية</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">
                    {homework.score} / {homework.totalScore || 100}
                  </span>
                </div>
              )}
            </div>

            {/* Resubmit form if needs revision */}
            {homework.status === 'needs_revision' && (
              <form onSubmit={handleResubmit} className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                    ملاحظة ولي الأمر عند إعادة الإرسال:
                  </label>
                  <textarea
                    rows={3}
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                    placeholder="مثال: تم تكرار التسميع مع الطالب وضبط الآيات 3-4 بنجاح."
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl font-black text-sm sm:text-base text-white shadow-lg flex items-center justify-center gap-3 transition-all hover:opacity-95 active:scale-98 cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primary,
                    minHeight: '52px',
                    padding: '16px 28px',
                    marginTop: '16px',
                  }}
                >
                  <Send size={20} className="shrink-0" />
                  <span>{isSubmitting ? 'جاري الإرسال...' : 'تأكيد إعادة التسميع والمراجعة'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
