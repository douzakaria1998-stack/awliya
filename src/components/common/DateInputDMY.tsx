'use client';

import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';

export function formatDateDMY(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (y && m && d) {
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

interface DateInputDMYProps {
  value: string; // ISO date 'YYYY-MM-DD'
  onChange: (value: string) => void;
  className?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

export function DateInputDMY({
  value,
  onChange,
  className = '',
  min,
  max,
  disabled,
}: DateInputDMYProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const displayValue = formatDateDMY(value);

  const handleContainerClick = () => {
    if (disabled) return;
    try {
      if (hiddenInputRef.current && 'showPicker' in hiddenInputRef.current) {
        hiddenInputRef.current.showPicker();
      } else {
        hiddenInputRef.current?.focus();
        hiddenInputRef.current?.click();
      }
    } catch {
      hiddenInputRef.current?.focus();
      hiddenInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative flex items-center justify-between cursor-pointer select-none transition-all ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleContainerClick();
        }
      }}
    >
      <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider" dir="ltr">
        {displayValue || 'DD/MM/YYYY'}
      </span>
      <Calendar size={15} className="text-amber-500 shrink-0 opacity-80" />

      {/* Hidden native date input that triggers native picker while enforcing DD/MM/YYYY display */}
      <input
        ref={hiddenInputRef}
        type="date"
        value={value || ''}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
