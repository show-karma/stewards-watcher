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
import { configureChains, createClient, WagmiConfig } from 'wagmi';
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

  const { chains, provider } = configureChains(
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
        metaMaskWallet({ chains }),
        rainbowWallet({ chains }),
        coinbaseWallet({
          chains,
          appName: `${config.DAO}'s Delegates Watcher`,
        }),
        walletConnectWallet({ chains }),
        talismanWallet({ chains }),
        injectedWallet({ chains }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
