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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Academy Profile */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <School size={20} className="text-rose-500" />
            <h3 className="font-black text-base text-slate-900 dark:text-white">بيانات الأكاديمية الرسمية</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم الأكاديمية (Brand Name):
              </label>
              <input
                type="text"
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                العنوان الرسمي (يظهر في أسفل الشهادة):
              </label>
              <input
                type="text"
                value={academyAddress}
                onChange={(e) => setAcademyAddress(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                أرقام الهواتف الرسمية:
              </label>
              <input
                type="text"
                value={academyPhone}
                onChange={(e) => setAcademyPhone(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Certificate Design Preview & Actions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <Award size={20} className="text-amber-500" />
              <h3 className="font-black text-base text-slate-900 dark:text-white">نموذج الشهادات المعتمد (Certificate Template)</h3>
            </div>

            <button
              type="button"
              onClick={handleTestCertificate}
              className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>تنزيل شهادة تجريبية (My School)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>المعايير المدمجة:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
              <li>الإطار الهندسي الملون (Guilloche & Geometric Frame) A4 Landscape.</li>
              <li>شعار My School الرسمي مع شارة الإنجاز وتوقيع الإدارة الأكاديمية.</li>
              <li>الترميز اللغوي الدولي CEFR (A1.1 حتى C2).</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </form>
    </div>
  );
}
