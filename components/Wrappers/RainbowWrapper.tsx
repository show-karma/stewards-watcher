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
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { useDAO } from 'contexts';
import { RPCS } from 'helpers';
import { talismanWallet } from 'utils';

interface ProviderProps {
  children: React.ReactNode;
}

export const RainbowWrapper: React.FC<ProviderProps> = ({ children }) => {
  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [config.DAO_CHAIN],
    [
      process.env.NEXT_PUBLIC_ALCHEMY_KEY
        ? alchemyProvider({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
          })
        : publicProvider(),

      jsonRpcProvider({
        rpc: () => ({
          http: RPCS.moonriver,
        }),
      }),
    ]
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
