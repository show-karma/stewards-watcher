import { useQuery } from '@tanstack/react-query';
import { api, KARMA_API } from 'helpers';
import {
  useContext,
  createContext,
  useMemo,
  ReactNode,
  FC,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { IDelegationHistoryAPI, ITokenHoldersAPI } from 'types';
import debounce from 'lodash.debounce';
import { useDAO } from './dao';

interface ITokenHoldersProps {
  getTopHolders: () => ITokenHoldersAPI[] | undefined;
  isLoadingTopHolders: boolean;
  errorTopHolders: unknown;
  isLoadingSelectedAddresses: boolean;
  isFetchingSelectedAddresses: boolean;
  isFetchingTopHolders: boolean;
  errorSelectedAddresses: unknown;
  selectedAddresses: string[];
  changeAddresses: (addresses: string) => void;
  selectedAddressesData: IDelegationHistoryAPI[];
  changeSelectedAddress: (addresses: string[]) => void;
}

export const TokenHoldersContext = createContext({} as ITokenHoldersProps);

interface IProviderProps {
  children: ReactNode;
}

export const TokenHoldersProvider: FC<IProviderProps> = ({ children }) => {
  const { daoInfo } = useDAO();

  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [selectedAddressesData, setSelectedAddressesData] = useState<
    IDelegationHistoryAPI[]
  >([]);
  const router = useRouter();

  const {
    data: fetchedTopHolders,
    error: errorTopHolders,
    isLoading: isLoadingTopHolders,
    isFetching: isFetchingTopHolders,
  } = useQuery({
    queryKey: ['topHolders', daoInfo.config.DAO_KARMA_ID],
    queryFn: () =>
      api.get(
        `${KARMA_API.base_url}/dao/${daoInfo.config.DAO_KARMA_ID}/tokenholders`
      ),
    enabled: !!daoInfo.config.DAO_KARMA_ID,
    refetchOnWindowFocus: false,
  });

  const {
    data: fetchedSelectedAddresses,
    error: errorSelectedAddresses,
    isLoading: isLoadingSelectedAddresses,
    isFetching: isFetchingSelectedAddresses,
  } = useQuery({
    queryKey: [
      'selectedAddresses',
      daoInfo.config.DAO_KARMA_ID,
      selectedAddresses,
    ],
    queryFn: () => {
      const formattedAddreses = selectedAddresses.join(',');
      const request = api.get(
        `${KARMA_API.base_url}/dao/${daoInfo.config.DAO_KARMA_ID}/tokenholders/${formattedAddreses}`
      );
      return request;
    },
    enabled: !!daoInfo.config.DAO_KARMA_ID && !!selectedAddresses.length,
    refetchOnWindowFocus: false,
  });

  const setupSelectedAddresses = () => {
    if (!fetchedSelectedAddresses) {
      setSelectedAddressesData([]);
      return;
    }
    const { tokenholders }: { tokenholders: IDelegationHistoryAPI[] } =
      fetchedSelectedAddresses.data.data;
    setSelectedAddressesData(tokenholders);
  };

  useMemo(() => {
    setupSelectedAddresses();
  }, [fetchedSelectedAddresses]);

  const getTopHolders = () => {
    if (!fetchedTopHolders) return undefined;
    const { tokenholders }: { tokenholders: ITokenHoldersAPI[] } =
      fetchedTopHolders.data.data;
    return tokenholders;
  };

  const reflectOnUrl = (addresses: string[]) => {
    router
      .push(
        {
          pathname: `/token-holders/`,
          query: {
            addresses: addresses.join(','),
          },
        },
        undefined,
        { shallow: true }
      )
      .catch(error => {
        if (!error.cancelled) {
          throw error;
        }
      });
  };

  const changeAddresses = debounce((text: string) => {
    if (!text) {
      setSelectedAddresses([]);
      return;
    }
    const handledText = text.replace(/\s+/g, '').split(',');
    setSelectedAddresses(handledText);
    reflectOnUrl(handledText);
  }, 250);

  const changeSelectedAddress = (addresses: string[]) => {
    changeAddresses(addresses.join(','));
  };

  const getReflectionOnUrl = () => {
    const queryString = router.asPath.split('?')[1];
    const addresses = queryString?.match(/(?<=addresses=)[^&]*/i)?.[0];
    if (!addresses) return;
    const addressesSplitted = addresses
      .split(/(%2C|,)/)
      .filter(item => !item.includes('%'));

    if (addresses) changeAddresses(addressesSplitted.join(','));
  };

  useMemo(() => {
    if (router.query) getReflectionOnUrl();
  }, []);

  const providerValue = useMemo(
    () => ({
      getTopHolders,
      isLoadingTopHolders,
      errorTopHolders,
      fetchedSelectedAddresses,
      errorSelectedAddresses,
      isLoadingSelectedAddresses,
      changeAddresses,
      selectedAddresses,
      isFetchingSelectedAddresses,
      selectedAddressesData,
      isFetchingTopHolders,
      changeSelectedAddress,
    }),
    [
      getTopHolders,
      isLoadingTopHolders,
      errorTopHolders,
      fetchedSelectedAddresses,
      errorSelectedAddresses,
      isLoadingSelectedAddresses,
      changeAddresses,
      selectedAddresses,
      isFetchingSelectedAddresses,
      selectedAddressesData,
      isFetchingTopHolders,
      changeSelectedAddress,
    ]
  );

  return (
    <TokenHoldersContext.Provider value={providerValue}>
      {children}
    </TokenHoldersContext.Provider>
  );
};

export const useTokenHolders = () => useContext(TokenHoldersContext);
