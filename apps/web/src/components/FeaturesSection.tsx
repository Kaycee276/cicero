import React from 'react';
import { Shield, Wallet, Smartphone, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Wallet className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'RainbowKit-Style Connect Button',
      badge: 'Core',
      description:
        'A single <CiceroConnectButton /> renders a multi-state wallet pill: connect trigger → wallet selector modal → connected account drawer with balance, network badge, QR code, and disconnect.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Zucchini, Zashi & Ywallet Support',
      badge: 'Multi-Wallet',
      description:
        'Connect directly to Zucchini browser extension with 1-click, or use Zashi and Ywallet on mobile. Viewing-key and burner wallet modes also supported for read-only dashboards.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Bi-Directional Network Sync',
      badge: 'Live Sync',
      description:
        'Cicero auto-detects the wallet\'s active network on connect and listens for live network/account change events. When you toggle Mainnet ↔ Testnet in the extension, Cicero updates instantly.',
    },
    {
      icon: <Shield className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Unified Address (ZIP-316) Parsing',
      badge: 'Multi-Pool',
      description:
        'Validates and classifies Unified Addresses (u1), Sapling shielded pools (zs1), and transparent addresses (t1). Network is inferred from address prefix — no guessing needed.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Per-Network Balance Queries',
      badge: 'State Machine',
      description:
        'Balances are queried and cached per-network. Switching from Mainnet to Testnet instantly fetches the correct shielded balance with loading states and automatic USD conversion.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#3ecf8e]" />,
      title: 'Dynamic Fiat Rate Feeds',
      badge: 'Price Oracle',
      description:
        'The useZcashPrice() hook provides live ZEC → USD conversion with decentralized API fallbacks, automatic caching, and configurable refresh intervals.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white dark:bg-[#121212] border-b border-[#ededed] dark:border-[#262626] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono text-[#24b47e] dark:text-[#3ecf8e] uppercase tracking-wider">
            Engineered For Privacy
          </span>
          <h2 className="display-lg text-[#171717] dark:text-white tracking-tight mt-2">
            Built on Zcash Cryptographic Standards
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#707070] dark:text-[#a1a1aa] leading-relaxed">
            Cicero replaces fragmented Zcash wallet integration scripts with a cohesive, production-ready component suite for React applications.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-[12px] bg-white dark:bg-[#181818] border border-[#dfdfdf] dark:border-[#262626] hover:border-[#c7c7c7] dark:hover:border-[#383838] transition-all shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[6px] bg-[#fafafa] dark:bg-[#202020] border border-[#ededed] dark:border-[#333] flex items-center justify-center">
                  {feat.icon}
                </div>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-[#fafafa] dark:bg-[#222] text-[#707070] dark:text-[#a1a1aa] border border-[#ededed] dark:border-[#333]">
                  {feat.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#171717] dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#707070] dark:text-[#a1a1aa] mt-2 leading-relaxed">
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
