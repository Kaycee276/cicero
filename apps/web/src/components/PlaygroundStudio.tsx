'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Sliders,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Palette,
} from 'lucide-react';
import {
  CiceroConnectButton,
  ZucchiniWalletAdapter,
} from '@cicero-zcash/react';
import {
  useStudioSettings,
  DESIGN_PRESETS,
  ButtonVariant,
  ButtonSize,
  ButtonRadius,
} from '@/context/StudioSettingsContext';
import { CustomSelect, SelectOption } from './ui/CustomSelect';
import { CustomSwitch } from './ui/CustomSwitch';
import { CustomSegmentedControl } from './ui/CustomSegmentedControl';

export const PlaygroundStudio: React.FC = () => {
  const {
    variant,
    setVariant,
    size,
    setSize,
    radius,
    setRadius,
    label,
    setLabel,
    showBalance,
    setShowBalance,
    showNetwork,
    setShowNetwork,
    showIcon,
    setShowIcon,
    activePreset,
    applyPreset,
  } = useStudioSettings();

  const [copiedCode, setCopiedCode] = useState(false);
  const [zucchiniDetected, setZucchiniDetected] = useState(false);

  React.useEffect(() => {
    setZucchiniDetected(ZucchiniWalletAdapter.isAvailable());
  }, []);

  const variantOptions: SelectOption[] = [
    {
      value: 'primary',
      label: 'Primary Emerald',
      description: 'Signature Supabase #3ecf8e emerald CTA',
      indicatorColor: '#3ecf8e',
      badge: 'Default',
    },
    {
      value: 'outline',
      label: 'Minimalist Outline',
      description: 'Clean monochrome border on canvas',
      indicatorColor: '#dfdfdf',
    },
    {
      value: 'dark',
      label: 'Midnight Dark',
      description: 'Canvas night #1c1c1c with subtle border',
      indicatorColor: '#1c1c1c',
    },
    {
      value: 'gradient',
      label: 'Cyber Metallic Gradient',
      description: 'Dark tech gradient with emerald rim accent',
      indicatorColor: '#10b981',
      badge: 'New',
    },
    {
      value: 'gold',
      label: 'Zcash Amber Gold',
      description: 'Official Zcash warm gold brand gradient',
      indicatorColor: '#f59e0b',
    },
    {
      value: 'ghost',
      label: 'Subtle Ghost Flat',
      description: 'Borderless transparent trigger with hover fill',
      indicatorColor: '#707070',
    },
  ];

  const sizeOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  const radiusOptions = [
    { value: 'none', label: 'Sharp' },
    { value: 'sm', label: '4px' },
    { value: 'md', label: '6px' },
    { value: 'lg', label: '12px' },
    { value: 'full', label: 'Pill' },
  ];

  const generatedCode = `import { CiceroProvider, CiceroConnectButton, useAccount, useBalance } from '@cicero-zcash/react';

export default function App() {
  return (
    <CiceroProvider initialNetwork="mainnet" appName="My Zcash dApp">
      <nav className="flex justify-between items-center p-4 border-b">
        <span className="font-semibold">My Zcash dApp</span>
        <CiceroConnectButton
          variant="${variant}"
          size="${size}"
          radius="${radius}"
          label="${label}"
          showBalance={${showBalance}}
          showNetwork={${showNetwork}}
          showIcon={${showIcon}}
        />
      </nav>
      <MainDashboard />
    </CiceroProvider>
  );
}

function MainDashboard() {
  const { address, isConnected, wallet } = useAccount();
  const { zec, usd } = useBalance();

  return (
    <div className="p-6">
      {isConnected ? (
        <div>
          <h3>Connected to {wallet?.name}</h3>
          <p>Address: {address}</p>
          <p>Balance: {zec} ZEC (~\${usd} USD)</p>
        </div>
      ) : (
        <p>Please connect your Zcash wallet above.</p>
      )}
    </div>
  );
}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section id="playground" className="py-16 sm:py-20 bg-white dark:bg-[#121212] border-b border-[#ededed] dark:border-[#262626] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#24b47e] dark:text-[#3ecf8e] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Design Studio</span>
          </div>
          <h2 className="display-lg text-[#171717] dark:text-white tracking-tight">
            Wallet Connection Studio
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
            Customize the button style, border geometry, typography, and badges in real-time. Live changes instantly reflect across both the workbench and the header navigation bar above.
          </p>
        </div>

        {/* 1-Click Design Presets Bar */}
        <div className="mt-7 sm:mt-8 p-3 sm:p-4 rounded-[12px] bg-[#fafafa] dark:bg-[#181818] border border-[#ededed] dark:border-[#262626] space-y-2.5 transition-colors duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-[#707070] dark:text-[#a1a1aa] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span>Design Presets:</span>
            </span>
            <span className="text-[11px] text-[#9a9a9a]">1-click curated themes</span>
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0">
            {Object.values(DESIGN_PRESETS).map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 rounded-[8px] text-xs font-medium transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-[#222] text-[#171717] dark:text-white shadow-sm border border-[#3ecf8e] font-semibold'
                      : 'bg-white/60 dark:bg-[#151515] text-[#707070] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white hover:bg-white dark:hover:bg-[#1f1f1f] border border-[#dfdfdf] dark:border-[#333]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        preset.variant === 'primary'
                          ? '#3ecf8e'
                          : preset.variant === 'gold'
                          ? '#f59e0b'
                          : preset.variant === 'dark'
                          ? '#1c1c1c'
                          : preset.variant === 'gradient'
                          ? '#10b981'
                          : '#9a9a9a',
                    }}
                  />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio 2-Column Split Pane */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Heavily Customizable Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5 p-5 sm:p-6 bg-[#fafafa] dark:bg-[#181818] rounded-[12px] border border-[#ededed] dark:border-[#262626] transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#ededed] dark:border-[#262626]">
              <span className="text-sm font-medium text-[#171717] dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3ecf8e]" />
                <span>Component Styling</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#24b47e] dark:text-[#3ecf8e] border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24b47e] dark:bg-[#3ecf8e] animate-pulse"></span>
                <span>Syncs with Header</span>
              </span>
            </div>

            {/* Custom Variant Dropdown */}
            <CustomSelect
              label="Visual Style Variant"
              value={variant}
              onChange={(val) => setVariant(val as ButtonVariant)}
              options={variantOptions}
            />

            {/* Custom Size Segmented Control */}
            <CustomSegmentedControl
              label="Button Size"
              value={size}
              onChange={(val) => setSize(val as ButtonSize)}
              options={sizeOptions}
            />

            {/* Custom Radius Segmented Control */}
            <CustomSegmentedControl
              label="Corner Radius (Geometry)"
              value={radius}
              onChange={(val) => setRadius(val as ButtonRadius)}
              options={radiusOptions}
            />

            {/* Custom Button Label Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-[#171717] dark:text-[#ededed]">Button Label</label>
                <button
                  type="button"
                  onClick={() => setLabel('Connect Zcash Wallet')}
                  className="text-[11px] text-[#24b47e] dark:text-[#3ecf8e] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Connect Shielded Wallet"
                className="w-full px-3.5 py-2.5 rounded-[6px] bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333] hover:border-[#c7c7c7] dark:hover:border-[#444] text-xs text-[#171717] dark:text-[#ededed] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] shadow-sm transition-all"
              />
            </div>

            {/* Custom Feature Switches (zero native checkboxes) */}
            <div className="pt-2 border-t border-[#ededed] dark:border-[#262626] space-y-2.5">
              <span className="text-xs font-semibold uppercase font-mono tracking-wider text-[#707070] dark:text-[#a1a1aa] block">
                Connected Pill & Icon Toggles
              </span>

              <CustomSwitch
                checked={showBalance}
                onChange={setShowBalance}
                label="Display Shielded Balance"
                description="Shows real-time ZEC balance in connected state"
              />

              <CustomSwitch
                checked={showNetwork}
                onChange={setShowNetwork}
                label="Display Network Indicator"
                description="Shows active Mainnet / Testnet status dot"
              />

              <CustomSwitch
                checked={showIcon}
                onChange={setShowIcon}
                label="Display zk-Shield Icon"
                description="Renders privacy shield glyph alongside trigger text"
              />
            </div>
          </div>

          {/* Right Column: Live Interactive Preview & Generated Code (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Component Preview Box */}
            <div className="p-5 sm:p-6 bg-white dark:bg-[#181818] rounded-[12px] border border-[#ededed] dark:border-[#262626] shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ededed] dark:border-[#262626]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]"></div>
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#171717] dark:text-white">
                    Live Interactive Preview
                  </span>
                </div>
                <span className="text-xs text-[#707070] dark:text-[#a1a1aa]">
                  Click button to launch modal
                </span>
              </div>

              {/* Zucchini Extension Status Banner */}
              {zucchiniDetected ? (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-[8px] border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥒</span>
                    <div>
                      <span className="font-semibold">Zucchini Extension Ready</span>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300">In-browser zero-knowledge signing active.</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100">
                    Detected
                  </span>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-[#fafafa] dark:bg-[#151515] rounded-[8px] border border-[#ededed] dark:border-[#262626] text-xs text-[#707070] dark:text-[#a1a1aa] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥒</span>
                    <div>
                      <span className="font-medium text-[#171717] dark:text-[#ededed]">Zucchini Browser Wallet</span>
                      <p className="text-[11px] text-[#9a9a9a]">Install extension to enable 1-click in-browser approval.</p>
                    </div>
                  </div>
                  <a
                    href="https://chromewebstore.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-[#24b47e] dark:text-[#3ecf8e] hover:underline flex items-center gap-1"
                  >
                    <span>Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Component Rendering Canvas */}
              <div className="min-h-[170px] flex flex-col items-center justify-center p-6 sm:p-8 bg-[#fafafa] dark:bg-[#121212] rounded-[8px] border border-dashed border-[#dfdfdf] dark:border-[#2b2b2b] space-y-4 transition-colors duration-200">
                <div className="max-w-full overflow-x-auto py-1">
                  <CiceroConnectButton
                    variant={variant}
                    size={size}
                    radius={radius}
                    label={label}
                    showBalance={showBalance}
                    showNetwork={showNetwork}
                    showIcon={showIcon}
                  />
                </div>

                {/* Style Specs Badges */}
                <div className="flex items-center gap-2 flex-wrap justify-center text-[11px] font-mono text-[#707070] dark:text-[#a1a1aa]">
                  <span className="px-2 py-0.5 bg-white dark:bg-[#1a1a1a] rounded border border-[#dfdfdf] dark:border-[#333]">
                    variant: {variant}
                  </span>
                  <span className="px-2 py-0.5 bg-white dark:bg-[#1a1a1a] rounded border border-[#dfdfdf] dark:border-[#333]">
                    size: {size}
                  </span>
                  <span className="px-2 py-0.5 bg-white dark:bg-[#1a1a1a] rounded border border-[#dfdfdf] dark:border-[#333]">
                    radius: {radius}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Code Snippet */}
            <div className="p-5 sm:p-6 bg-[#1c1c1c] dark:bg-[#181818] rounded-[12px] border border-[#2b2b2b] dark:border-[#333] text-white shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2b2b2b] dark:border-[#333]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#3ecf8e]">
                  <Code className="w-4 h-4" />
                  <span>Generated React Code</span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#2b2b2b] dark:bg-[#252525] hover:bg-[#383838] dark:hover:bg-[#333] text-xs text-white transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3ecf8e]" />
                      <span className="text-[#3ecf8e]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9a9a9a]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-[#ededed] overflow-x-auto leading-relaxed p-2">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
