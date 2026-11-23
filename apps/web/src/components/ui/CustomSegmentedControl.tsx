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
      {label && <label className="block text-xs font-medium text-zinc-300">{label}</label>}
      <div className="flex p-1 rounded-lg bg-[#141418] border border-zinc-800 gap-1">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              {option.icon && <span className="flex-shrink-0 text-current">{option.icon}</span>}
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
