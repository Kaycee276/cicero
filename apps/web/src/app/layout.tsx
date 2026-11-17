import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'Cicero — The Developer Payment Kit for Shielded Zcash',
  description:
    'Drop-in React components for zero-knowledge Zcash payments, ZIP-321 request URIs, and 512-byte encrypted memos.',
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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-[#3ecf8e]/30 selection:text-[#3ecf8e] antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
