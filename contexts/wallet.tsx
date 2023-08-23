import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { Chain, useAccount, useNetwork } from 'wagmi';
import { useIsMounted } from 'hooks/useIsMounted';
import { useDisclosure } from '@chakra-ui/react';
import { api, API_ROUTES } from 'helpers';

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
  connectOnOpen: () => void;
  delegateIsOpen: boolean;
  delegateOnToggle: () => void;
  delegateOnClose: () => void;
  delegateOnOpen: () => void;
  delegateLoginIsOpen: boolean;
  delegateLoginOnToggle: () => void;
  delegateLoginOnClose: () => void;
  delegateLoginOnOpen: () => void;
  address: string | undefined;
  realWallet: string;
  compareProxy: (walletToCompare: string) => boolean;
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

  const [realWallet, setRealWallet] = useState('');

  const checkProxy = async () => {
    if (!address) return;
    try {
      const response = await api.get(API_ROUTES.USER.GET_USER(address));
      const { address: addressReturn } = response.data.data;
      setRealWallet(addressReturn);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      checkProxy();
    }
  }, [address]);

  const compareProxy = (walletToCompare: string) => {
    if (!address || !walletToCompare) return false;
    if (walletToCompare.toLowerCase() === realWallet.toLowerCase()) return true;
    if (walletToCompare.toLowerCase() === address.toLowerCase()) return true;
    return false;
  };

  const {
    onClose: connectOnClose,
    onOpen: connectOnOpen,
    isOpen: connectIsOpen,
    onToggle: connectOnToggle,
  } = useDisclosure();

  const {
    onToggle: delegateOnToggle,
    isOpen: delegateIsOpen,
    onClose: delegateOnClose,
    onOpen: delegateOnOpen,
  } = useDisclosure();
  const {
    onToggle: delegateLoginOnToggle,
    isOpen: delegateLoginIsOpen,
    onClose: delegateLoginOnClose,
    onOpen: delegateLoginOnOpen,
  } = useDisclosure();

  const providerValue = useMemo(
    () => ({
      isConnected,
      openConnectModal,
      openChainModal,
      chain,
      connectOnClose,
      connectIsOpen,
      connectOnToggle,
      address,
      connectOnOpen,
      delegateIsOpen,
      delegateOnToggle,
      delegateOnClose,
      delegateOnOpen,
      delegateLoginIsOpen,
      delegateLoginOnToggle,
      delegateLoginOnClose,
      delegateLoginOnOpen,
      realWallet,
      compareProxy,
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
      connectOnOpen,
      delegateOnClose,
      delegateOnOpen,
      delegateLoginIsOpen,
      delegateLoginOnToggle,
      delegateLoginOnClose,
      delegateLoginOnOpen,
      realWallet,
      compareProxy,
    ]
  );

  return isMounted ? (
    <WalletContext.Provider value={providerValue}>
      {children}
    </WalletContext.Provider>
  ) : null;
};

export const useWallet = () => useContext(WalletContext);
