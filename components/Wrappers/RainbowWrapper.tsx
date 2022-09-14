import React from 'react';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { GENERAL } from 'configs';

interface ProviderProps {
  children: React.ReactNode;
}

const { chains, provider } = configureChains(
  [chain.optimism],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: `${GENERAL.DAO}'s Delegates Watcher`,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const RainbowWrapper: React.FC<ProviderProps> = ({ children }) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
  </WagmiConfig>
);
