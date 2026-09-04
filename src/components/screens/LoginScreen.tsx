'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Check,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { InteractiveWaveBackground } from '../ui/InteractiveWaveBackground';
import { Language } from '@/lib/translations';

export function LoginScreen() {
  const { login } = useAuth();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { isRTL, language, setLanguage, t } = useLanguage();

  const [emailOrPhone, setEmailOrPhone] = useState('');
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
      const result = await login(emailOrPhone, password);
      if (!result.success) {
        if (result.message === 'invalid_password') {
          setErrorMessage(
            language === 'ar'
              ? 'كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة'
              : language === 'fr'
              ? 'Mot de passe incorrect, veuillez réessayer'
              : 'Incorrect password, please try again'
          );
        } else if (result.message === 'parent_not_found') {
          setErrorMessage(
            language === 'ar'
              ? 'لم يتم العثور على حساب مسجل بهذا البريد أو الهاتف'
              : language === 'fr'
              ? 'Aucun compte parent trouvé avec cet email ou téléphone'
              : 'No parent account found with this email or phone number'
          );
        } else {
          setErrorMessage(
            language === 'ar'
              ? 'يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح'
              : language === 'fr'
              ? 'Veuillez entrer une adresse email ou un numéro valide'
              : 'Please enter a valid email address or phone number'
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

  return (
    <div
      className={`min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center relative overflow-x-hidden transition-colors selection:bg-rose-500 selection:text-white select-none ${
        isRTL ? 'text-right' : 'text-left'
      }`}
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

      {/* Top Controls Bar: Language + Dark Mode */}
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
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black'
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
                      <Check size={16} className="stroke-[3] shrink-0 text-rose-600 dark:text-rose-400" />
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
      <main className="w-full max-w-[450px] z-10">
        <div
          className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl"
          style={{
            padding: '36px 32px',
            borderRadius: '32px',
          }}
        >
          {/* Brand & Greetings */}
          <div className="flex flex-col items-center justify-center text-center" style={{ marginBottom: '24px' }}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md mb-3.5 shrink-0"
              style={{ background: theme.gradient }}
            >
              و
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'ar' ? 'بوابة أولياء الأمور' : language === 'fr' ? 'Portail Parents' : 'Parent Portal'}
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1.5 max-w-xs">
              {language === 'ar'
                ? 'مرحباً بك! أدخل البريد الإلكتروني وكلمة المرور المسجلة في الإدارة'
                : language === 'fr'
                ? 'Bienvenue ! Connectez-vous avec vos identifiants enregistrés'
                : 'Welcome! Sign in with your registered email and password'}
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
            {/* Email or Phone Input */}
            <div style={{ marginBottom: '18px' }}>
              <label
                className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                style={{ marginBottom: '8px' }}
              >
                {language === 'ar'
                  ? 'البريد الإلكتروني أو رقم الهاتف'
                  : language === 'fr'
                  ? 'Email ou Numéro de Téléphone'
                  : 'Email Address or Phone Number'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={language === 'ar' ? 'name@example.com أو 0550123456' : 'name@example.com'}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
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
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      language === 'ar'
                        ? 'يرجى التواصل مع إدارة المدرسة أو مراجعة لوحة الإدارة Back Office لمعرفة كلمة المرور.'
                        : language === 'fr'
                        ? "Veuillez contacter l'administration de l'école pour réinitialiser votre mot de passe."
                        : 'Please contact school administration to retrieve your login password.'
                    );
                  }}
                  className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline transition-colors"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
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
            <div className="flex items-center justify-between" style={{ marginTop: '10px', marginBottom: '22px' }}>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-0 cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {language === 'ar' ? 'تذكر بيانات الدخول' : language === 'fr' ? 'Se souvenir de moi' : 'Remember Me'}
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
                    <span>{language === 'ar' ? 'تسجيل الدخول' : language === 'fr' ? 'Se Connecter' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>



        {/* Footer Support Link */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <MessageCircle size={15} className="text-emerald-500" />
            <span>
              {language === 'ar'
                ? 'هل تواجه مشكلة في تسجيل الدخول؟ تواصل مع إدارة المنصة'
                : language === 'fr'
                ? 'Problème de connexion ? Contactez le support'
                : 'Need help signing in? Contact platform support'}
            </span>
          </a>
        </div>
      </main>
    </div>
  );
}

