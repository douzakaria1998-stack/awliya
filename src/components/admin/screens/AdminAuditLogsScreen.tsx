'use client';

import React from 'react';
import {
  FileText,
  Clock,
  User,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  History,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminAuditLogsScreen() {
  const { auditLogs } = useAdmin();
  const { isRTL, language } = useLanguage();

  return (
    <div className={`w-full pb-10 space-y-6 select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div>
        <span className="text-xs sm:text-sm font-bold text-slate-400">
          {language === 'ar' ? 'سجل الرقابة والعمليات الإدارية' : 'Audit Trail & Compliance Logs'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
          {language === 'ar' ? 'سجل التدقيق الإداري (Audit Log System)' : 'Audit Logs'}
        </h2>
      </div>

      {/* Audit Log Table (Section 37-D in PDF: Who, What, When, Previous value, New value) */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <History size={18} className="text-purple-600" />
            <span>سجل العمليات الإدارية المنفذة</span>
          </div>
          <span className="text-xs text-slate-400">{auditLogs.length} عملية مسجلة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">المسؤول (Who)</th>
                <th className="py-3.5 px-4 text-center">التوقيت (When)</th>
                <th className="py-3.5 px-6 text-right">العملية المنجزة (What)</th>
                <th className="py-3.5 px-4 text-center">القيمة السابقة (Previous)</th>
                <th className="py-3.5 px-4 text-center">القيمة الجديدة (New Value)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 dark:text-white">{log.actorName}</div>
                    <div className="text-[11px] text-purple-600 font-mono">{log.actorRole}</div>
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-slate-400 text-xs">
                    {log.timestamp}
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">
                    <div>{log.actionAr}</div>
                    {log.details && (
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">{log.details}</div>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-xs text-rose-600 bg-rose-50/50 dark:bg-rose-950/20">
                    {log.previousValue || '—'}
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-xs text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20">
                    {log.newValue || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
