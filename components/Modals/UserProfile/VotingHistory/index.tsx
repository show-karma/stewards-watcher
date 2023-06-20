import { Divider, Flex, Text } from '@chakra-ui/react';
import { useDAO, useVotes } from 'contexts';
import { FC, useMemo, useState } from 'react';

import { IChainRow, IProfile } from 'types';
import { formatNumber } from 'utils';
import { ContrarionIndexComponent } from './ContrarionIndex';
import { DelegatedVotesChanges } from './DelegatedVotesChanges';
import { Navigation } from './Navigation';
import { ProposalVote } from './ProposalVote';
import { SearchProposalInput } from './SearchProposalInput';
import { VotingBreakdown } from './VotingBreakdown';

interface IVotingHistory {
  profile: IProfile;
}

export const VotingHistory: FC<IVotingHistory> = ({ profile }) => {
  const { theme, daoInfo } = useDAO();
  const { isLoading: voteLoading, showingVotes, allVotes } = useVotes();
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
        index={+index}
        isLast={index === showingVotes.length - 1}
      />
    ));

  const renderVotes = () => {
    if (!showingVotes.length)
      return (
        <Text color={theme.modal.votingHistory.proposal.title}>
          {`Contributor hasn't voted on any proposals yet`}
        </Text>
      );
    return showingVotes.map((vote, index) => (
      <ProposalVote
        key={+index}
        vote={vote}
        isLoading={false}
        profile={profile}
        index={+index}
        isLast={index === showingVotes.length - 1}
      />
    ));
  };

  return (
    <Flex
      flexDir={{ base: 'column', lg: 'row' }}
      justify="space-between"
      pb="10"
      gap="4"
      align={{ base: 'center', lg: 'flex-start' }}
    >
      <Flex maxW={{ base: 'full', lg: '588px' }} w="full" flexDir="column">
        <Flex
          zIndex="1001"
          boxShadow={`0px 0px 18px 5px ${theme.modal.votingHistory.headline}0D`}
          flexDir="column"
        >
          <Flex
            justify="flex-start"
            gap={['2']}
            align="center"
            flexWrap="wrap"
            py="4"
            bg={`${theme.modal.background}40`}
            px="4"
          >
            <SearchProposalInput />
            <Text
              textColor={`${theme.modal.votingHistory.headline}40`}
              fontWeight="medium"
              fontSize="sm"
            >
              {`Total proposals: ${formatNumber(allVotes.length)}`}
            </Text>
          </Flex>
          <Divider bgColor={`${theme.modal.votingHistory.divider}40`} />
          <Flex
            gap="0.5"
            flexDir="column"
            bg={`${theme.modal.votingHistory.proposal.bg}40`}
          >
            {isLoading ? loadRows() : renderVotes()}
          </Flex>
        </Flex>
        <Flex w="full" justify="center" py="4">
          <Navigation />
        </Flex>
      </Flex>
      <Flex
        flexDir="column"
        align="center"
        gap="5"
        maxW={{ base: '330px', sm: '400px' }}
        w="full"
      >
        {daoInfo.config.EXCLUDED_CARD_FIELDS.includes(
          'offChainVotesPct'
        ) ? undefined : (
          <VotingBreakdown />
        )}
        <DelegatedVotesChanges />
        <ContrarionIndexComponent />
      </Flex>
    </Flex>
  );
};
