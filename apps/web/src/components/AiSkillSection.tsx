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
   - useZucchiniWallet(): { isAvailable, isConnected, connect, address }
7. For payments, use sendPayment({ recipient, amount, memo }) which automatically handles extension RPCs, Zelcore deep links, or ZIP-321 URI fallback.
8. All code should be clean, modular, and written in TypeScript with Tailwind CSS styling.`,
    },
    {
      id: 'paywall-donation',
      name: 'Shielded Paywall & ZIP-321 QR',
      badge: 'Payments',
      description: 'Instructs AI to generate shielded Zcash payment gates, donation widgets, and ZIP-321 URI codes.',
      prompt: `You are a specialist in privacy-preserving Zcash payment flows. Build a shielded Zcash payment or donation gate using @cicero-zcash/react.

Key Requirements:
1. To dispatch payments from connected wallets (Noir, Zucchini, Zelcore), use const { sendPayment } = useCicero():
   await sendPayment({ recipient: '<unified_or_t_address>', amount: 0.1, memo: 'Order #101' });
2. For mobile wallet handoff (Zashi, Ywallet), use <CiceroQRCode value="zcash:<unified_address>?amount=<amount>&message=<memo>" size={180} /> for rendering ZIP-321 compliant QR codes.
3. Provide a clean UI showing the target shielded address with a 1-click copy button.
4. If the user connects with CiceroConnectButton, display their active balance using useBalance() and verify if their balance covers the required fee.
5. Support network switching between 'mainnet' and 'testnet' using useCicero().
6. Emphasize that Zcash shielded transactions provide zero-knowledge transaction graph confidentiality via Halo 2 zk-SNARKs.`,
    },
    {
      id: 'custom-ui',
      name: 'Custom UI & Headless Hooks',
      badge: 'Headless UI',
      description: 'Instructs AI to build custom wallet connectors without default buttons using headless hooks.',
      prompt: `You are a frontend UI engineer building a bespoke, branded Zcash wallet modal and connection bar using headless hooks from @cicero-zcash/react.

Guidelines:
1. Avoid using pre-styled buttons if a custom design is requested; instead use:
   - const { address, isConnected, wallet, disconnect } = useAccount();
   - const { zec, usd, refetch, isLoading } = useBalance();
   - const { openConnectModal, openAccountModal, network, switchNetwork, sendPayment } = useCicero();
2. Implement custom triggers with smooth transitions, custom loading spinners, and network status tags.
3. Handle disconnected, connecting, and connected states gracefully with accessible ARIA labels.
4. Use Supabase token aesthetic: #121212 background, #181818 surface, and #3ecf8e emerald accents.`,
    },
  ];

  const agentInstallCommands: Record<string, { title: string; cmd: string; path: string }> = {
    cursor: {
      title: 'Cursor Rules (.cursor/rules)',
      cmd: 'npx @cicero-zcash/react cicero-skill --cursor',
      path: '.cursor/rules/cicero.mdc',
    },
    antigravity: {
      title: 'Google Antigravity / Gemini CLI (.gemini/skills)',
      cmd: 'npx @cicero-zcash/react cicero-skill --antigravity',
      path: '.gemini/skills/cicero/SKILL.md',
    },
    claude: {
      title: 'Claude Code (CLAUDE.md)',
      cmd: 'npx @cicero-zcash/react cicero-skill --claude',
      path: 'CLAUDE.md',
    },
    windsurf: {
      title: 'Windsurf (.windsurfrules)',
      cmd: 'npx @cicero-zcash/react cicero-skill --windsurf',
      path: '.windsurfrules',
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
      <div className="p-6 sm:p-8 rounded-[12px] bg-gradient-to-br from-[#171717] via-[#212121] to-[#171717] border border-[#2b2b2b] dark:border-[#333] text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#3ecf8e]/20 border border-[#3ecf8e]/40 text-xs font-mono text-[#3ecf8e]">
              <Bot className="w-3.5 h-3.5" />
              <span>AI-Assisted Development</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Install Cicero Agent Skill or Copy Prompts
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
              Equip your AI assistant (Cursor, Claude Code, Windsurf, Antigravity, ChatGPT, Copilot) with deep knowledge of shielded Zcash, `@cicero-zcash/react`, and ZIP-321 payment specs.
            </p>
          </div>

          <a
            href="/skills/cicero.md"
            download="cicero-skill.md"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] bg-[#2b2b2b] hover:bg-[#383838] border border-[#444] text-xs font-medium text-white transition-colors flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#3ecf8e]" />
            <span>Download SKILL.md</span>
          </a>
        </div>

        {/* Tab switcher: Prompts vs Skill Installation */}
        <div className="mt-6 pt-6 border-t border-[#333] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-xs font-medium transition-all ${
              activeTab === 'prompt'
                ? 'bg-[#3ecf8e] text-[#171717] font-semibold shadow-sm'
                : 'bg-[#262626] text-[#a1a1aa] hover:text-white hover:bg-[#333]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Copy AI Agent Prompts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-xs font-medium transition-all ${
              activeTab === 'install'
                ? 'bg-[#3ecf8e] text-[#171717] font-semibold shadow-sm'
                : 'bg-[#262626] text-[#a1a1aa] hover:text-white hover:bg-[#333]'
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
                  className={`p-4 rounded-[8px] text-left border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-[#1a1a1a] border-[#3ecf8e] ring-1 ring-[#3ecf8e] shadow-sm'
                      : 'bg-[#fafafa] dark:bg-[#161616] border-[#ededed] dark:border-[#262626] hover:border-[#dfdfdf] dark:hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-xs text-[#171717] dark:text-white">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3ecf8e]/15 text-[#24b47e] dark:text-[#3ecf8e]">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707070] dark:text-[#a1a1aa] line-clamp-2">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Prompt Viewer Box */}
          <div className="rounded-[10px] bg-[#181818] border border-[#2b2b2b] overflow-hidden text-white shadow-md">
            <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#3ecf8e]" />
                <span className="text-xs font-mono text-[#ededed]">
                  {selectedPreset.name} Prompt
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedPreset.prompt, 'prompt')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#3ecf8e] hover:bg-[#24b47e] text-[#171717] text-xs font-semibold transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#171717]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#171717]" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 sm:p-5 text-xs font-mono text-[#d4d4d8] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[320px] overflow-y-auto">
              {selectedPreset.prompt}
            </pre>

            <div className="px-4 py-2.5 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-[11px] text-[#71717a]">
              <span>Paste into Cursor Composer, ChatGPT, Claude, Copilot, or Windsurf</span>
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
                  className={`p-3 rounded-[8px] text-center border text-xs font-medium transition-all ${
                    active
                      ? 'bg-white dark:bg-[#1a1a1a] border-[#3ecf8e] text-[#171717] dark:text-white ring-1 ring-[#3ecf8e]'
                      : 'bg-[#fafafa] dark:bg-[#161616] border-[#ededed] dark:border-[#262626] text-[#707070] dark:text-[#a1a1aa] hover:border-[#dfdfdf]'
                  }`}
                >
                  <span className="capitalize">{key === 'antigravity' ? 'Antigravity' : key}</span>
                </button>
              );
            })}
          </div>

          {/* Command Card */}
          <div className="p-5 rounded-[10px] bg-[#181818] border border-[#2b2b2b] text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {activeToolConfig.title}
                </h4>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  Run this terminal command in your project root to auto-configure your workspace:
                </p>
              </div>

              <span className="text-[11px] font-mono text-[#3ecf8e] px-2 py-0.5 rounded bg-[#3ecf8e]/10 border border-[#3ecf8e]/20">
                {activeToolConfig.path}
              </span>
            </div>

            <div className="p-3 bg-[#121212] rounded-[6px] border border-[#262626] flex items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 overflow-x-auto text-[#e4e4e7]">
                <span className="text-[#3ecf8e] select-none">$</span>
                <span className="whitespace-nowrap">{activeToolConfig.cmd}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(activeToolConfig.cmd, 'cmd')}
                className="p-1.5 rounded hover:bg-[#252525] text-[#a1a1aa] hover:text-white transition-colors flex-shrink-0"
                title="Copy command"
              >
                {copiedCommand ? (
                  <Check className="w-4 h-4 text-[#3ecf8e]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-[#1f1f1f] border border-[#2a2a2a] space-y-1">
                <span className="font-semibold text-white">Zero Configuration</span>
                <p className="text-[11px] text-[#a1a1aa]">Your IDE assistant immediately recognizes all Cicero hooks and components.</p>
              </div>
              <div className="p-2.5 rounded bg-[#1f1f1f] border border-[#2a2a2a] space-y-1">
                <span className="font-semibold text-white">Zero Hallucination</span>
                <p className="text-[11px] text-[#a1a1aa]">Pins exact package exports, prop types, and Zcash address constraints.</p>
              </div>
              <div className="p-2.5 rounded bg-[#1f1f1f] border border-[#2a2a2a] space-y-1">
                <span className="font-semibold text-white">Shielded Native</span>
                <p className="text-[11px] text-[#a1a1aa]">Guides the agent to build zk-privacy native flows and ZIP-321 request URIs.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
