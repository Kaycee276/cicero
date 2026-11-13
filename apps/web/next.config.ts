import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cicero-zcash/react'],
  reactStrictMode: true,
};

export default nextConfig;
