'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Trash2,
  Camera,
} from 'lucide-react';
import { downloadCertificateHTML } from '@/lib/certificateGenerator';

const SETTINGS_STORAGE_KEY = 'myschool_system_settings';

export function SystemSettingsScreen() {
  const [academyName, setAcademyName] = useState('My School');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [academyAddress, setAcademyAddress] = useState('Errimal Street, El Oued, Algeria.');
  const [academyPhone, setAcademyPhone] = useState('+213 770 299 292 \\ +213 770 958 887');
  const [saveToast, setSaveToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.academyName) setAcademyName(parsed.academyName);
        if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
        if (parsed.logoFileName) setLogoFileName(parsed.logoFileName);
        if (parsed.academyAddress) setAcademyAddress(parsed.academyAddress);
        if (parsed.academyPhone) setAcademyPhone(parsed.academyPhone);
      }
    } catch (e) {
      console.error('Failed to load system settings from localStorage', e);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setLogoFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        academyName: academyName.trim() || 'My School',
        logoUrl: logoUrl,
        logoFileName: logoFileName,
        academyAddress: academyAddress.trim(),
        academyPhone: academyPhone.trim(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Persist to localStorage
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));

      // 2. Dispatch custom event across application
      window.dispatchEvent(
        new CustomEvent('myschool_settings_updated', { detail: payload })
      );
    } catch (e) {
      console.error('Failed to save system settings to localStorage', e);
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
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
              <h3 className="font-black text-lg text-slate-900 dark:text-white">بيانات الأكاديمية والشعار الرسمي</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">رفع شعار المدرسة وتحديث المعلومات الأساسية وعنوان المدرسة</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Logo Upload Field */}
            <div>
              <label
                className="block text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300"
                style={{ marginBottom: '12px' }}
              >
                شعار المدرسة الرسمي (School / Academy Logo):
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-750">
                {/* Logo Preview Box */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-850 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative group">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Academy Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <School size={32} className="mx-auto text-rose-500/80" />
                      <span className="text-[10px] font-black text-slate-400 block mt-1">My School</span>
                    </div>
                  )}
                </div>

                {/* Upload Actions & Hints */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      style={{ padding: '10px 20px' }}
                    >
                      <Upload size={15} />
                      <span>{logoUrl ? 'تغيير الشعار (Change Logo)' : 'رفع شعار المدرسة (Upload Logo)'}</span>
                    </button>

                    {logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        style={{ padding: '10px 18px' }}
                      >
                        <Trash2 size={15} />
                        <span>إزالة الشعار</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-medium">
                    {logoFileName ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">الملف المحدد: {logoFileName}</span>
                    ) : (
                      'يدعم صيغ PNG, JPG, WebP أو SVG (يُفضل الشعار بخلفية شفافة بدقة عالية ليظهر بشكل رائع في ترويسة الموقع والشهادات).'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Academy Name Input */}
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
                placeholder="My School"
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
