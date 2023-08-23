import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useIsMounted } from 'hooks/useIsMounted';
import { useToasty } from 'hooks';
import { api, API_ROUTES } from 'helpers';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { checkRealAddress } from 'utils';
import { useDelegates } from './delegates';
import { useDAO } from './dao';
import { useAuth } from './auth';
import { useWallet } from './wallet';

interface IProxyContextProps {
  addProxy: (coldWalletAddress: string) => Promise<void>;
  hasProxy: boolean;
  realWallet: string;
  compareProxy: (walletToCompare: string) => boolean;
  removeProxy: () => Promise<void>;
}

export const ProxyContext = createContext({} as IProxyContextProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const ProxyProvider: React.FC<ProviderProps> = ({ children }) => {
  const isMounted = useIsMounted();

  const { toast } = useToasty();
  const { profileSelected, refreshProfileModal } = useDelegates();

  const { daoInfo } = useDAO();
  const { address } = useAccount();
  const { authToken, disconnect } = useAuth();

  const [hasProxy, setHasProxy] = useState(false);

  const [realWallet, setRealWallet] = useState('');

  const checkProxy = async (addressToCheck: string) => {
    if (!profileSelected?.address) return;
    try {
      const response = await api.get(API_ROUTES.USER.GET_USER(addressToCheck));
      const { address: addressReturn } = response.data.data;

      if (addressReturn.toLowerCase() === address?.toLowerCase()) {
        setHasProxy(false);
      } else {
        setHasProxy(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (profileSelected?.address) checkProxy(profileSelected.address);
  }, [profileSelected?.address, address]);

  const setupRealAddress = async () => {
    if (!address) return;
    try {
      const addressFound = await checkRealAddress(address as string);
      setRealWallet(addressFound || '');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setupRealAddress();
  }, [profileSelected?.address, address, hasProxy]);

  const removeProxy = async () => {
    if (!profileSelected?.address) return;
    const authorizedAPI = axios.create({
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authToken ? `Bearer ${authToken}` : '',
      },
    });
    try {
      await authorizedAPI.delete(API_ROUTES.USER.DELETE_PROXY);
      toast({
        title:
          'The proxy wallet account has been unlinked. Please log in again.',
        status: 'success',
      });
      disconnect();
    } catch (error) {
      console.log(error);
      toast({
        title: `We could not unlink the addresses. Please make sure ${address} is the proxy for ${profileSelected?.address}.`,
        status: 'error',
      });
    }
    setTimeout(() => {
      checkProxy(address as string);
    }, 500);
  };

  const addProxy = async (coldWalletAddress: string) => {
    if (!profileSelected?.address) return;
    const authorizedAPI = axios.create({
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authToken ? `Bearer ${authToken}` : '',
      },
    });

    try {
      await authorizedAPI.post(
        API_ROUTES.USER.PROXY(profileSelected?.address),
        {
          daoName: daoInfo.config.DAO_KARMA_ID,
          coldWalletAddress,
        }
      );
      toast({
        title: 'Your proxy and real addresses have been successfully linked.',
        status: 'success',
      });
      refreshProfileModal('statement', coldWalletAddress);
    } catch (error) {
      toast({
        title: `We could not link the addresses. Please make sure ${profileSelected?.address} is the proxy for ${coldWalletAddress}.`,
        status: 'error',
      });
      console.log(error);
    }
    setTimeout(() => {
      checkProxy(address as string);
    }, 500);
  };

  useEffect(() => {
    if (address) {
      checkProxy(address as string);
    }
  }, [address]);

  const compareProxy = (walletToCompare: string) => {
    if (!address || !walletToCompare) return false;
    if (walletToCompare.toLowerCase() === realWallet.toLowerCase()) return true;
    if (walletToCompare.toLowerCase() === address.toLowerCase()) return true;
    return false;
  };

  const providerValue = useMemo(
    () => ({
      addProxy,
      hasProxy,
      realWallet,
      compareProxy,
      removeProxy,
    }),
    [addProxy, hasProxy, realWallet, compareProxy, removeProxy]
  );

  return isMounted ? (
    <ProxyContext.Provider value={providerValue}>
      {children}
    </ProxyContext.Provider>
  ) : null;
};

export const useProxy = () => useContext(ProxyContext);
