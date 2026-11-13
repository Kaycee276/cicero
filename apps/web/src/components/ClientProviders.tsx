'use client';

import React from 'react';
import { CiceroProvider } from '@cicero-zcash/react';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <CiceroProvider
      initialNetwork="testnet"
      appName="Cicero Studio"
      autoConnect={true}
    >
      {children}
    </CiceroProvider>
  );
};
