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
        <label className="block text-xs font-medium text-[#171717]">
          {label}
        </label>
      )}
      <div className="flex p-0.5 rounded-[8px] bg-[#ededed] border border-[#dfdfdf] gap-0.5">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-[6px] text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white text-[#171717] font-semibold shadow-sm'
                  : 'text-[#707070] hover:text-[#171717] hover:bg-white/40'
              }`}
            >
              {option.icon && (
                <span className="flex-shrink-0 text-current">{option.icon}</span>
              )}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
