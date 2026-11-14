'use client';

import React from 'react';

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  label?: string;
  className?: string;
}

export const CustomSegmentedControl: React.FC<CustomSegmentedControlProps> = ({
  value,
  onChange,
  options,
  label,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-[#171717] dark:text-[#ededed]">
          {label}
        </label>
      )}
      <div className="flex p-0.5 rounded-[8px] bg-[#ededed] dark:bg-[#262626] border border-[#dfdfdf] dark:border-[#333] gap-0.5">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-[6px] text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-white font-semibold shadow-sm'
                  : 'text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] hover:dark:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              {option.icon && (
                <span className="flex-shrink-0 text-current">{option.icon}</span>
              )}
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
