'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Sliders,
  ExternalLink,
  RotateCcw,
  Palette,
  Layers,
  Terminal,
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
    accentColor,
    setAccentColor,
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
    {
      value: 'dark',
      label: 'Midnight Dark',
      description: 'Canvas night #18181b with subtle border',
      indicatorColor: '#27272a',
    },
    {
      value: 'gold',
      label: 'Zcash Amber Gold',
      description: 'Warm Zcash amber with rounded pill styling',
      indicatorColor: '#f59e0b',
    },
    {
      value: 'ghost',
      label: 'Subtle Ghost Flat',
      description: 'Borderless transparent trigger with hover fill',
      indicatorColor: '#52525b',
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
      <nav className="flex justify-between items-center p-4 border-b border-zinc-800">
        <span className="font-semibold text-white">My Zcash dApp</span>
        <CiceroConnectButton
          variant="${variant}"
          size="${size}"
          radius="${radius}"
          label={${JSON.stringify(label.trim() || 'Connect Zcash Wallet')}}
          showBalance={${showBalance}}
          showNetwork={${showNetwork}}
          showIcon={${showIcon}}
          accentColor={${JSON.stringify(accentColor)}}
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
        <div className="space-y-2">
          <h3 className="font-bold text-white">Connected to {wallet?.name}</h3>
          <p className="font-mono text-xs text-zinc-400">Address: {address}</p>
          <p className="text-emerald-400 font-mono font-bold">Balance: {zec} ZEC (~$\${usd} USD)</p>
        </div>
      ) : (
        <p className="text-zinc-500">Please connect your Zcash wallet above.</p>
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
    <section id="playground" className="py-20 bg-[#09090b] border-t border-[#1a1a1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
            <span>Interactive Design Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Wallet Connection Studio
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Customize the button style, border geometry, typography, and badges in real-time. Live changes instantly reflect across both the workbench and the header navigation bar above.
          </p>
        </div>

        {/* 1-Click Design Presets Bar */}
        <div className="mt-8 p-4 rounded-xl bg-[#0e0e12] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>Design Presets:</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-500">1-click curated themes</span>
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0">
            {Object.values(DESIGN_PRESETS).map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-[#242428] text-white font-semibold'
                      : 'bg-[#141418] text-zinc-400 hover:text-white hover:bg-zinc-800/60'
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
                          ? '#27272a'
                          : '#71717a',
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
          <div className="lg:col-span-5 space-y-5 p-6 bg-[#101013]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Component Styling</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center gap-1">
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
                <label htmlFor="studio-button-label" className="font-medium text-zinc-300">Button label</label>
                <button
                  type="button"
                  onClick={() => setLabel('Connect Zcash Wallet')}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
              <input
                type="text"
                id="studio-button-label"
                name="buttonLabel"
                maxLength={40}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Connect Shielded Wallet"
                aria-describedby="studio-label-help"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141418] border border-zinc-800 hover:border-zinc-700 text-xs text-white focus-visible:outline-none focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors font-mono"
              />
              <div id="studio-label-help" className="flex justify-between text-[11px] text-zinc-500">
                <span>Use 1–40 characters. Blank labels use the default.</span>
                <span className="font-mono tabular-nums">{label.length}/40</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-zinc-800/80 pt-4">
              <div className="space-y-1">
                <label htmlFor="studio-accent-color" className="text-xs font-medium text-zinc-200">Accent color</label>
                <p className="text-[11px] text-zinc-500">Applied to the button and its wallet dialogs.</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-[#141418] p-1.5">
                <input
                  id="studio-accent-color"
                  name="accentColor"
                  type="color"
                  value={accentColor}
                  onChange={(event) => setAccentColor(event.target.value)}
                  aria-label="Choose button accent color"
                  className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <code className="pr-1 font-mono text-[11px] text-zinc-300">{accentColor.toUpperCase()}</code>
              </div>
            </div>

            {/* Custom Feature Switches */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <span className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400 block">
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
            <div className="p-6 bg-[#101013]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-white">
                    Live Interactive Preview
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  Click button to launch modal
                </span>
              </div>

              {/* Zucchini Extension Status Banner */}
              {zucchiniDetected ? (
                <div className="mb-4 p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/60 text-xs text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3ecf8e]/10 font-mono text-xs font-semibold text-[#3ecf8e]">Z</span>
                    <div>
                      <span className="font-semibold">Zucchini Extension Ready</span>
                      <p className="text-[11px] text-emerald-300">In-browser zero-knowledge signing active.</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-800 text-emerald-100">
                    Detected
                  </span>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-[#141418] rounded-lg border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3ecf8e]/10 font-mono text-xs font-semibold text-[#3ecf8e]">Z</span>
                    <div>
                      <span className="font-medium text-zinc-200">Zucchini Browser Wallet</span>
                      <p className="text-[11px] text-zinc-500">Install extension to enable 1-click in-browser approval.</p>
                    </div>
                  </div>
                  <a
                    href="https://chromewebstore.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Component Rendering Canvas */}
              <div className="min-h-[170px] flex flex-col items-center justify-center p-8 bg-[#09090b] space-y-4">
                <div className="max-w-full overflow-x-auto py-1">
                  <CiceroConnectButton
                    variant={variant}
                    size={size}
                    radius={radius}
                    label={label}
                    showBalance={showBalance}
                    showNetwork={showNetwork}
                    showIcon={showIcon}
                    accentColor={accentColor}
                  />
                </div>

                {/* Style Specs Badges */}
                <div className="flex items-center gap-2 flex-wrap justify-center text-[11px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 bg-[#141418] rounded border border-zinc-800">
                    variant: {variant}
                  </span>
                  <span className="px-2 py-0.5 bg-[#141418] rounded border border-zinc-800">
                    size: {size}
                  </span>
                  <span className="px-2 py-0.5 bg-[#141418] rounded border border-zinc-800">
                    radius: {radius}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Code Snippet */}
            <div className="p-6 bg-[#0e0e12] rounded-2xl border border-zinc-800/80 text-white shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Terminal className="w-4 h-4" />
                  <span>Generated React Code</span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors border border-zinc-700 font-mono"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed p-2 bg-[#09090b] rounded-lg border border-zinc-800/60">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
