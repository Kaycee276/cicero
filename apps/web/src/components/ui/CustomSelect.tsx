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
      {label && (
        <label className="block text-xs font-medium text-[#171717] dark:text-[#ededed]">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333] hover:border-[#c7c7c7] dark:hover:border-[#444] text-xs text-[#171717] dark:text-[#ededed] shadow-sm transition-all focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e]"
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
            className={`w-4 h-4 text-[#707070] dark:text-[#a1a1aa] transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute z-50 mt-1.5 w-full rounded-[8px] bg-white dark:bg-[#181818] border border-[#dfdfdf] dark:border-[#2b2b2b] shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto"
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
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-white font-semibold'
                      : 'text-[#707070] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-[#222] hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {option.indicatorColor && (
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.indicatorColor }}
                      />
                    )}
                    <div className="truncate">
                      <div className="truncate font-medium text-[#171717] dark:text-[#ededed]">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-[10px] text-[#9a9a9a] dark:text-[#707070] truncate font-normal">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {option.badge && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#ededed] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a1a1aa]">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#24b47e] dark:text-[#3ecf8e]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
