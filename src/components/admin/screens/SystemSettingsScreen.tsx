'use client';

import React, { useState } from 'react';
import {
  Settings,
  School,
  Award,
  Languages,
  CheckCircle2,
  Save,
  Download,
  Sparkles,
  Phone,
  MapPin,
} from 'lucide-react';
import { downloadCertificateHTML } from '@/lib/certificateGenerator';

export function SystemSettingsScreen() {
  const [academyName, setAcademyName] = useState('My School');
  const [academyAddress, setAcademyAddress] = useState('Errimal Street, El Oued, Algeria.');
  const [academyPhone, setAcademyPhone] = useState('+213 770 299 292 \\ +213 770 958 887');
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleTestCertificate = () => {
    downloadCertificateHTML(
      {
        level: 9,
        nameAr: 'المستوى التاسع: الكفاءة المتقدمة (Proficiency C1)',
        stageAr: 'المرحلة المتقدمة',
        status: 'studied',
        score: 98,
        completedDate: '2024-05-25',
        subjects: ['IELTS Advanced Speaking', 'Academic Essay Writing', 'Nuanced Debate'],
      },
      'Larbi Guemmoudi'
    );
  };

  return (
    <div className="w-full max-w-5xl select-none">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            إعدادات الأكاديمية والشهادات
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            تخصيص بيانات مدرسة My School، معايير CEFR، ونماذج الشهادات الرسمية.
          </p>
        </div>

        {saveToast && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-lg animate-in fade-in flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Card 1: Academy Profile */}
        <div
          className="rounded-[32px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          style={{
            padding: '36px 42px',
            marginBottom: '36px',
          }}
        >
          <div
            className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800"
            style={{ paddingBottom: '20px', marginBottom: '28px' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center font-black shrink-0">
              <School size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">بيانات الأكاديمية الرسمية</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">تحديث المعلومات الأساسية وعنوان المدرسة وأرقام التواصل</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            <div>
              <label
                className="block text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300"
                style={{ marginBottom: '10px' }}
              >
                اسم الأكاديمية (Brand Name):
              </label>
              <input
                type="text"
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-750 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/80 transition-all"
                style={{ padding: '14px 22px', height: '52px' }}
              />
            </div>

            <div>
              <label
                className="block text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300"
                style={{ marginBottom: '10px' }}
              >
                العنوان الرسمي (يظهر في أسفل الشهادة):
              </label>
              <input
                type="text"
                value={academyAddress}
                onChange={(e) => setAcademyAddress(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-750 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/80 transition-all"
                style={{ padding: '14px 22px', height: '52px' }}
              />
            </div>

            <div>
              <label
                className="block text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300"
                style={{ marginBottom: '10px' }}
              >
                أرقام الهواتف الرسمية:
              </label>
              <input
                type="text"
                value={academyPhone}
                onChange={(e) => setAcademyPhone(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-750 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/80 transition-all"
                style={{ padding: '14px 22px', height: '52px' }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Certificate Design Preview & Actions */}
        <div
          className="rounded-[32px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5"
          style={{
            padding: '36px 42px',
            marginBottom: '36px',
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800"
            style={{ paddingBottom: '20px', marginBottom: '24px' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center font-black shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">نموذج الشهادات المعتمد (Certificate Template)</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">معاينة وتخصيص معايير الشهادات الصادرة للطلاب</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestCertificate}
              className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap shadow-2xs hover:scale-105 active:scale-95"
              style={{ padding: '12px 24px' }}
            >
              <Download size={15} />
              <span>تنزيل شهادة تجريبية (My School)</span>
            </button>
          </div>

          <div
            className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-750 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium"
            style={{ padding: '22px 26px' }}
          >
            <div className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Sparkles size={16} className="text-amber-500" />
              <span>المعايير المدمجة في الشهادة:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
              <li>الإطار الهندسي الملون (Guilloche & Geometric Frame) بحجم A4 Landscape.</li>
              <li>شعار My School الرسمي مع شارة الإنجاز وتوقيع الإدارة الأكاديمية المعتمد.</li>
              <li>الترميز اللغوي الدولي المعياري CEFR (من المستوى A1.1 حتى C2).</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
            style={{ padding: '14px 36px' }}
          >
            <Save size={18} />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </form>
    </div>
  );
}
