import { Divider, Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates, useVotes } from 'contexts';
import { useOnChainVotes, useOffChainVotes } from 'hooks';
import moment from 'moment';
import { FC, useMemo, useState } from 'react';

import { IChainRow, IProfile } from 'types';
import { Navigation } from './Navigation';
import { ProposalVote } from './ProposalVote';
import { SearchProposalInput } from './SearchProposalInput';

interface IVotingHistory {
  profile: IProfile;
}

export const VotingHistory: FC<IVotingHistory> = ({ profile }) => {
  const { theme } = useDAO();
  const { isLoading: voteLoading, offChainVotes, onChainVotes } = useVotes();
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

  const loadArray = Array.from({ length: 6 });

  useMemo(() => {
    setIsLoading(voteLoading);
  }, [voteLoading]);

  return (
    <Flex flexDir="column">
      <Flex
        justify="space-between"
        gap={['2', '4']}
        align="center"
        flexWrap="wrap"
        py="3"
      >
        <Text
          textColor={theme.modal.votingHistory.headline}
          fontWeight="medium"
          fontSize="xl"
        >
          Voting History
        </Text>
        <SearchProposalInput />
      </Flex>
      <Divider bgColor={theme.modal.votingHistory.divider} />
      <Flex gap="5" flexDir="column" pt="8" pb="4">
        {isLoading
          ? loadArray.map((_, index) => (
              <ProposalVote
                vote={{} as IChainRow}
                key={+index}
                profile={profile}
                isLoading
              />
            ))
          : showingVotes.map((vote, index) => (
              <ProposalVote
                key={+index}
                vote={vote}
                isLoading={false}
                profile={profile}
              />
            ))}
      </Flex>
      <Flex w="full" justify="end" pb="9">
        <Navigation
          allVotes={allVotes}
          limit={limit}
          offset={offset}
          changeOffset={changeOffset}
        />
      </Flex>
    </Flex>
  );
};
