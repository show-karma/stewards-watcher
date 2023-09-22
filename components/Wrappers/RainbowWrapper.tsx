import React from 'react';
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { useDAO } from 'contexts';
import { talismanWallet } from 'utils';
import { optimism } from 'wagmi/chains';

interface ProviderProps {
  children: React.ReactNode;
}

export const RainbowWrapper: React.FC<ProviderProps> = ({ children }) => {
  const { daoInfo } = useDAO();

  const { config } = daoInfo;

  const rpcs = [
    process.env.NEXT_PUBLIC_ALCHEMY_KEY
      ? alchemyProvider({
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        })
      : publicProvider(),
    config.CUSTOM_RPC ? config.CUSTOM_RPC : null,
  ].filter(item => item !== null);

  const setChains = config.DAO_CHAINS.find(item => item.id === optimism.id)
    ? config.DAO_CHAINS
    : config.DAO_CHAINS.concat([optimism]);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    setChains,
    rpcs
  );

  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({
          chains,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
        }),
        rainbowWallet({
          chains,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
        }),
        coinbaseWallet({
          chains,
          appName: `${config.DAO}'s Delegates Watcher`,
        }),
        walletConnectWallet({
          chains,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
        }),
        talismanWallet({ chains }),
        injectedWallet({ chains }),
      ],
    },
  ]);

  const wagmiClient = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
