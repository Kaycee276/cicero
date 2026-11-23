import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cicero-zcash/react', '@cicero-zcash/core'],
  reactStrictMode: true,
};

export default nextConfig;
