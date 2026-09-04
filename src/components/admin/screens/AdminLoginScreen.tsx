'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Sun,
  Moon,
  ChevronDown,
  Check,
  School,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Crown,
  GraduationCap,
  Briefcase,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { InteractiveWaveBackground } from '@/components/ui/InteractiveWaveBackground';
import { Language } from '@/lib/translations';

export function AdminLoginScreen() {
  const { loginAdmin } = useAdmin();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { isRTL, language, setLanguage, t } = useLanguage();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLangOpen && langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen]);

  const languagesList: { code: Language; label: string; flagUrl: string }[] = [
    { code: 'ar', label: 'العربية', flagUrl: 'https://flagcdn.com/w80/sa.png' },
    { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w80/gb.png' },
    { code: 'fr', label: 'Français', flagUrl: 'https://flagcdn.com/w80/fr.png' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await loginAdmin(usernameOrEmail, password);
      if (!result.success) {
        if (result.message === 'invalid_password') {
          setErrorMessage(
            language === 'ar'
              ? 'كلمة المرور غير صحيحة، يرجى إعادة المحاولة'
              : language === 'fr'
              ? 'Mot de passe incorrect, veuillez réessayer'
              : 'Incorrect password, please try again'
          );
        } else if (result.message === 'user_not_found') {
          setErrorMessage(
            language === 'ar'
              ? 'لم يتم العثور على حساب إداري مسجل بهذا المعرف'
              : language === 'fr'
              ? 'Aucun compte administrateur trouvé avec cet identifiant'
              : 'No admin account found with this username or email'
          );
        } else if (result.message === 'user_inactive') {
          setErrorMessage(
            language === 'ar'
              ? 'هذا الحساب الإداري معطل أو موقوف مؤقتاً'
              : language === 'fr'
              ? 'Ce compte administrateur est inactif ou suspendu'
              : 'This administrative account is inactive or suspended'
          );
        } else {
          setErrorMessage(
            language === 'ar'
              ? 'يرجى إدخال اسم مستخدم أو بريد إلكتروني صحيح'
              : language === 'fr'
              ? 'Veuillez saisir un identifiant valide'
              : 'Please enter a valid username or email'
          );
        }
      }
    } catch {
      setErrorMessage(
        language === 'ar'
          ? 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً'
          : language === 'fr'
          ? 'Une erreur est survenue lors de la connexion'
          : 'An error occurred while signing in, please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setUsernameOrEmail(email);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div
      className={`min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center relative overflow-x-hidden transition-colors selection:bg-purple-500 selection:text-white select-none ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: '32px 16px' }}
      suppressHydrationWarning
    >
      {/* Interactive dynamic high-density dots matrix background */}
      <InteractiveWaveBackground />

      {/* Top Controls Bar: Language + Dark Mode + Back Link */}
      <div
        className={`absolute top-6 ${
          isRTL ? 'left-6 sm:left-8' : 'right-6 sm:right-8'
        } z-20 flex items-center gap-2.5`}
      >
        {/* Language Switcher */}
        <div ref={langRef} className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-all shadow-2xs whitespace-nowrap"
            style={{
              height: '44px',
              paddingLeft: '18px',
              paddingRight: '18px',
              gap: '10px',
            }}
          >
            <img
              src={currentLangObj.flagUrl}
              alt={currentLangObj.label}
              className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full object-cover shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700"
            />
            <span className="font-mono uppercase font-black text-xs text-slate-800 dark:text-slate-200 tracking-wider">
              {currentLangObj.code}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 shrink-0 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isLangOpen && (
            <div
              className={`absolute top-full mt-2 min-w-[210px] bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-fade-in-up ${
                isRTL ? 'left-0 text-right' : 'right-0 text-left'
              }`}
              style={{
                padding: '8px',
                borderRadius: '20px',
              }}
            >
              <div className="space-y-1">
                {languagesList.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                      language === item.code
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-black'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '14px',
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <img
                        src={item.flagUrl}
                        alt={item.label}
                        className="w-5 h-5 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700"
                      />
                      <span className="font-bold text-xs sm:text-sm">{item.label}</span>
                    </span>
                    {language === item.code && (
                      <Check size={16} className="stroke-[3] shrink-0 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
          title={t.toggleTheme}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>

      {/* Main Login Card Container */}
      <main className="w-full max-w-[460px] z-10 my-auto">
        <div
          className="bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl"
          style={{
            padding: '36px 32px',
            borderRadius: '32px',
          }}
        >
          {/* Brand & Greetings */}
          <div className="flex flex-col items-center justify-center text-center" style={{ marginBottom: '24px' }}>
            <div className="flex items-center justify-center gap-2 mb-3.5">
              <div className="h-12 px-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-white border border-slate-200/80 dark:border-transparent flex items-center justify-center shadow-md">
                <img src="/myschool-logo.png" alt="My School" className="h-8 w-auto object-contain" />
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-600/15 dark:bg-purple-500/25 text-purple-700 dark:text-purple-300 font-black border border-purple-500/30">
                Back Office
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'ar' ? 'لوحة التحكم والإدارة' : language === 'fr' ? 'Portail Administration' : 'Admin & Staff Portal'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1.5 max-w-xs">
              {language === 'ar'
                ? 'سجّل الدخول للوصول إلى منظومة الإدارة والمتابعة الأكاديمية'
                : language === 'fr'
                ? 'Connectez-vous pour accéder à la plateforme de gestion académique'
                : 'Sign in to access school administration and operations'}
            </p>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold p-3.5 rounded-2xl mb-5 flex items-center gap-2.5">
              <ShieldCheck size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Username or Email Input */}
            <div style={{ marginBottom: '18px' }}>
              <label
                className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                style={{ marginBottom: '8px' }}
              >
                {language === 'ar'
                  ? 'اسم المستخدم أو البريد الإلكتروني'
                  : language === 'fr'
                  ? "Nom d'utilisateur ou Email"
                  : 'Username or Email Address'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'superadmin أو superadmin@myschool.edu'
                      : 'superadmin or superadmin@myschool.edu'
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
                  style={{
                    height: '48px',
                    borderRadius: '16px',
                    paddingLeft: isRTL ? '16px' : '48px',
                    paddingRight: isRTL ? '48px' : '16px',
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                />
                <div
                  className="absolute pointer-events-none text-slate-400 flex items-center justify-center"
                  style={{
                    left: isRTL ? 'auto' : '16px',
                    right: isRTL ? '16px' : 'auto',
                    width: '20px',
                    height: '20px',
                  }}
                >
                  <Mail size={18} />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '16px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {language === 'ar' ? 'كلمة المرور' : language === 'fr' ? 'Mot de Passe' : 'Password'}
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {language === 'ar' ? 'الافتراضي: admin123' : 'Default: admin123'}
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
                  style={{
                    height: '48px',
                    borderRadius: '16px',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                />
                <div
                  className="absolute pointer-events-none text-slate-400 flex items-center justify-center"
                  style={{
                    left: isRTL ? 'auto' : '16px',
                    right: isRTL ? '16px' : 'auto',
                    width: '20px',
                    height: '20px',
                  }}
                >
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  style={{
                    right: isRTL ? 'auto' : '14px',
                    left: isRTL ? '14px' : 'auto',
                    width: '28px',
                    height: '28px',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between" style={{ marginTop: '10px', marginBottom: '20px' }}>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {language === 'ar' ? 'تذكر بيانات الجلسة' : language === 'fr' ? 'Se souvenir de moi' : 'Keep me signed in'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 hover:opacity-95 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #6366f1 100%)',
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
                    <span>{language === 'ar' ? 'تسجيل الدخول للوحة التحكم' : language === 'fr' ? 'Connexion au Back Office' : 'Sign In to Back Office'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials / Role Presets */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <KeyRound size={13} className="text-purple-500 shrink-0" />
              <span>{language === 'ar' ? 'حسابات تجريبية سريعة للتجربة:' : 'Quick Demo Accounts:'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('superadmin@myschool.edu', 'admin123')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all text-center group cursor-pointer"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Crown size={14} />
                </div>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate">
                  {language === 'ar' ? 'مدير عام' : 'Super Admin'}
                </div>
                <div className="text-[9px] text-slate-400 font-medium truncate">
                  superadmin
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admissions@myschool.edu', 'admin123')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all text-center group cursor-pointer"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Briefcase size={14} />
                </div>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate">
                  {language === 'ar' ? 'إدارة التسجيل' : 'Admin'}
                </div>
                <div className="text-[9px] text-slate-400 font-medium truncate">
                  nadine.admin
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('sarah.benali@myschool.edu', 'admin123')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all text-center group cursor-pointer"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <GraduationCap size={14} />
                </div>
                <div className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate">
                  {language === 'ar' ? 'أستاذ' : 'Teacher'}
                </div>
                <div className="text-[9px] text-slate-400 font-medium truncate">
                  sarah.teacher
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link to Parent Portal */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
          >
            <School size={15} className="text-purple-500" />
            <span>
              {language === 'ar'
                ? 'الانتقال إلى بوابة أولياء الأمور'
                : language === 'fr'
                ? 'Accéder au Portail Parents'
                : 'Go to Parent Portal'}
            </span>
            {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
          </Link>
        </div>
      </main>
    </div>
  );
}
