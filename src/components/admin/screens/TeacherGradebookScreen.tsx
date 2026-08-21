'use client';

import React, { useState } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Award,
  Sparkles,
  Search,
  Check,
  Languages,
  Clock,
  Send,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAdmin } from '@/context/AdminContext';
import { Homework } from '@/types';

export function TeacherGradebookScreen() {
  const { students, homeworkList } = useStudent();
  const { currentAdmin, gradeStudentHomework } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [gradeStatus, setGradeStatus] = useState<'completed' | 'needs_revision'>('completed');
  const [teacherNote, setTeacherNote] = useState<string>('أداء متميز في التحدث والمحادثة مع نطق سليم للقواعد.');
  const [selectedBadge, setSelectedBadge] = useState<string>('🌟 Top Speaker (متحدث متميز)');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const filteredHomework: Homework[] = (homeworkList || []).filter((hw: Homework) => {
    return (
      hw.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.subjectAr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenGradingModal = (hw: Homework) => {
    setSelectedHomework(hw);
    setGradeScore(hw.score || 95);
    setGradeStatus(hw.status === 'needs_revision' ? 'needs_revision' : 'completed');
    setTeacherNote(hw.teacherNote || 'أداء ممتاز وتطبيق دقيق لقواعد النطق والمحادثة.');
    setIsPlayingAudio(false);
  };

  const handleConfirmGrade = () => {
    if (!selectedHomework) return;

    gradeStudentHomework(
      students[0]?.id || 'student-001',
      selectedHomework.id,
      gradeScore,
      gradeStatus,
      teacherNote,
      selectedBadge
    );

    setSelectedHomework(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const badges = [
    '🌟 Top Speaker (متحدث متميز)',
    '🎯 Accent & Pronunciation Master',
    '✍️ Creative Writer',
    '🏆 Active Participant',
    '💎 Grammar Expert',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            دفتر تصحيح الواجبات والمهام اللغوية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            المصحح اللغوي: {currentAdmin.fullNameAr} ({currentAdmin.departmentAr})
          </p>
        </div>

        {successToast && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-lg animate-in fade-in flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>تم حفظ الدرجة وإرسال الملاحظات لولي الأمر بنجاح!</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث بعنوان الواجب أو مهارة اللغة..."
          className="w-full h-12 pr-11 pl-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
        />
      </div>

      {/* Homework List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHomework.map((hw: Homework) => {
          const isCompleted = hw.status === 'completed';
          const isPending = hw.status === 'pending';
          const needsRev = hw.status === 'needs_revision';

          return (
            <div
              key={hw.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {hw.subjectAr}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {hw.titleAr}
                    </h3>
                  </div>

                  {isCompleted && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                      تم التصحيح ({hw.score || 95}%)
                    </span>
                  )}
                  {needsRev && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0">
                      يتطلب إعادة
                    </span>
                  )}
                  {isPending && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                      بانتظار التسليم
                    </span>
                  )}
                </div>

                {/* Due date */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-3">
                  <Clock size={13} />
                  <span>تاريخ الاستحقاق: {hw.dueDate}</span>
                </div>

                {hw.teacherNote && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    <span className="font-bold">ملاحظة المعلم: </span>
                    {hw.teacherNote}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">الدرجة العظمى: 100 نقطة</span>
                <button
                  type="button"
                  onClick={() => handleOpenGradingModal(hw)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpenCheck size={15} />
                  <span>رصد / تعديل التقييم</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grading Modal */}
      {selectedHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-rose-500">{selectedHomework.subjectAr}</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {selectedHomework.titleAr}
              </h3>
            </div>

            {/* Audio Submission Player Simulation */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>التسجيل الصوتي للطالب (Speaking Sample):</span>
                <span className="font-mono text-slate-500">01:42 دقيقة</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 cursor-pointer shrink-0"
                >
                  {isPlayingAudio ? <Pause size={18} /> : <Play size={18} className="mr-0.5" />}
                </button>

                {/* Animated Waveform Visualizer */}
                <div className="flex-1 flex items-center gap-1 h-8 px-2 rounded-xl bg-slate-200/60 dark:bg-slate-900/60">
                  {[12, 24, 18, 30, 20, 14, 28, 22, 16, 26, 19, 10, 25, 32, 15, 8].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-rose-500 rounded-full transition-all"
                      style={{
                        height: isPlayingAudio ? `${Math.sin(i + Date.now() / 300) * 10 + 18}px` : `${h}px`,
                        opacity: isPlayingAudio ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Grade Score Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>الدرجة المرصودة (من 100):</span>
                <span className="text-xl font-black text-rose-600 font-mono">{gradeScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                حالة الاعتماد:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGradeStatus('completed')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    gradeStatus === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  ✓ اجتاز الواجب بنجاح
                </button>
                <button
                  type="button"
                  onClick={() => setGradeStatus('needs_revision')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    gradeStatus === 'needs_revision'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  ⚠ يتطلب إعادة التسجيل
                </button>
              </div>
            </div>

            {/* Badge Award */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                منح وسام تكريمي للطالب (Badge):
              </label>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                {badges.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                ملاحظات وتوجيهات المعلم:
              </label>
              <textarea
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedHomework(null)}
                className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmGrade}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>حفظ واعتماد التقييم</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
