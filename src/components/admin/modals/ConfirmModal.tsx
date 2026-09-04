'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: 'trash' | 'edit' | 'alert' | 'check';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  icon,
  isLoading = false,
}: ConfirmModalProps) {
  const { isRTL, language } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const defaultConfirmText =
    confirmText ||
    (variant === 'danger'
      ? language === 'ar'
        ? 'تأكيد الحذف'
        : language === 'fr'
        ? 'Confirmer la suppression'
        : 'Confirm Delete'
      : language === 'ar'
      ? 'تأكيد التعديل'
      : language === 'fr'
      ? 'Confirmer les modifications'
      : 'Confirm Changes');

  const defaultCancelText =
    cancelText || (language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel');

  // Dynamic Theme Colors
  const themeConfig = {
    danger: {
      bgIcon: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60',
      btnConfirm: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
      defaultIcon: <Trash2 size={24} />,
    },
    warning: {
      bgIcon: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60',
      btnConfirm: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
      defaultIcon: <AlertTriangle size={24} />,
    },
    primary: {
      bgIcon: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/60',
      btnConfirm: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20',
      defaultIcon: <Edit3 size={24} />,
    },
  };

  const selectedTheme = themeConfig[variant];

  const renderIcon = () => {
    if (icon === 'trash') return <Trash2 size={24} />;
    if (icon === 'edit') return <Edit3 size={24} />;
    if (icon === 'alert') return <AlertTriangle size={24} />;
    if (icon === 'check') return <CheckCircle2 size={24} />;
    return selectedTheme.defaultIcon;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        style={{ padding: '24px 28px' }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 ltr:right-5 rtl:left-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Action Icon Badge */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-xs ${selectedTheme.bgIcon}`}>
            {renderIcon()}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
            {title}
          </h3>

          {/* Message Description */}
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs sm:max-w-sm mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="w-full flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {defaultCancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
              }}
              disabled={isLoading}
              className={`flex-1 h-11 font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${selectedTheme.btnConfirm}`}
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{defaultConfirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
