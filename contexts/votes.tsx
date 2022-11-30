import { useOffChainVotes, useOnChainVotes, usePicasso } from 'hooks';
import React, { useContext, createContext, useMemo, useState } from 'react';
import { supportedDAOs } from 'resources';
import { IChainRow, IDAOData, IDAOInfo, IDAOTheme, IProfile } from 'types';
import { axiosInstance } from 'utils';
import debounce from 'lodash.debounce';
import { useDelegates } from './delegates';

interface IVotesProps {
  isLoading: boolean;
  offChainVotes: IChainRow[] | undefined;
  onChainVotes: IChainRow[] | undefined;
  searchProposal: (partialText: string) => void;
  resetProposal: () => void;
}

export const VotesContext = createContext({} as IVotesProps);

interface ProviderProps {
  children: React.ReactNode;
  profile: IProfile;
}

export const VotesProvider: React.FC<ProviderProps> = ({
  children,
  profile,
}) => {
  //   console.log('profile', profile);
  const { voteInfos } = useDelegates();
  const { data: dataOffChainVotes } = useOffChainVotes(
    voteInfos.snapshotIds,
    profile.address
  );
  const { data: dataOnChainVotes } = useOnChainVotes(
    voteInfos.onChainId,
    profile.address
  );

  const [offChainVotes, setOffChainVotes] = useState<IChainRow[] | undefined>(
    []
  );
  const [onChainVotes, setOnChainVotes] = useState<IChainRow[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(true);

  const setupVotes = () => {
    setIsLoading(true);
    if (dataOnChainVotes && dataOnChainVotes.length > 0)
      setOnChainVotes(dataOnChainVotes);

    if (dataOffChainVotes && dataOffChainVotes.length > 0)
      setOffChainVotes(dataOffChainVotes);
    setIsLoading(false);
  };

  useMemo(() => {
    if (dataOffChainVotes && dataOnChainVotes) setupVotes();
  }, [dataOffChainVotes, dataOnChainVotes]);

  const searchProposal = debounce((partialText: string) => {
    setIsLoading(true);
    const filteredOffChain = dataOffChainVotes?.filter(vote =>
      vote.proposal.toLowerCase().includes(partialText.toLowerCase())
    );
    if (filteredOffChain?.length) setOffChainVotes(filteredOffChain);
    const filteredOnChain = dataOnChainVotes?.filter(vote =>
      vote.proposal.toLowerCase().includes(partialText.toLowerCase())
    );
    if (filteredOnChain?.length) setOnChainVotes(filteredOnChain);
    setIsLoading(false);
  }, 500);

  const resetProposal = () => {
    setOffChainVotes(dataOffChainVotes || []);
    setOnChainVotes(dataOnChainVotes || []);
  };

  const providerValue = useMemo(
    () => ({
      offChainVotes,
      onChainVotes,
      isLoading,
      searchProposal,
      resetProposal,
    }),
    [offChainVotes, onChainVotes, isLoading]
  );

  return (
    <VotesContext.Provider value={providerValue}>
      {children}
    </VotesContext.Provider>
  );
};

export const useVotes = () => useContext(VotesContext);
