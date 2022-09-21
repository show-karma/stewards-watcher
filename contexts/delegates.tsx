// eslint-disable-next-line import/no-extraneous-dependencies
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import React, { useContext, createContext, useState, useMemo } from 'react';
import {
  IDelegate,
  IFilterStat,
  IFilterOrder,
  IFilterPeriod,
  IDelegateFromAPI,
  IStatOptions,
} from 'types';
import { axiosInstance } from 'utils';
import { useDAO } from './dao';

interface IDelegateProps {
  delegates: IDelegate[];
  isLoading: boolean;
  userToFind: string;
  lastUpdate: Date;
  hasMore: boolean;
  fetchNextDelegates: () => Promise<void>;
  findDelegate: () => Promise<void>;
  fetchDelegates: (_offset?: number) => Promise<void>;
  handleSearch: DebouncedFunc<(text: any) => void>;
  isSearchDirty: boolean;
  selectStat: (_selectedStat: IFilterStat) => void;
  selectOrder: (selectedOrder: IFilterOrder) => void;
  selectPeriod: (selectedPeriod: IFilterPeriod) => void;
  selectUserToFind: (selectedUserToFind: string) => void;
  statOptions: IStatOptions[];
  stat: IFilterStat;
  order: IFilterOrder;
  period: IFilterPeriod;
}

export const DelegatesContext = createContext({} as IDelegateProps);

interface ProviderProps {
  children: React.ReactNode;
}

const statDefaultOptions: IStatOptions[] = [
  { title: 'Voting weight', stat: 'delegatedVotes' },
  { title: 'Forum Activity', stat: 'forumScore' },
  { title: 'Off-chain votes', stat: 'offChainVotesPct' },
  { title: 'On-chain votes', stat: 'onChainVotesPct' },
];

export const DelegatesProvider: React.FC<ProviderProps> = ({ children }) => {
  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  const [delegates, setDelegates] = useState<IDelegate[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasMore, setHasMore] = useState(false);
  const [statOptions, setStatOptions] = useState(statDefaultOptions);
  const [stat, setStat] = useState<IFilterStat>(statOptions[0].stat);
  const [order, setOrder] = useState<IFilterOrder>('desc');
  const [period, setPeriod] = useState<IFilterPeriod>('lifetime');
  const [userToFind, setUserToFind] = useState('');

  const isSearchDirty = userToFind !== '';

  useMemo(() => {
    const filteredStats = statOptions.filter(
      option => !config.EXCLUDED_CARD_FIELDS.includes(option.stat)
    );
    setStatOptions(filteredStats);
  }, [config]);

  const fetchDelegates = async (_offset = offset) => {
    setLoading(true);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=10${
          userToFind && `name=${userToFind}`
        }&offset=${_offset}&order=${order}&field=${stat}&period=${period}`
      );
      const { delegates: fetchedDelegates } = axiosClient.data.data;
      setHasMore(fetchedDelegates.length === 10);
      setLastUpdate(fetchedDelegates[0].stats[0].updatedAt);

      const delegatesList = fetchedDelegates.map((item: IDelegateFromAPI) => {
        const fetchedPeriod = item.stats.find(
          fetchedStat => fetchedStat.period === period
        );

        return {
          address: item.publicAddress,
          ensName: item.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          delegateSince: item.joinDateAt,
          delegators: item.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          votingWeight: item.delegatedVotes,
          twitterHandle: item.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
        };
      });
      setDelegates(delegatesList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const findDelegate = async () => {
    setLoading(true);
    setHasMore(false);
    setOffset(0);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/find-delegate?dao=${config.DAO_KARMA_ID}&user=${userToFind}`
      );
      const { delegate: fetchedDelegate } = axiosClient.data.data;
      if (!fetchedDelegate) {
        throw new Error('No delegates found');
      }
      const fetchedPeriod = (fetchedDelegate as IDelegateFromAPI).stats.find(
        fetchedStat => fetchedStat.period === period
      );
      setDelegates([
        {
          address: fetchedDelegate.publicAddress,
          ensName: fetchedDelegate.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          delegateSince: fetchedDelegate.joinDateAt,
          delegators: fetchedDelegate.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          votingWeight: fetchedDelegate.delegatedVotes,
          twitterHandle: fetchedDelegate.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
        },
      ]);
    } catch (error) {
      console.log(error);
      setDelegates([]);
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchNextDelegates = async () => {
    if (isFetchingMore || !hasMore || isSearchDirty) return;
    const newOffset = offset + 1;
    setOffset(newOffset);
    setFetchingMore(true);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=10&offset=${newOffset}&order=${order}&field=${stat}&period=${period}`
      );
      const { delegates: fetchedDelegates } = axiosClient.data.data;
      setHasMore(fetchedDelegates.length === 10);
      setLastUpdate(fetchedDelegates[0].stats[0].updatedAt);

      fetchedDelegates.forEach((item: IDelegateFromAPI) => {
        const fetchedPeriod = item.stats.find(
          fetchedStat => fetchedStat.period === period
        );

        delegates.push({
          address: item.publicAddress,
          ensName: item.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          delegateSince: item.joinDateAt,
          delegators: item.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          votingWeight: item.delegatedVotes,
          twitterHandle: item.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt || '-',
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingMore(false);
    }
  };

  useMemo(() => {
    if (userToFind) {
      findDelegate();
    } else {
      fetchDelegates();
    }
  }, [stat, order, period, userToFind]);

  const selectStat = (_selectedStat: IFilterStat) => setStat(_selectedStat);
  const selectOrder = (selectedOrder: IFilterOrder) => setOrder(selectedOrder);
  const selectPeriod = (selectedPeriod: IFilterPeriod) =>
    setPeriod(selectedPeriod);
  const selectUserToFind = (selectedUser: string) =>
    setUserToFind(selectedUser);

  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  const providerValue = useMemo(
    () => ({
      delegates,
      isLoading,
      lastUpdate,
      hasMore,
      fetchNextDelegates,
      findDelegate,
      fetchDelegates,
      handleSearch,
      isSearchDirty,
      statOptions,
      stat,
      order,
      period,
      selectStat,
      selectOrder,
      selectPeriod,
      selectUserToFind,
      userToFind,
    }),
    [
      delegates,
      isLoading,
      lastUpdate,
      hasMore,
      isFetchingMore,
      offset,
      isSearchDirty,
      statOptions,
      stat,
      order,
      period,
      userToFind,
    ]
  );

  return (
    <DelegatesContext.Provider value={providerValue}>
      {children}
    </DelegatesContext.Provider>
  );
};

export const useDelegates = () => useContext(DelegatesContext);
