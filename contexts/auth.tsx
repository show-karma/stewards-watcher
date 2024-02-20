import axios from 'axios';
import { cookieNames } from 'helpers';
import jwtDecode from 'jwt-decode';
import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { IExpirationStatus, ISession } from 'types';
import Cookies from 'universal-cookie';
import { checkExpirationStatus } from 'utils';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useToasty } from 'hooks';
import { useDAO } from './dao';
import { useDelegates } from './delegates';
import { useWallet } from './wallet';

interface IAuthProps {
  isAuthenticated: boolean;
  authenticate: () => Promise<boolean>;
  authToken: string | null;
  disconnect: () => void;
  isDaoAdmin: boolean;
  isLoadingSign: boolean;
}

export const AuthContext = createContext({} as IAuthProps);

interface ProviderProps {
  children: React.ReactNode;
}

const api = axios.create({
  timeout: 30000, // 30secs
  baseURL: process.env.NEXT_PUBLIC_KARMA_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDaoAdmin, setIsDaoAdmin] = useState(false);
  const [authToken, setToken] = useState<string | null>(null);
  const { openConnectModal, delegateLoginOnClose, chain } = useWallet();
  const { searchProfileModal } = useDelegates();

  const { toast } = useToasty();

  const { disconnect: disconnectWallet } = useDisconnect();

  const { daoData, daoInfo, rootPathname } = useDAO();

  const cookies = new Cookies();

  const { signMessageAsync, isLoading: isLoadingSign } = useSignMessage();

  const disconnect = async () => {
    const rightPathname = rootPathname[0] === '/' ? rootPathname : '/';
    cookies.remove(cookieNames.cookieAuth, { path: rightPathname });
    cookies.remove(cookieNames.daoAdmin, { path: rightPathname });
    localStorage?.clear();

    setToken(null);
    setIsAuthenticated(false);
    disconnectWallet();
    window.location.reload();
  };

  const { address, isConnected } = useAccount({
    onDisconnect: () => {
      disconnect();
    },
  });

  const isTokenValid = (tokenValue: string | null) => {
    if (!tokenValue) return false;
    const decoded = jwtDecode(tokenValue) as ISession;
    const expiredStatus: IExpirationStatus = checkExpirationStatus(decoded);
    if (expiredStatus === 'expired') {
      return false;
    }
    return true;
  };

  const getNonce = async (publicAddress: string) => {
    try {
      const response = await api.post(`/auth/login`, {
        publicAddress,
        daoName: daoData?.name || daoInfo.config.DAO_KARMA_ID,
      });
      const { nonceMessage } = response.data.data;
      return nonceMessage;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in login:', error);
      return null;
    }
  };

  const signMessage = async (messageToSign: string) => {
    try {
      const signedMessage = await signMessageAsync({ message: messageToSign });
      return signedMessage;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      return null;
    }
  };

  const saveToken = (token: string | null) => {
    const rightPathname =
      rootPathname[0] === '/' ? rootPathname : `/${rootPathname}`;
    setToken(token);
    if (token)
      cookies.set(cookieNames.cookieAuth, token, { path: rightPathname });
    setIsAuthenticated(true);
  };

  const getAccountToken = async (
    publicAddress: string,
    signedMessage: string
  ) => {
    try {
      const chainId = chain?.id;
      const response = await api.post<{
        data: { token: string; daosManaged?: string[] };
      }>('/auth/authentication', {
        publicAddress,
        signedMessage,
        chainId,
      });
      const { token, daosManaged } = response.data.data;
      setToken(token);
      const daoAdmin = Array.isArray(daosManaged)
        ? daosManaged.includes(daoInfo.config.DAO_KARMA_ID)
        : false;
      setIsDaoAdmin(daoAdmin);
      const rightPathname = rootPathname[0] === '/' ? rootPathname : '/';
      cookies.set(cookieNames.daoAdmin, daoAdmin ? 1 : 0, {
        path: rightPathname,
      });

      return token;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error in getAccountAssets', error);
      return null;
    }
  };

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      setIsAuthenticating(true);
      openConnectModal?.();
      return false;
    }
    try {
      const nonceMessage = await getNonce(address);

      const signedMessage = await signMessage(nonceMessage);
      if (!signedMessage) return false;
      const token = await getAccountToken(address, signedMessage);

      if (token) saveToken(token);
      else {
        toast({
          status: 'error',
          description: "Signature and address don't match",
          title: 'Login failed',
        });
        return false;
      }

      delegateLoginOnClose();
      searchProfileModal(address, 'overview');
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (isConnected && isAuthenticating && !isAuthenticated) {
      authenticate();
    }
  }, [isConnected, daoData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = cookies.get(cookieNames.cookieAuth);
      if (savedToken) {
        const isValid = isTokenValid(savedToken);
        if (isValid) {
          saveToken(savedToken);
        }
        const daoAdmin = cookies.get(cookieNames.daoAdmin);
        setIsDaoAdmin(!!+daoAdmin);
      }
    }
  }, []);

  const providerValue = useMemo(
    (): IAuthProps => ({
      isAuthenticated,
      authenticate,
      authToken,
      disconnect,
      isDaoAdmin,
      isLoadingSign,
    }),
    [
      isAuthenticated,
      authenticate,
      authToken,
      disconnect,
      isDaoAdmin,
      isLoadingSign,
    ]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
