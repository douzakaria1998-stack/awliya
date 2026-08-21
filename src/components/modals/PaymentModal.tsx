'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Lock, Check } from 'lucide-react';
import { Fee } from '@/types';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';

interface PaymentModalProps {
  fee: Fee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ fee, isOpen, onClose }: PaymentModalProps) {
  const { payFee, activeStudent } = useStudent();
  const { theme } = useTheme();

  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'apple_pay' | 'card' | 'stc_pay'>('mada');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !fee) return null;

  const paymentMethods = [
    { id: 'mada', labelAr: 'مدى (Mada)', icon: '💳', subtitleAr: 'بطاقة الخصم المباشر' },
    { id: 'apple_pay', labelAr: 'Apple Pay', icon: '', subtitleAr: 'دفع سريع وآمن' },
    { id: 'card', labelAr: 'بطاقة ائتمانية', icon: '💳', subtitleAr: 'Visa / Mastercard' },
    { id: 'stc_pay', labelAr: 'STC Pay', icon: '📱', subtitleAr: 'المحفظة الرقمية' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const methodName =
        paymentMethod === 'mada'
          ? 'مدى (Mada)'
          : paymentMethod === 'apple_pay'
          ? 'Apple Pay'
          : paymentMethod === 'stc_pay'
          ? 'STC Pay'
          : 'بطاقة فيزا الائتمانية';

      payFee(fee.id, methodName);
      setIsProcessing(false);
      setIsCompleted(true);

      setTimeout(() => {
        setIsCompleted(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
        {/* Modal Header */}
        <div
          className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
          style={{ padding: '24px 30px' }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-xs shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <CreditCard size={22} />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                سداد الرسوم الدراسية
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                بوابة الدفع الإلكتروني الآمنة المعتمدة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {isCompleted ? (
          <div className="py-16 px-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-5 shadow-lg animate-bounce">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              تم السداد بنجاح!
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-[320px] leading-relaxed font-medium">
              تم تسجيل عملية الدفع وتحديث الرصيد، وإرسال الإيصال الإلكتروني إلى بريدك المسجل.
            </p>
          </div>
        ) : (
          <div
            className="space-y-5 max-h-[80vh] overflow-y-auto text-right"
            style={{ padding: '28px 32px' }}
          >
            {/* Invoice Summary Card */}
            <div
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 space-y-3"
              style={{
                padding: '20px 24px',
                borderRadius: '20px',
              }}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-bold">
                  الطالب المستفيد:
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {activeStudent.fullNameAr}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-bold">
                  البند المطلوب سداده:
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {fee.descriptionAr}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-bold">
                  رقم الفاتورة:
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {fee.invoiceNumber || 'INV-2025-0482'}
                </span>
              </div>

              <div
                className="border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
                style={{
                  paddingTop: '14px',
                  marginTop: '14px',
                }}
              >
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  المبلغ الإجمالي المستحق:
                </span>
                <span
                  className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                  style={{ color: theme.primary }}
                >
                  {fee.amount} {fee.currency}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-800 dark:text-slate-200">
                اختر وسيلة الدفع:
              </label>

              <div className="grid grid-cols-2 gap-3.5">
                {paymentMethods.map((m) => {
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`text-right transition-all flex flex-col justify-between cursor-pointer select-none ${
                        isSelected
                          ? 'bg-slate-50 dark:bg-slate-800/90 ring-2 shadow-xs'
                          : 'bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-700/70 hover:border-slate-300'
                      }`}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '20px',
                        minHeight: '85px',
                        borderColor: isSelected ? theme.primary : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{m.icon}</span>
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-2xs"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          {m.labelAr}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{m.subtitleAr}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div
              className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-400 font-medium"
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
              }}
            >
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <span>جميع المعاملات مشفرة ومحمية وفق أعلى معايير الأمان المصرفي.</span>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full font-black text-sm sm:text-base text-white shadow-xl flex items-center justify-center gap-2.5 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: theme.primary,
                  height: '52px',
                  borderRadius: '18px',
                }}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري معالجة الدفع الآمن...</span>
                  </div>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>سداد {fee.amount} {fee.currency} الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
