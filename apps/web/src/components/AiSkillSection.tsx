'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Code2,
  FileCode,
  Download,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
} from 'lucide-react';

interface PromptPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  prompt: string;
}

export const AiSkillSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'install'>('prompt');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('full-dapp');
  const [selectedAgentTool, setSelectedAgentTool] = useState<string>('cursor');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const promptPresets: PromptPreset[] = [
    {
      id: 'full-dapp',
      name: 'Full dApp Specialist',
      badge: 'Recommended',
      description: 'Comprehensive system prompt covering all exports, hooks, provider setup, and Zcash address formats.',
      prompt: `You are an expert full-stack developer specialized in building decentralized applications (dApps) on Zcash using @cicero-zcash/react (the universal wallet connection kit for shielded Zcash).

Context & Rules:
1. Always use '@cicero-zcash/react' for all wallet connection, address management, shielded balances, and payment dispatch.
2. Setup requires wrapping client components with <CiceroProvider initialNetwork="mainnet" appName="YourAppName">.
3. For drop-in connection buttons, use <CiceroConnectButton variant="primary" size="md" radius="md" showBalance={true} showNetwork={true} />.
4. Supported wallets include:
   - Zucchini Browser Extension (via @zucchinifi/dapp-sdk with 1-click in-browser authorization)
   - Noir Wallet (self-custodial privacy extension for Orchard & ZECFi with native in-browser RPC 'zcash_requestAccounts')
   - Zelcore Wallet (multi-asset extension & desktop with 1-click transparent ZEC binding and 'zel:' URI protocol)
   - Zashi & Ywallet (mobile/desktop shielded wallets connecting via ZIP-321 QR handoff)
   - Viewing Keys (read-only auditor view for accounting and taxes with 'uview...' or 'zxviews...')
   - Ephemeral Dev Sessions (in-memory testnet wallet for testing without external tools)
5. Address formats:
   - Unified Addresses start with 'u1' (mainnet) or 'utest1' (testnet).
   - Sapling addresses start with 'zs1'.
   - Transparent addresses start with 't1' (mainnet) or 'tm' (testnet).
6. Hooks available:
   - useAccount(): { isConnected, isConnecting, address, wallet, disconnect }
   - useBalance(): { zec, usd, isLoading, refetch }
   - useCicero(): { network, switchNetwork, openConnectModal, openAccountModal, sendPayment, disconnect, wallets }
7. For payments or micro-tips, use 'generateZip321Uri({ address, amount, memo })' and 'getWalletDeepLinks(uri)'.`,
    },
    {
      id: 'paywall',
      name: 'Shielded Paywall & Commerce',
      badge: 'Payments',
      description: 'Specialized for zero-knowledge micro-checkouts, shielded tips, subscriptions, and ZIP-321 URI generation.',
      prompt: `You are an expert in integrating Zcash zero-knowledge payments and micro-paywalls using '@cicero-zcash/react'.

Requirements:
1. Construct ZIP-321 payment request URIs using 'generateZip321Uri({ address, amount, memo })'.
2. Provide interactive QR code fallback using '<CiceroQRCode value={uri} size={200} />'.
3. Support deep-links via 'getWalletDeepLinks(uri)' for Zashi, Ywallet, and Zelcore.
4. If a wallet is connected, invoke 'sendPayment({ to, amount, memo })' or trigger wallet signature RPC.
5. Handle shielded address validation with 'isShieldedAddress(address)' and pool type detection with 'getAddressType(address)'.
6. Display real-time fiat valuation using the 'useZcashPrice()' hook.`,
    },
    {
      id: 'auditor',
      name: 'Viewing Key & Treasury',
      badge: 'Auditing',
      description: 'Focused on read-only viewing keys (uview/zxviews) for DAO compliance, accounting dashboards, and air-gapped monitoring.',
      prompt: `You are an expert developer building confidential treasury dashboards and audit portals with '@cicero-zcash/react'.

Requirements:
1. Support viewing key connections (strings starting with 'uview' or 'zxviews').
2. When connected via viewing key, present a read-only dashboard without payment dispatch capabilities.
3. Fetch shielded incoming transaction history and pool balances without revealing expenditures to unauthorized parties.
4. Provide exportable accounting reports with real-time USD historical rate tags via 'useZcashPrice()'.`,
    },
  ];

  const agentInstallCommands: Record<
    string,
    { title: string; cmd: string; path: string }
  > = {
    cursor: {
      title: 'Cursor Rules (.cursorrules)',
      cmd: 'curl -fsSL https://raw.githubusercontent.com/Kaycee276/cicero/main/.cursorrules -o .cursorrules',
      path: '.cursorrules',
    },
    claude: {
      title: 'Claude Code Skill (CLAUDE.md)',
      cmd: 'curl -fsSL https://raw.githubusercontent.com/Kaycee276/cicero/main/CLAUDE.md -o CLAUDE.md',
      path: 'CLAUDE.md',
    },
    windsurf: {
      title: 'Windsurf Cascade (.windsurfrules)',
      cmd: 'curl -fsSL https://raw.githubusercontent.com/Kaycee276/cicero/main/.cursorrules -o .windsurfrules',
      path: '.windsurfrules',
    },
    antigravity: {
      title: 'Google Antigravity Skill',
      cmd: 'mkdir -p ~/.gemini/config/skills/cicero && curl -fsSL https://raw.githubusercontent.com/Kaycee276/cicero/main/skills/cicero/SKILL.md -o ~/.gemini/config/skills/cicero/SKILL.md',
      path: '~/.gemini/config/skills/cicero/SKILL.md',
    },
  };

  const selectedPreset =
    promptPresets.find((p) => p.id === selectedPresetId) || promptPresets[0];
  const activeToolConfig =
    agentInstallCommands[selectedAgentTool] || agentInstallCommands.cursor;

  const copyToClipboard = async (text: string, type: 'prompt' | 'cmd') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'prompt') {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } else {
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div id="ai-agent" className="space-y-6">
      {/* Section Intro Card */}
      <div className="p-8 rounded-2xl bg-[#0e0e12] border border-zinc-800/80 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                <Bot className="w-3.5 h-3.5" />
                <span>AI-Assisted Development Ecosystem</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Install Cicero Agent Skill or Copy Prompts
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Equip your AI assistant (Cursor, Claude Code, Windsurf, Antigravity, ChatGPT, Copilot) with deep knowledge of shielded Zcash, `@cicero-zcash/react`, and ZIP-321 payment request specs.
              </p>
            </div>

            <a
              href="/skills/cicero.md"
              download="cicero-skill.md"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-white transition-colors flex-shrink-0 font-mono"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download SKILL.md</span>
            </a>
          </div>

          {/* Tab switcher */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'prompt'
                  ? 'bg-emerald-400 text-zinc-950 font-semibold shadow-sm'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Copy AI Agent Prompts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('install')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'install'
                  ? 'bg-emerald-400 text-zinc-950 font-semibold shadow-sm'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>1-Line Skill Installers</span>
            </button>
          </div>
        </div>

        {/* Tab 1: AI Prompts */}
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            {/* Preset Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {promptPresets.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#121216] border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-sm'
                        : 'bg-[#0e0e12] border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-xs text-white">
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Prompt Viewer Box */}
            <div className="rounded-2xl bg-[#0e0e12] border border-zinc-800/80 overflow-hidden text-white shadow-xl">
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#141418] border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-zinc-300">
                    {selectedPreset.name} System Prompt
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedPreset.prompt, 'prompt')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-xs font-semibold transition-colors font-mono"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-5 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[320px] overflow-y-auto bg-[#09090b]">
                {selectedPreset.prompt}
              </pre>

              <div className="px-5 py-3 bg-[#141418] border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Paste into Cursor Composer, Claude Code, Windsurf, or Copilot</span>
                <span>Tokens: ~350</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 1-Line Skill Installers */}
        {activeTab === 'install' && (
          <div className="space-y-4">
            {/* Agent Tool Picker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(agentInstallCommands).map(([key, config]) => {
                const active = selectedAgentTool === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedAgentTool(key)}
                    className={`p-3 rounded-xl text-center border text-xs font-medium transition-all ${
                      active
                        ? 'bg-zinc-800 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                        : 'bg-[#0e0e12] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="capitalize">{key === 'antigravity' ? 'Antigravity' : key}</span>
                  </button>
                );
              })}
            </div>

            {/* Command Card */}
            <div className="p-6 rounded-2xl bg-[#0e0e12] border border-zinc-800/80 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {activeToolConfig.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Run this terminal command in your project root to auto-configure your workspace:
                  </p>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {activeToolConfig.path}
                </span>
              </div>

              <div className="p-3.5 bg-[#09090b] rounded-xl border border-zinc-800 flex items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2 overflow-x-auto text-zinc-200">
                  <span className="text-emerald-400 select-none">$</span>
                  <span className="whitespace-nowrap">{activeToolConfig.cmd}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeToolConfig.cmd, 'cmd')}
                  className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                  title="Copy command"
                >
                  {copiedCommand ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-[#141418] border border-zinc-800 space-y-1">
                  <span className="font-semibold text-white">Zero Configuration</span>
                  <p className="text-[11px] text-zinc-400">Your IDE assistant immediately recognizes all Cicero hooks and components.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#141418] border border-zinc-800 space-y-1">
                  <span className="font-semibold text-white">Zero Hallucination</span>
                  <p className="text-[11px] text-zinc-400">Pins exact package exports, prop types, and Zcash address constraints.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#141418] border border-zinc-800 space-y-1">
                  <span className="font-semibold text-white">Shielded Native</span>
                  <p className="text-[11px] text-zinc-400">Guides the agent to build zk-privacy native flows and ZIP-321 request URIs.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
