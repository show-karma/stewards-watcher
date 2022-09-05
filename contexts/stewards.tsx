import React, { useContext, createContext, useState, useMemo } from 'react';
import { IDelegate, ISteward } from 'types';
import { axiosInstance } from 'utils';

interface IStewardProps {
  stewards: ISteward[];
  isLoading: boolean;
}

export const StewardsContext = createContext({} as IStewardProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const StewardsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [stewards, setStewards] = useState<ISteward[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [field, setField] = useState('score');

  const fetchStewards = async () => {
    setLoading(true);
    const axiosClient = await axiosInstance.get(
      `/dao/delegates?name=optimism&pageSize=${
        offset === 0 ? 10 : 20
      }&offset=${offset}&order=desc&field=${field}&period=lifetime`
    );
    const { delegates } = axiosClient.data.data;
    const stewardsList = delegates.map((item: IDelegate) => {
      const periodLifetime = item.stats.find(
        stat => stat.period === 'lifetime'
      );

      return {
        address: item.publicAddress,
        ensName: item.ensName,
        forumActivity: periodLifetime?.forumActivityScore || 0,
        stewardSince: item.joinDateAt,
        delegators: item.delegatorCount,
        voteParticipation: {
          onChain: periodLifetime?.onChainVotesPct || 0,
          offChain: periodLifetime?.offChainVotesPct || 0,
        },
        votingWeight: item.delegatedVotes,
        twitterHandle: 'test',
      };
    });
    setOffset(previous => previous + 10);
    setStewards(stewardsList);
    setLoading(false);
  };

  useMemo(() => {
    fetchStewards();
  }, []);

  const providerValue = useMemo(
    () => ({
      stewards,
      isLoading,
    }),
    [stewards, isLoading]
  );

  return (
    <StewardsContext.Provider value={providerValue}>
      {children}
    </StewardsContext.Provider>
  );
};
export const useStewards = () => useContext(StewardsContext);
