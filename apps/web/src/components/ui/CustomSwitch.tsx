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
      className={`flex items-center justify-between p-3 rounded-lg bg-[#141418] border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer select-none group ${className}`}
    >
      <div className="space-y-0.5 pr-3 min-w-0">
        <span className="text-xs font-medium text-zinc-300 group-hover:text-white block truncate">
          {label}
        </span>
        {description && (
          <span className="text-[11px] text-zinc-500 block leading-tight">
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
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 focus:ring-offset-zinc-900 ${
          checked ? 'bg-emerald-500' : 'bg-zinc-700'
        }`}
      >
        {/* Switch Thumb */}
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
