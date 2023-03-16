import React, { useContext, createContext, useMemo } from 'react';

import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { Chain, useAccount, useNetwork } from 'wagmi';
import { useIsMounted } from 'hooks/useIsMounted';
import { useDisclosure } from '@chakra-ui/react';

interface IWalletProps {
  isConnected: boolean;
  openConnectModal: (() => void) | undefined;
  openChainModal: (() => void) | undefined;
  chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined;
  connectOnClose: () => void;
  connectIsOpen: boolean;
  connectOnToggle: () => void;
  delegateIsOpen: boolean;
  delegateOnToggle: () => void;
  address: string | undefined;
}

export const WalletContext = createContext({} as IWalletProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<ProviderProps> = ({ children }) => {
  const isMounted = useIsMounted();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const {
    onClose: connectOnClose,
    isOpen: connectIsOpen,
    onToggle: connectOnToggle,
  } = useDisclosure();

  const { onToggle: delegateOnToggle, isOpen: delegateIsOpen } =
    useDisclosure();

  const providerValue = useMemo(
    () => ({
      isConnected,
      openConnectModal,
      openChainModal,
      chain,
      connectOnClose,
      connectIsOpen,
      connectOnToggle,
      delegateIsOpen,
      delegateOnToggle,
      address,
    }),
    [
      isConnected,
      openConnectModal,
      openChainModal,
      chain,
      connectOnClose,
      connectIsOpen,
      connectOnToggle,
      delegateIsOpen,
      delegateOnToggle,
      address,
    ]
  );

  return isMounted ? (
    <WalletContext.Provider value={providerValue}>
      {children}
    </WalletContext.Provider>
  ) : null;
};

export const useWallet = () => useContext(WalletContext);
