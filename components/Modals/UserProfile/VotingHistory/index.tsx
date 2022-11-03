import { Divider, Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { useOnChainVotes, useOffChainVotes } from 'hooks';
import moment from 'moment';
import { FC, useMemo, useState } from 'react';

import { IProfile } from 'types';
import { Navigation } from './Navigation';
import { ProposalVote } from './ProposalVote';

interface IVotingHistory {
  profile: IProfile;
}

export const VotingHistory: FC<IVotingHistory> = ({ profile }) => {
  const { theme } = useDAO();
  const { voteInfos } = useDelegates();

  const [offset, setOffset] = useState(0);
  const limit = 6;
  const { isLoading: isOffVotesLoading, data: offChainVotes } =
    useOffChainVotes(voteInfos.snapshotIds, profile.address);
  const { isLoading: isOnVotesLoading, data: onChainVotes } = useOnChainVotes(
    voteInfos.onChainId,
    profile.address
  );

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

  const isLoading = isOffVotesLoading || isOnVotesLoading;

  const loadArray = Array.from({ length: 6 });

  return (
    <Flex flexDir="column">
      <Text
        py="3"
        textColor={theme.modal.votingHistory.headline}
        fontWeight="medium"
        fontSize="xl"
      >
        Voting History
      </Text>
      <Divider bgColor={theme.modal.votingHistory.divider} />
      <Flex gap="5" flexDir="column" pt="8" pb="4">
        {isLoading
          ? loadArray.map((_, index) => <ProposalVote key={+index} isLoading />)
          : showingVotes.map((vote, index) => (
              <ProposalVote key={+index} vote={vote} isLoading={false} />
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
