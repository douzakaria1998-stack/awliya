'use client';

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  MessageCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { InteractiveWaveBackground } from '../ui/InteractiveWaveBackground';

export function LoginScreen() {
  const { login } = useAuth();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { isRTL } = useLanguage();

  const [emailOrPhone, setEmailOrPhone] = useState('ahmed.douzkari@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const success = await login(emailOrPhone, password);
      if (!success) {
        setErrorMessage('يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح');
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center relative overflow-x-hidden transition-colors selection:bg-rose-500 selection:text-white select-none text-right"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: '32px 16px' }}
      suppressHydrationWarning
    >
      {/* Interactive mouse-following fluid wave background */}
      <InteractiveWaveBackground />

      {/* Ambient background glowing orbs */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />

      {/* Dark Mode Toggle - Top Corner */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
          title={isDarkMode ? 'الوضع النهاري' : 'الوضع الداكن'}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>

      {/* Main Login Card Container */}
      <main className="w-full max-w-[440px] z-10">
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-xl"
          style={{
            padding: '36px 32px',
            borderRadius: '32px',
          }}
        >
          {/* Brand & Greetings */}
          <div className="flex flex-col items-center justify-center text-center" style={{ marginBottom: '28px' }}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md mb-3.5 shrink-0"
              style={{ background: theme.gradient }}
            >
              و
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1.5 max-w-xs">
              مرحباً بك مجدداً! أدخل بياناتك للمتابعة الأكاديمية والتربوية
            </p>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <div
              className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold p-3.5 rounded-2xl mb-5 flex items-center gap-2.5"
            >
              <ShieldCheck size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email or Phone Input */}
            <div style={{ marginBottom: '18px' }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block" style={{ marginBottom: '8px' }}>
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@example.com أو 0550123456"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                  style={{
                    paddingRight: '46px',
                    paddingLeft: '16px',
                    height: '48px',
                    borderRadius: '16px',
                    textAlign: 'right',
                  }}
                />
                <Mail
                  size={18}
                  className="absolute text-slate-400 pointer-events-none"
                  style={{ right: '16px' }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '16px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  كلمة المرور
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('يرجى التواصل مع إدارة الحلقات لإعادة تعيين كلمة المرور');
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                  style={{
                    paddingRight: '46px',
                    paddingLeft: '46px',
                    height: '48px',
                    borderRadius: '16px',
                    textAlign: 'right',
                  }}
                />
                <Lock
                  size={18}
                  className="absolute text-slate-400 pointer-events-none"
                  style={{ right: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  style={{ left: '16px' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between" style={{ marginTop: '10px', marginBottom: '22px' }}>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-0 cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  تذكر بيانات الدخول
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:opacity-95 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                style={{
                  background: theme.gradient,
                  padding: '14px 24px',
                  borderRadius: '16px',
                  minHeight: '48px',
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} className="shrink-0" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Support Link directly below card */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <MessageCircle size={15} className="text-emerald-500" />
            <span>هل تواجه مشكلة في تسجيل الدخول؟ تواصل مع إدارة الحلقات</span>
          </a>
        </div>
      </main>
    </div>
  );
}
