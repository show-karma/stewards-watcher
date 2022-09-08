import { GENERAL } from 'configs';
import React, { useContext, createContext, useState, useMemo } from 'react';
import {
  IDelegate,
  IFilterStat,
  IFilterOrder,
  IFilterPeriod,
  ISteward,
} from 'types';
import { axiosInstance } from 'utils';

interface IStewardProps {
  stewards: ISteward[];
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
  fetchNextStewards: () => Promise<void>;
}

export const StewardsContext = createContext({} as IStewardProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const StewardsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [stewards, setStewards] = useState<ISteward[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [userToFind, setUserToFind] = useState('');
  const [offset, setOffset] = useState(0);
  const [stat, setStat] = useState<IFilterStat>('forumScore');
  const [order, setOrder] = useState<IFilterOrder>('desc');
  const [period, setPeriod] = useState<IFilterPeriod>('lifetime');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasMore, setHasMore] = useState(false);

  const fetchStewards = async (_offset = offset) => {
    setLoading(true);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=optimism&pageSize=10${
          userToFind && `name=${userToFind}`
        }&offset=${_offset}&order=${order}&field=${stat}&period=${period}`
      );
      const { delegates } = axiosClient.data.data;
      setHasMore(delegates.length === 10);
      setLastUpdate(delegates[0].stats[0].updatedAt);

      const stewardsList = delegates.map((item: IDelegate) => {
        const fetchedPeriod = item.stats.find(
          fetchedStat => fetchedStat.period === period
        );

        return {
          address: item.publicAddress,
          ensName: item.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          stewardSince: item.joinDateAt,
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
      setStewards(stewardsList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const findSteward = async () => {
    try {
      setLoading(true);
      setHasMore(false);
      const axiosClient = await axiosInstance.get(
        `/dao/find-delegate?dao=${GENERAL.DAO_KARMA_ID}&user=${userToFind}`
      );
      const { delegate } = axiosClient.data.data;
      if (!delegate) {
        throw new Error('No delegates found');
      }
      const fetchedPeriod = (delegate as IDelegate).stats.find(
        fetchedStat => fetchedStat.period === period
      );
      setStewards([
        {
          address: delegate.publicAddress,
          ensName: delegate.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          stewardSince: delegate.joinDateAt,
          delegators: delegate.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          votingWeight: delegate.delegatedVotes,
          twitterHandle: delegate.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
        },
      ]);
    } catch (error) {
      console.log(error);
      setStewards([]);
      return;
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    if (userToFind) {
      findSteward();
    } else {
      fetchStewards();
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

    const fetchNextStewards = async () => {
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
        const { delegates } = axiosClient.data.data;
        setHasMore(delegates.length === 10);
        setLastUpdate(delegates[0].stats[0].updatedAt);

        delegates.forEach((item: IDelegate) => {
          const fetchedPeriod = item.stats.find(
            fetchedStat => fetchedStat.period === period
          );

          stewards.push({
            address: item.publicAddress,
            ensName: item.ensName,
            forumActivity: fetchedPeriod?.forumActivityScore || 0,
            stewardSince: item.joinDateAt || '-',
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
      stewards,
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
      fetchNextStewards,
    };
  }, [
    stewards,
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
    <StewardsContext.Provider value={providerValue}>
      {children}
    </StewardsContext.Provider>
  );
};
export const useStewards = () => useContext(StewardsContext);
