import { Divider, Flex, Text } from '@chakra-ui/react';
import { useDAO, useVotes } from 'contexts';
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
  const { isLoading: voteLoading, showingVotes } = useVotes();
  const [isLoading, setIsLoading] = useState(true);

  const loadArray = Array.from({ length: 6 });

  useMemo(() => {
    setIsLoading(voteLoading);
  }, [voteLoading]);

  const loadRows = () =>
    loadArray.map((_, index) => (
      <ProposalVote
        vote={{} as IChainRow}
        key={+index}
        profile={profile}
        isLoading
      />
    ));

  const renderVotes = () => {
    if (!showingVotes.length)
      return (
        <Text color={theme.modal.votingHistory.proposal.title}>
          No proposals found.
        </Text>
      );
    return showingVotes.map((vote, index) => (
      <ProposalVote
        key={+index}
        vote={vote}
        isLoading={false}
        profile={profile}
      />
    ));
  };

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
        {isLoading ? loadRows() : renderVotes()}
      </Flex>
      <Flex w="full" justify="end" pb="9">
        <Navigation />
      </Flex>
    </Flex>
  );
};
