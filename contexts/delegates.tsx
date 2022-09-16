import React, { useContext, createContext, useState, useMemo } from 'react';
import {
  IDelegate,
  IFilterStat,
  IFilterOrder,
  IFilterPeriod,
  IDelegateFromAPI,
} from 'types';
import { axiosInstance } from 'utils';
import { useDAO } from './dao';

interface IDelegateProps {
  delegates: IDelegate[];
  isLoading: boolean;
  stat: IFilterStat;
  order: IFilterOrder;
  period: IFilterPeriod;
  userToFind: string;
  selectStat: (selectedStat: IFilterStat) => void;
  selectOrder: (selectedOrder: IFilterOrder) => void;
  selectPeriod: (selectedPeriod: IFilterPeriod) => void;
  selectUserToFind: (selectedUserToFind: string) => void;
  lastUpdate: Date;
  hasMore: boolean;
  fetchNextDelegates: () => Promise<void>;
}

export const DelegatesContext = createContext({} as IDelegateProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const DelegatesProvider: React.FC<ProviderProps> = ({ children }) => {
  const [delegates, setDelegates] = useState<IDelegate[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [userToFind, setUserToFind] = useState('');
  const [offset, setOffset] = useState(0);
  const [stat, setStat] = useState<IFilterStat>('forumScore');
  const [order, setOrder] = useState<IFilterOrder>('desc');
  const [period, setPeriod] = useState<IFilterPeriod>('lifetime');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasMore, setHasMore] = useState(false);

  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  const fetchDelegates = async (_offset = offset) => {
    setLoading(true);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=optimism&pageSize=10${
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
    try {
      setLoading(true);
      setHasMore(false);
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

  useMemo(() => {
    if (userToFind) {
      findDelegate();
    } else {
      fetchDelegates();
    }
  }, [stat, order, period, userToFind]);

  const providerValue = useMemo(() => {
    const selectStat = (selectedStat: IFilterStat) => setStat(selectedStat);
    const selectOrder = (selectedOrder: IFilterOrder) =>
      setOrder(selectedOrder);
    const selectPeriod = (selectedPeriod: IFilterPeriod) =>
      setPeriod(selectedPeriod);
    const selectUserToFind = (selectedUserToFind: string) =>
      setUserToFind(selectedUserToFind);

    const fetchNextDelegates = async () => {
      if (isFetchingMore) return;
      const newOffset = offset + 1;
      setOffset(newOffset);
      setFetchingMore(true);
      try {
        const axiosClient = await axiosInstance.get(
          `/dao/delegates?name=optimism&pageSize=10${
            userToFind && `name=${userToFind}`
          }&offset=${newOffset}&order=${order}&field=${stat}&period=${period}`
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
            delegateSince: item.joinDateAt || '-',
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

    return {
      delegates,
      isLoading,
      stat,
      order,
      period,
      selectStat,
      selectOrder,
      selectPeriod,
      userToFind,
      lastUpdate,
      selectUserToFind,
      hasMore,
      fetchNextDelegates,
    };
  }, [
    delegates,
    isLoading,
    stat,
    order,
    period,
    userToFind,
    lastUpdate,
    hasMore,
    isFetchingMore,
    offset,
  ]);

  return (
    <DelegatesContext.Provider value={providerValue}>
      {children}
    </DelegatesContext.Provider>
  );
};

export const useDelegates = () => useContext(DelegatesContext);
