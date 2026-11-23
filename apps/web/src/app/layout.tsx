import type { Metadata } from 'next';
import { Cinzel, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const cinzel = Cinzel({
  variable: '--font-inscription',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-secondary',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cicero — Zcash Wallets & Payments for React',
  description:
    'Connect Zcash wallets in React and create ZIP-321 payment requests with Cicero’s wallet toolkit.',
  keywords: [
    'Zcash',
    'Shielded Payments',
    'zk-SNARKs',
    'ZIP-321',
    'React Checkout',
    'Web3 Payments',
    'Cicero',
  ],
  authors: [{ name: 'Kaycee276' }],
  openGraph: {
    title: 'Cicero — Zcash Wallets & Payments for React',
    description:
      'A React toolkit for Zcash wallet connections, shielded account state, and ZIP-321 payment requests.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark scroll-smooth ${cinzel.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-[#3ecf8e]/30 selection:text-[#3ecf8e] antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
