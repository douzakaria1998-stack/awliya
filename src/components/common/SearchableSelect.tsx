'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface SearchableSelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  themeColor?: 'purple' | 'emerald' | 'indigo' | 'amber' | 'blue';
  dir?: 'rtl' | 'ltr' | 'auto';
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'ابحث هنا...',
  searchPlaceholder = 'ابحث هنا...',
  emptyText = 'لا توجد نتائج مطابقة',
  disabled = false,
  className = '',
  themeColor = 'indigo',
  dir = 'auto',
}) => {
  const { isRTL } = useLanguage();
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedOption?.label || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal input value when selectedOption changes externally
  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else {
      setInputValue('');
    }
  }, [selectedOption]);

  // Color theme
  const colorMap = {
    purple: {
      ring: 'focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500',
      activeItem: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold',
      check: 'text-purple-600 dark:text-purple-400',
      icon: 'text-purple-500',
    },
    emerald: {
      ring: 'focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
      activeItem: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold',
      check: 'text-emerald-600 dark:text-emerald-400',
      icon: 'text-emerald-500',
    },
    indigo: {
      ring: 'focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
      activeItem: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold',
      check: 'text-indigo-600 dark:text-indigo-400',
      icon: 'text-indigo-500',
    },
    amber: {
      ring: 'focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500',
      activeItem: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold',
      check: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-500',
    },
    blue: {
      ring: 'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
      activeItem: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold',
      check: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500',
    },
  };

  const currentTheme = colorMap[themeColor] || colorMap.indigo;

  // Filter options based on what user types
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    const q = inputValue.toLowerCase().trim();
    return options.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(q);
      const subLabelMatch = opt.subLabel ? opt.subLabel.toLowerCase().includes(q) : false;
      return labelMatch || subLabelMatch;
    });
  }, [options, inputValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // If input does not match selectedOption, restore selectedOption label
        if (selectedOption) {
          setInputValue(selectedOption.label);
        } else if (options.length > 0 && !value) {
          // keep input
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedOption, options, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (opt: SearchableSelectOption) => {
    onChange(opt.value);
    setInputValue(opt.label);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" ref={containerRef} dir={dir}>
      {/* Real Search Bar Input */}
      <div className="relative w-full flex items-center">
        {/* Search Icon */}
        <div
          className={`absolute ${
            isRTL ? 'right-3.5' : 'left-3.5'
          } flex items-center pointer-events-none text-slate-400 dark:text-slate-500 z-10`}
        >
          <Search size={16} className={isOpen ? currentTheme.icon : ''} />
        </div>

        <input
          ref={inputRef}
          type="text"
          dir="auto"
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
          }}
          placeholder={searchPlaceholder || placeholder}
          style={{
            paddingRight: isRTL ? '44px' : '40px',
            paddingLeft: isRTL ? '40px' : '44px',
          }}
          className={`w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal transition-all ${currentTheme.ring} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute ${
              isRTL ? 'left-3' : 'right-3'
            } w-5 h-5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer z-10`}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Floating Autocomplete Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevents blur before click
                      handleSelect(opt);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-right flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? currentTheme.activeItem
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex flex-col text-right truncate">
                      <span className="font-bold truncate">{opt.label}</span>
                      {opt.subLabel && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {opt.subLabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check size={15} className={`shrink-0 ${currentTheme.check}`} />}
                  </button>
                );
              })
            ) : (
              <div className="py-5 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                {emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
