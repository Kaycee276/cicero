import React from 'react';
import { Shield, Lock, Smartphone, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Terminal className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'ZIP-321 Payment Request Protocol',
      badge: 'RFC Standard',
      description:
        'Generates fully compliant Zcash payment request URIs adhering to the official ZIP-321 specification. Handles decimal amount sanitization and RFC-4648 Base64URL memo encoding without padding.',
    },
    {
      icon: <Lock className="w-5 h-5 text-[#3ecf8e]" />,
      title: '512-Byte Shielded Encrypted Memos',
      badge: 'Zero-Knowledge',
      description:
        'Attach encrypted order IDs, license keys, or confidential notes. Memos are encrypted on-chain using zk-SNARKs and can only be decrypted by the recipient holding the viewing or spending key.',
    },
    {
      icon: <Shield className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Unified Address (ZIP-316) Parsing',
      badge: 'Multi-Pool',
      description:
        'Intelligently validates and parses Unified Addresses (`u1`), Sapling shielded pools (`zs1`), and legacy transparent addresses (`t1`). Provides real-time warnings if an unshielded address attempts to use memos.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Zucchini, Zashi & Ywallet Handoff',
      badge: 'Browser + Mobile',
      description:
        'Direct 1-click in-browser approval with the Zucchini Wallet Chrome extension, plus dynamic QR codes and deep links for mobile shielded wallets like Zashi (Electric Coin Co.) and Ywallet.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Client-Side Real-Time Watcher',
      badge: 'State Machine',
      description:
        'A comprehensive payment lifecycle engine tracking idle, pending, mempool-detected, confirmed, and expired invoice states with automatic 15-minute countdowns and status callbacks.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Dynamic Fiat Rate Feeds',
      badge: 'Price Oracle',
      description:
        'Automatic caching hook `useZcashPrice()` converts live ZEC amounts into estimated USD equivalents using decentralized API fallbacks, preventing stale rates and API rate-limiting.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white border-b border-[#ededed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-[#24b47e] uppercase tracking-wider">
            Engineered For Privacy
          </span>
          <h2 className="display-lg text-[#171717] tracking-tight mt-2">
            Built on Zcash Cryptographic Standards
          </h2>
          <p className="mt-3 text-base text-[#707070] leading-relaxed">
            Cicero replaces fragmented Zcash payment scripts with a cohesive, battle-tested component suite engineered for consumer web applications.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-8 rounded-[12px] bg-white border border-[#dfdfdf] hover:border-[#c7c7c7] transition-all shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[6px] bg-[#fafafa] border border-[#ededed] flex items-center justify-center">
                  {feat.icon}
                </div>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-[#fafafa] text-[#707070] border border-[#ededed]">
                  {feat.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#171717]">{feat.title}</h3>
                <p className="text-xs text-[#707070] mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
