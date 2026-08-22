'use client';

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  User,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  History,
  Filter,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminAuditLogsScreen() {
  const { auditLogs } = useAdmin();
  const { isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super_admin' | 'administrator' | 'teacher'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchRole = roleFilter === 'all' || log.actorRole === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'سجل الرقابة والعمليات الإدارية المعتمدة' : 'Audit Trail & Compliance Logs'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل التدقيق الإداري (Audit Log System)' : 'Audit Logs'}
          </h2>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
              isRTL ? 'right-3.5' : 'left-3.5'
            }`}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'البحث في سجل العمليات...' : 'Search logs...'}
            className={`w-full rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400 ${
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
            style={{ height: '44px' }}
          />
        </div>
      </div>

      {/* Audit Log Table (Section 37-D in PDF: Who, What, When, Previous value, New value) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs overflow-hidden"
        style={{ marginBottom: '36px' }}
      >
        {/* Table Card Header with Expanded 4-Side Spacing */}
        <div
          className="border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ padding: '24px 36px' }}
        >
          <div className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black shrink-0">
              <History size={19} />
            </div>
            <div>
              <h3>{language === 'ar' ? 'سجل العمليات الإدارية المنفذة' : 'Executed Administrative Operations'}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {language === 'ar'
                  ? 'توثيق فوري غير قابل للتعديل لجميع العمليات المنجزة في النظام'
                  : 'Real-time immutable log of all operations performed in the system'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className="rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200/60 dark:border-purple-800/40"
              style={{ padding: '6px 16px' }}
            >
              {filteredLogs.length} {language === 'ar' ? 'عملية مسجلة' : 'operations logged'}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-black">
              <tr>
                <th style={{ padding: '18px 36px', textAlign: isRTL ? 'right' : 'left' }}>
                  {language === 'ar' ? 'المسؤول (Who)' : 'Actor (Who)'}
                </th>
                <th style={{ padding: '18px 24px', textAlign: 'center' }}>
                  {language === 'ar' ? 'التوقيت (When)' : 'Timestamp (When)'}
                </th>
                <th style={{ padding: '18px 32px', textAlign: isRTL ? 'right' : 'left' }}>
                  {language === 'ar' ? 'العملية المنجزة (What)' : 'Action Performed (What)'}
                </th>
                <th style={{ padding: '18px 24px', textAlign: 'center' }}>
                  {language === 'ar' ? 'القيمة السابقة (Previous)' : 'Previous Value'}
                </th>
                <th style={{ padding: '18px 36px', textAlign: 'center' }}>
                  {language === 'ar' ? 'القيمة الجديدة (New Value)' : 'New Value'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-bold text-sm">
                    {language === 'ar' ? 'لا توجد عمليات تطابق البحث' : 'No audit records match your query'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-purple-50/30 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Actor (Who) */}
                    <td style={{ padding: '22px 36px' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black shrink-0">
                          <User size={15} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                            {log.actorName}
                          </div>
                          <span
                            className="inline-block rounded-md bg-purple-50 dark:bg-purple-950/60 font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40"
                            style={{ padding: '2px 8px', marginTop: '4px' }}
                          >
                            {log.actorRole}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Timestamp (When) */}
                    <td style={{ padding: '22px 24px', textAlign: 'center' }}>
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <Clock size={12} className="text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    {/* Action (What) */}
                    <td style={{ padding: '22px 32px' }}>
                      <div className="font-black text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                        {log.actionAr}
                      </div>
                      {log.details && (
                        <div className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">
                          {log.details}
                        </div>
                      )}
                    </td>

                    {/* Previous Value */}
                    <td style={{ padding: '22px 24px', textAlign: 'center' }}>
                      {log.previousValue ? (
                        <span
                          className="inline-block rounded-xl font-mono text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/50 shadow-2xs"
                          style={{ padding: '6px 14px' }}
                        >
                          {log.previousValue}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 font-mono text-sm">—</span>
                      )}
                    </td>

                    {/* New Value */}
                    <td style={{ padding: '22px 36px', textAlign: 'center' }}>
                      {log.newValue ? (
                        <span
                          className="inline-block rounded-xl font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-900/50 shadow-2xs"
                          style={{ padding: '6px 14px' }}
                        >
                          {log.newValue}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 font-mono text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
