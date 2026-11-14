'use client';

import React from 'react';

export interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  className = '',
}) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between p-3 rounded-[8px] bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333] hover:border-[#c7c7c7] dark:hover:border-[#444] transition-all cursor-pointer select-none group ${className}`}
    >
      <div className="space-y-0.5 pr-3 min-w-0">
        <span className="text-xs font-medium text-[#171717] dark:text-[#ededed] group-hover:text-black dark:group-hover:text-white block truncate">
          {label}
        </span>
        {description && (
          <span className="text-[11px] text-[#707070] dark:text-[#a1a1aa] block leading-tight">
            {description}
          </span>
        )}
      </div>

      {/* Switch Track */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3ecf8e] focus:ring-offset-1 ${
          checked ? 'bg-[#3ecf8e]' : 'bg-[#dfdfdf] dark:bg-[#333]'
        }`}
      >
        {/* Switch Thumb */}
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
