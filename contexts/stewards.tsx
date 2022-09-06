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
}

export const StewardsContext = createContext({} as IStewardProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const StewardsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [stewards, setStewards] = useState<ISteward[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [userToFind, setUserToFind] = useState('');
  const [offset, setOffset] = useState(0);
  const [stat, setStat] = useState<IFilterStat>('forumScore');
  const [order, setOrder] = useState<IFilterOrder>('desc');
  const [period, setPeriod] = useState<IFilterPeriod>('lifetime');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStewards = async () => {
    setLoading(true);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=optimism&pageSize=${offset === 0 ? 10 : 20}${
          userToFind && `name=${userToFind}`
        }&offset=${offset}&order=${order}&field=${stat}&period=${period}`
      );
      const { delegates } = axiosClient.data.data;
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
      const axiosClient = await axiosInstance.get(
        `/dao/find-delegate?dao=${GENERAL.DAO_KARMA_ID}&user=${userToFind}`
      );
      const { delegate } = axiosClient.data.data;
      if (!delegate) {
        throw new Error('No delegates found');
      }
      setLastUpdate(delegate.stats[0].updatedAt);
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
    };
  }, [stewards, isLoading, stat, order, period, userToFind, lastUpdate]);

  return (
    <StewardsContext.Provider value={providerValue}>
      {children}
    </StewardsContext.Provider>
  );
};
export const useStewards = () => useContext(StewardsContext);
