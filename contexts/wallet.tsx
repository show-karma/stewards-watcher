import React, { useContext, createContext, useState, useMemo } from 'react';

import {
  getDefaultWallets,
  RainbowKitProvider,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import {
  Chain,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { GENERAL } from 'configs';

interface IWalletProps {
  isConnected: boolean;
  openConnectModal: (() => void) | undefined;
  openChainModal: (() => void) | undefined;
  chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined;
}

export const WalletContext = createContext({} as IWalletProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<ProviderProps> = ({ children }) => {
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const providerValue = useMemo(
    () => ({
      isConnected,
      openConnectModal,
      openChainModal,
      chain,
    }),
    [isConnected, openConnectModal, openChainModal, chain]
  );

  return (
    <WalletContext.Provider value={providerValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
