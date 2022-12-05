import { useOffChainVotes, useOnChainVotes, usePicasso } from 'hooks';
import React, { useContext, createContext, useMemo, useState } from 'react';
import { supportedDAOs } from 'resources';
import { IChainRow, IDAOData, IDAOInfo, IDAOTheme, IProfile } from 'types';
import { axiosInstance } from 'utils';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { useDelegates } from './delegates';

interface IVotesProps {
  isLoading: boolean;
  offChainVotes: IChainRow[] | undefined;
  onChainVotes: IChainRow[] | undefined;
  searchProposal: (partialText: string) => void;
  resetProposal: () => void;
  showingVotes: IChainRow[];
  allVotes: IChainRow[];
  limit: number;
  offset: number;
  changeOffset: (newOffset: number) => void;
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
    undefined
  );
  const [onChainVotes, setOnChainVotes] = useState<IChainRow[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 6;

  const changeOffset = (newOffset: number) => setOffset(newOffset);

  const allVotes = useMemo(
    () =>
      (offChainVotes || [])
        .concat(onChainVotes || [])
        .sort((voteA, voteB) =>
          moment(voteA.executed).isBefore(voteB.executed) ? 1 : -1
        ) || [],
    [onChainVotes, offChainVotes]
  );

  const showingVotes = allVotes.slice(offset * limit, offset * limit + limit);

  const setupVotes = () => {
    setIsLoading(true);
    setOnChainVotes(dataOnChainVotes || []);
    setOffChainVotes(dataOffChainVotes || []);
    setIsLoading(false);
  };

  useMemo(() => {
    if (dataOffChainVotes && dataOnChainVotes) setupVotes();
  }, [dataOffChainVotes, dataOnChainVotes]);

  const searchProposal = debounce((partialText: string) => {
    setIsLoading(true);
    changeOffset(0);
    const filteredOffChain = dataOffChainVotes?.filter(vote =>
      vote.proposal.toLowerCase().includes(partialText.toLowerCase())
    );
    setOffChainVotes(filteredOffChain?.length ? filteredOffChain : []);
    const filteredOnChain = dataOnChainVotes?.filter(vote =>
      vote.proposal.toLowerCase().includes(partialText.toLowerCase())
    );
    setOnChainVotes(filteredOnChain?.length ? filteredOnChain : []);

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
      showingVotes,
      changeOffset,
      allVotes,
      limit,
      offset,
    }),
    [
      offChainVotes,
      onChainVotes,
      isLoading,
      showingVotes,
      changeOffset,
      allVotes,
      limit,
      offset,
    ]
  );

  return (
    <VotesContext.Provider value={providerValue}>
      {children}
    </VotesContext.Provider>
  );
};

export const useVotes = () => useContext(VotesContext);
