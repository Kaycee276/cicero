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
  metadataBase: new URL('https://cicero.izuaba.xyz'),
  title: 'Cicero — The RainbowKit for Shielded Zcash',
  description:
    'Universal wallet connection, ZIP-321 checkout, and shielded balance state for Zcash dApps in React.',
  applicationName: 'Cicero',
  keywords: [
    'Zcash',
    'Shielded Payments',
    'zk-SNARKs',
    'ZIP-321',
    'React Checkout',
    'Web3 Payments',
    'Cicero',
    'RainbowKit',
    'Wallet Adapter',
  ],
  authors: [{ name: 'Kaycee276', url: 'https://github.com/Kaycee276' }],
  creator: 'Kaycee276',
  openGraph: {
    title: 'Cicero — The RainbowKit for Shielded Zcash',
    description:
      'Universal wallet connection, ZIP-321 checkout, and shielded balance state for Zcash dApps in React.',
    url: 'https://cicero.izuaba.xyz',
    siteName: 'Cicero',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cicero — Universal Wallet Connection & Payments for Shielded Zcash',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cicero — The RainbowKit for Shielded Zcash',
    description:
      'Universal wallet connection, ZIP-321 checkout, and shielded balance state for Zcash dApps in React.',
    creator: '@kc_deblocksmith',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
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
