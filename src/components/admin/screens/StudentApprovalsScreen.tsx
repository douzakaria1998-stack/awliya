'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  Languages,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { PendingStudentApproval } from '@/types/admin';

export function StudentApprovalsScreen() {
  const { pendingApprovals, approveStudentRegistration, rejectStudentRegistration } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApproval, setSelectedApproval] = useState<PendingStudentApproval | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>('مسار اللغة الإنجليزية المكثف (English Language Path)');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const filteredApprovals = pendingApprovals.filter((appr) => {
    const matchesSearch =
      appr.studentNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appr.parentNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (appr.studentNameEn && appr.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || appr.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenApprovalModal = (appr: PendingStudentApproval) => {
    setSelectedApproval(appr);
    setSelectedLevel(appr.requestedLevel || 1);
    setSelectedTrack(appr.enrolledPathAr || 'مسار اللغة الإنجليزية المكثف (English Language Path)');
    setIsRejecting(false);
    setRejectReason('');
  };

  const handleConfirmApproval = () => {
    if (!selectedApproval) return;
    approveStudentRegistration(selectedApproval.id, selectedLevel, selectedTrack);
    setSelectedApproval(null);
  };

  const handleConfirmRejection = () => {
    if (!selectedApproval) return;
    rejectStudentRegistration(selectedApproval.id, rejectReason || 'غير مستوفٍ لشروط القبول');
    setSelectedApproval(null);
  };

  return (
    <div className="w-full select-none">
      {/* Header & Controls */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            طلبات تسجيل وقبول الطلاب الجدد
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            مراجعة طلبات التسجيل المرفوعة من أولياء الأمور وتسكينهم بالمستويات والشُعب المناسبة.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'all' && 'الكل'}
              {st === 'pending' && 'المعلقة'}
              {st === 'approved' && 'المقبولة'}
              {st === 'rejected' && 'المرفوضة'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative" style={{ marginBottom: '32px' }}>
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث باسم الطالب، اسم ولي الأمر، أو رقم الهاتف..."
          className="w-full h-12 pr-11 pl-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
        />
      </div>

      {/* Approvals Table / Card Grid */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-400 text-sm font-semibold">
            لا توجد طلبات تطابق معايير البحث
          </div>
        ) : (
          filteredApprovals.map((appr) => {
            const isPending = appr.status === 'pending';
            const isApproved = appr.status === 'approved';
            const isRejected = appr.status === 'rejected';

            return (
              <div
                key={appr.id}
                className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                style={{
                  padding: '26px 32px',
                  marginBottom: '18px',
                }}
              >
                {/* Left info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                      isPending
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : isApproved
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {appr.studentNameAr[0]}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                        {appr.studentNameAr}
                      </h3>

                      {isPending && (
                        <span
                          className="rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                          style={{ padding: '4px 12px' }}
                        >
                          قيد المراجعة
                        </span>
                      )}
                      {isApproved && (
                        <span
                          className="rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                          style={{ padding: '4px 12px' }}
                        >
                          تم القبول والتسكين
                        </span>
                      )}
                      {isRejected && (
                        <span
                          className="rounded-full text-[11px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30"
                          style={{ padding: '4px 12px' }}
                        >
                          مرفوض
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
                      <span>ولي الأمر: <strong className="text-slate-700 dark:text-slate-200">{appr.parentNameAr}</strong></span>
                      <span>•</span>
                      <span>الهاتف: <span className="font-mono">{appr.parentPhone}</span></span>
                      <span>•</span>
                      <span>تاريخ الطلب: <span className="font-mono">{appr.submissionDate}</span></span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2 pt-1">
                      <Languages size={14} className="text-rose-500 shrink-0" />
                      <span>{appr.enrolledPathAr} (المستوى المقترح: {appr.requestedLevel})</span>
                    </div>

                    {appr.notes && (
                      <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl mt-2">
                        {appr.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => handleOpenApprovalModal(appr)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      style={{ padding: '12px 22px' }}
                    >
                      <UserCheck size={16} />
                      <span>فحص واعتماد الطلب</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenApprovalModal(appr)}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                      style={{ padding: '10px 18px' }}
                    >
                      مراجعة القرار
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Approval Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">اعتماد وتسكين الطالب</h3>
                  <div className="text-xs text-slate-500">{selectedApproval.studentNameAr}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {!isRejecting ? (
              <div className="space-y-4">
                {/* Level Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    المستوى الأكاديمي المعتمد:
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        المستوى {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Track Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    المسار التعليمي المعتمد:
                  </label>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="مسار اللغة الإنجليزية المكثف (English Language Path)">
                      مسار اللغة الإنجليزية المكثف (English Language Path)
                    </option>
                    <option value="مسار اللغة الفرنسية التأسيسي (French Language Path)">
                      مسار اللغة الفرنسية التأسيسي (French Language Path)
                    </option>
                    <option value="المسار المزدوج: إنجليزية وفرنسية (Dual Languages Path)">
                      المسار المزدوج: إنجليزية وفرنسية (Dual Languages Path)
                    </option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  ✓ سيتم تفعيل حساب الطالب فورياً وظهوره كحساب نشط في بوابة ولي الأمر مع إشعاره بقبول التسجيل.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  سبب رفض طلب التسجيل (سيظهر لولي الأمر):
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="اكتب سبب الرفض مثل: عدم استيفاء الشروط، اكتمال المقاعد في هذا الفرع..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {!isRejecting ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(true)}
                    className="px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold text-xs transition-colors cursor-pointer"
                  >
                    رفض الطلب
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmApproval}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check size={16} />
                    <span>تأكيد القبول والتسكين</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmRejection}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <XCircle size={16} />
                    <span>تأكيد رفض الطلب</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
