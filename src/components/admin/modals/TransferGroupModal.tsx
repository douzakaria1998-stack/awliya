'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowRightLeft,
  Search,
  School,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  BookOpen,
} from 'lucide-react';
import { AdminStudent, AdminGroup } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { autoTranslateGroupName } from '@/lib/translations';

interface TransferGroupModalProps {
  student: AdminStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newGroup: AdminGroup) => void;
}

export function TransferGroupModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}: TransferGroupModalProps) {
  const { groups, transferStudentGroup } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [transferredGroup, setTransferredGroup] = useState<AdminGroup | null>(null);

  // Current student active group object
  const currentGroup = useMemo(() => {
    if (!student?.groupId) return null;
    return groups.find((g) => g.id === student.groupId) || null;
  }, [groups, student?.groupId]);

  // Selected target group object
  const targetGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  // Filtered available groups (search by code, name, teacher, level)
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groups.filter((g) => {
      if (g.status === 'archived') return false;

      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.code.toLowerCase().includes(q) ||
        g.teacherName.toLowerCase().includes(q) ||
        g.level.toLowerCase().includes(q) ||
        (g.language && g.language.toLowerCase().includes(q))
      );
    });
  }, [groups, searchQuery]);

  if (!isOpen || !student) return null;

  const handleSelectGroup = (grp: AdminGroup) => {
    if (grp.id === student.groupId) {
      setErrorMsg(
        language === 'ar'
          ? 'الطالب مسجل بالفعل في هذا الفوج حالياً. الرجاء اختيار فوج آخر مختلف.'
          : 'This student is already active in this group. Please select a different group.'
      );
      return;
    }
    setErrorMsg('');
    setSelectedGroupId(grp.id);
  };

  const handleConfirmTransfer = () => {
    if (!targetGroup) {
      setErrorMsg(
        language === 'ar'
          ? 'الرجاء اختيار الفوج الجديد المراد نقل الطالب إليه.'
          : 'Please select the target group for the student.'
      );
      return;
    }

    if (targetGroup.id === student.groupId) {
      setErrorMsg(
        language === 'ar'
          ? 'لا يمكن النقل إلى نفس الفوج الحالي.'
          : 'Cannot transfer to the student\'s current group.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = transferStudentGroup(
        student.id,
        targetGroup.id,
        transferReason.trim() || undefined
      );

      if (res.success) {
        setTransferredGroup(targetGroup);
        setIsSuccess(true);
        if (onSuccess) onSuccess(targetGroup);
      } else {
        setErrorMsg(res.message || 'Failed to transfer student');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error occurred while transferring student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setSelectedGroupId('');
    setSearchQuery('');
    setTransferReason('');
    setErrorMsg('');
    setIsSuccess(false);
    setTransferredGroup(null);
    onClose();
  };

  const currentGroupNameDisplay = currentGroup
    ? autoTranslateGroupName(currentGroup.name, language)
    : student.groupName || (language === 'ar' ? 'بدون فوج' : 'Unassigned');

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col"
        style={{ maxHeight: '88vh' }}
      >
        
        {/* Modal Header */}
        <div
          className="relative bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white flex items-center justify-between border-b border-purple-900/40 shrink-0"
          style={{ padding: '20px 28px' }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 font-black shadow-md shrink-0">
              <ArrowRightLeft size={22} className="text-purple-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-white truncate">
                {language === 'ar' ? 'نقل الطالب إلى فوج آخر' : 'Change Student Group'}
              </h3>
              <p className="text-xs text-purple-200/80 font-medium truncate mt-0.5">
                {language === 'ar'
                  ? 'تغيير الفوج النشط للطالب مع حفظ كامل السجلات التاريخية'
                  : 'Transfer active group while preserving all historical records'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseAndReset}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          /* Success Screen */
          <div
            className="flex flex-col items-center justify-center text-center overflow-y-auto min-h-0"
            style={{ padding: '40px 32px' }}
          >
            <div
              className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs"
              style={{ marginBottom: '20px' }}
            >
              <CheckCircle2 size={46} strokeWidth={2.2} />
            </div>

            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs shadow-2xs"
              style={{ padding: '6px 16px', marginBottom: '14px' }}
            >
              <Sparkles size={14} />
              <span>{language === 'ar' ? 'تم نقل الفوج بنجاح' : 'Transfer Completed Successfully'}</span>
            </span>

            <h3
              className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white"
              style={{ marginBottom: '10px' }}
            >
              {language === 'ar' ? 'تم تحديث الفوج النشط للطالب' : 'Student Group Updated'}
            </h3>

            <p
              className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed font-medium"
              style={{ marginBottom: '24px' }}
            >
              {language === 'ar'
                ? `تم إسناد الطالب (${student.fullNameAr}) إلى الفوج الجديد (${transferredGroup?.name || ''}). تم أرشفة بيانات الفوج السابق في السجل التاريخي دون أي حذف.`
                : `Student (${student.fullNameEn || student.fullNameAr}) is now active in (${transferredGroup?.name || ''}). Historical records from previous groups are safely retained.`}
            </p>

            {/* Transfer Comparison Summary */}
            <div
              className="w-full max-w-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
              style={{ padding: '16px 20px', marginBottom: '28px' }}
            >
              <div className="text-center flex-1 min-w-0">
                <span className="text-[11px] text-slate-400 font-semibold block" style={{ marginBottom: '4px' }}>
                  {language === 'ar' ? 'الفوج السابق' : 'Previous Group'}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">
                  {currentGroupNameDisplay}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                <ArrowIcon size={16} />
              </div>

              <div className="text-center flex-1 min-w-0">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block" style={{ marginBottom: '4px' }}>
                  {language === 'ar' ? 'الفوج الجديد (النشط)' : 'New Active Group'}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate block">
                  {transferredGroup?.name || ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAndReset}
              className="w-full max-w-xs rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs sm:text-sm h-11 flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              {language === 'ar' ? 'تم، إغلاق النافذة' : 'Done, Close'}
            </button>
          </div>
        ) : (
          /* Form Screen */
          <div
            className="flex-1 overflow-y-auto min-h-0"
            style={{
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
            }}
          >
            
            {/* 1. Student Summary Banner */}
            <div
              className="rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 flex items-center justify-between gap-4 flex-wrap"
              style={{ padding: '16px 20px' }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  {student.fullNameAr[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {language === 'ar' ? student.fullNameAr : (student.fullNameEn || student.fullNameAr)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate" style={{ marginTop: '3px' }}>
                    {language === 'ar' ? 'المستوى الحالي:' : 'Current Level:'} {student.currentLevel} • ID: <span className="font-mono">{student.id}</span>
                  </div>
                </div>
              </div>

              {/* Current Group Badge */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider" style={{ marginBottom: '4px' }}>
                  {language === 'ar' ? 'الفوج النشط حالياً' : 'Current Active Group'}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 text-xs font-bold border border-purple-200 dark:border-purple-800"
                  style={{ padding: '6px 14px' }}
                >
                  <School size={13} />
                  <span>{currentGroupNameDisplay}</span>
                </span>
              </div>
            </div>

            {/* 2. Visual Transfer Path Preview (if target selected) */}
            {targetGroup && (
              <div
                className="rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/15 to-emerald-900/10 dark:from-purple-950/40 dark:via-indigo-950/50 dark:to-emerald-950/40 border border-purple-200/80 dark:border-purple-800/80 animate-fade-in shadow-2xs"
                style={{ padding: '16px 20px' }}
              >
                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                  {/* From Group */}
                  <div
                    className="flex-1 min-w-0 bg-white/90 dark:bg-slate-850 rounded-xl border border-purple-100 dark:border-slate-700"
                    style={{ padding: '12px 14px' }}
                  >
                    <span className="text-[10px] text-slate-400 font-bold block" style={{ marginBottom: '2px' }}>
                      {language === 'ar' ? 'من الفوج' : 'From Group'}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate block text-xs">
                      {currentGroupNameDisplay}
                    </span>
                    <span className="text-[10px] text-slate-400 block" style={{ marginTop: '2px' }}>
                      {student.teacherName || (language === 'ar' ? 'غير مسند' : 'Unassigned')}
                    </span>
                  </div>

                  {/* Transfer Icon */}
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ArrowIcon size={16} />
                  </div>

                  {/* To Group */}
                  <div
                    className="flex-1 min-w-0 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800"
                    style={{ padding: '12px 14px' }}
                  >
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block" style={{ marginBottom: '2px' }}>
                      {language === 'ar' ? 'إلى الفوج (الهدف)' : 'To Group (Target)'}
                    </span>
                    <span className="font-black text-emerald-900 dark:text-emerald-200 truncate block text-xs">
                      {autoTranslateGroupName(targetGroup.name, language)}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block" style={{ marginTop: '2px' }}>
                      {targetGroup.teacherName || (language === 'ar' ? 'المعلم الجديد' : 'New Teacher')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Search & Group Selection List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{language === 'ar' ? 'اختر الفوج الجديد *' : 'Select Target Group *'}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {language === 'ar'
                    ? `الأفواج المتاحة (${filteredGroups.length})`
                    : `Available Groups (${filteredGroups.length})`}
                </span>
              </label>

              {/* Search Bar */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'ابحث برمز الفوج، اسم الفوج، المعلم، أو المستوى...'
                      : 'Search by group code, name, teacher, or level...'
                  }
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 shadow-2xs"
                  style={{
                    height: '46px',
                    paddingLeft: isRTL ? (searchQuery ? '38px' : '14px') : '42px',
                    paddingRight: isRTL ? '42px' : (searchQuery ? '38px' : '14px'),
                  }}
                />
                <Search
                  size={16}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
                    isRTL ? 'right-3.5' : 'left-3.5'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ${
                      isRTL ? 'left-3' : 'right-3'
                    }`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Group Roster Cards */}
              <div
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 overflow-y-auto"
                style={{
                  maxHeight: '210px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {filteredGroups.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 font-medium" style={{ padding: '24px 12px' }}>
                    {language === 'ar'
                      ? 'لا يوجد أي فوج مطابق لمعايير البحث'
                      : 'No matching groups found'}
                  </div>
                ) : (
                  filteredGroups.map((grp) => {
                    const isCurrent = grp.id === student.groupId;
                    const isSelected = grp.id === selectedGroupId;

                    return (
                      <div
                        key={grp.id}
                        onClick={() => !isCurrent && handleSelectGroup(grp)}
                        className={`rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 dark:border-purple-600 shadow-xs cursor-pointer ring-1 ring-purple-500/30'
                            : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer hover:bg-purple-50/30 dark:hover:bg-purple-950/20'
                        }`}
                        style={{ padding: '12px 14px' }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Code Pill */}
                          <span
                            className="font-mono font-black text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0"
                            style={{ padding: '4px 10px' }}
                          >
                            {grp.code}
                          </span>

                          <div className="min-w-0">
                            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate flex items-center gap-2">
                              <span>{autoTranslateGroupName(grp.name, language)}</span>
                              {isCurrent && (
                                <span
                                  className="text-[10px] font-bold rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0"
                                  style={{ padding: '2px 8px' }}
                                >
                                  {language === 'ar' ? 'الفوج الحالي' : 'Current'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 flex-wrap" style={{ marginTop: '2px' }}>
                              <span>
                                {language === 'ar' ? 'المعلم:' : 'Teacher:'} {grp.teacherName || (language === 'ar' ? 'غير مسند' : 'Unassigned')}
                              </span>
                              <span>•</span>
                              <span className="font-semibold text-purple-600 dark:text-purple-400">
                                {grp.level}
                              </span>
                              <span>•</span>
                              <span>
                                {grp.studentIds?.length || 0} {language === 'ar' ? 'طلاب' : 'students'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Selection Checkmark */}
                        <div className="shrink-0">
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 4. Optional Transfer Reason / Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{language === 'ar' ? 'سبب النقل (اختياري)' : 'Transfer Reason (Optional)'}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {language === 'ar' ? 'سيتم توثيقه في السجل التاريخي' : 'Will be logged in history'}
                </span>
              </label>
              <input
                type="text"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'مثال: ترقية مستوى الطالب، تعديل توقيت الحصص، أو رغبة ولي الأمر...'
                    : 'e.g. Level upgrade, schedule conflict resolution, or parent request...'
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-2xs"
                style={{ height: '46px', padding: '10px 14px' }}
              />
            </div>

            {/* 5. Non-Destructive Data Safety Notice */}
            <div
              className="rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium shadow-2xs"
              style={{ padding: '14px 18px' }}
            >
              <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block" style={{ marginBottom: '2px' }}>
                  {language === 'ar' ? 'ضمان حفظ السجلات الأكاديمية:' : 'Data Preservation Guarantee:'}
                </span>
                <span>
                  {language === 'ar'
                    ? 'عملية نقل الفوج لا تحذف أي بيانات. ستبقى سجلات الحضور، الواجبات المنزلية، تقييمات المعلم، والدرجات السابقة محفوظة ومتاحة بالكامل في السجل التاريخي للطالب.'
                    : 'Group transfer does not delete any data. All past attendance, homework, teacher feedback, and assessment grades remain fully preserved in the student\'s academic timeline.'}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                className="rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 font-bold animate-shake"
                style={{ padding: '12px 16px' }}
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        {!isSuccess && (
          <div
            className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end shrink-0"
            style={{ padding: '16px 28px', gap: '12px' }}
          >
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              style={{ height: '42px', padding: '0 20px' }}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={!targetGroup || isSubmitting}
              onClick={handleConfirmTransfer}
              className={`rounded-xl text-xs font-black text-white flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                !targetGroup || isSubmitting
                  ? 'bg-purple-400 cursor-not-allowed opacity-60'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-95 hover:shadow-purple-500/20'
              }`}
              style={{ height: '42px', padding: '0 24px' }}
            >
              <ArrowRightLeft size={15} />
              <span>
                {isSubmitting
                  ? (language === 'ar' ? 'جاري النقل...' : 'Transferring...')
                  : (language === 'ar' ? 'تأكيد نقل الفوج' : 'Confirm Transfer')}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
