'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  indicatorColor?: string;
  badge?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && <label className="block text-xs font-medium text-zinc-300">{label}</label>}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#141418] border border-zinc-800 hover:border-zinc-700 text-xs text-white shadow-sm transition-all focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <div className="flex items-center gap-2.5 truncate">
            {selectedOption?.indicatorColor && (
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedOption.indicatorColor }}
              />
            )}
            <span className="font-medium truncate">{selectedOption?.label}</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute z-50 mt-1.5 w-full rounded-xl bg-[#141418] border border-zinc-800 shadow-2xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-zinc-800/80 text-white font-medium'
                      : 'text-zinc-300 hover:bg-zinc-800/40 hover:text-white'
                  }`}
                >
                  {option.indicatorColor && (
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: option.indicatorColor }}
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{option.label}</span>
                      {option.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
