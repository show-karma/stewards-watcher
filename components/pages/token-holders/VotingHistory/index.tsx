import {
  Button,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { DownChevron, VotingIcon } from 'components/Icons';
import { useDAO, useVotes } from 'contexts';
import { FC, useMemo, useState } from 'react';
import { IChainRow } from 'types';
import { formatNumber } from 'utils';
import { Navigation } from './Navigation';
import { ProposalVote } from './ProposalVote';
import { SearchProposalInput } from './SearchProposalInput';

interface IVotingHistory {
  address: string;
  timeframe: {
    from: number;
    to: number;
  };
}

export const VotingHistory: FC<IVotingHistory> = ({ address, timeframe }) => {
  const { theme } = useDAO();
  const {
    isLoading: voteLoading,
    showingVotes,
    allVotes,
    setupTimeframe,
    sortby,
    changeSort,
  } = useVotes();
  const [isLoading, setIsLoading] = useState(true);

  useMemo(() => {
    setupTimeframe(timeframe.from, timeframe.to);
  }, [timeframe]);

  const loadArray = Array.from({ length: 6 });

  useMemo(() => {
    setIsLoading(voteLoading);
  }, [voteLoading]);

  const loadRows = () =>
    loadArray.map((_, index) => (
      <ProposalVote
        vote={{} as IChainRow}
        key={+index}
        address={address}
        isLoading
        index={+index}
        isLast={index === showingVotes.length - 1}
      />
    ));

  const renderVotes = () => {
    if (!showingVotes.length)
      return (
        <Text
          color={
            theme.tokenHolders.delegations.card.columns.voting.proposals.title
          }
        >
          {`Contributor hasn't voted on any proposals yet`}
        </Text>
      );
    return showingVotes.map((vote, index) => (
      <ProposalVote
        key={+index}
        vote={vote}
        isLoading={false}
        address={address}
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
      w="full"
      px="4"
    >
      <Flex w="full" flexDir="column">
        <Flex
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          w="full"
          flexDir={{ base: 'column', md: 'row' }}
          flexWrap="wrap"
        >
          <Flex
            align="center"
            py="5"
            borderRadius="md"
            borderBottomRadius="none"
            gap="3"
            flexWrap="wrap"
          >
            <VotingIcon
              boxSize="32px"
              borderRadius="full"
              color={theme.tokenHolders.delegations.card.columns.icon.text}
            />
            <Text
              fontSize="11px"
              color={theme.tokenHolders.delegations.card.columns.text}
              fontWeight="700"
            >
              VOTING HISTORY
            </Text>
          </Flex>
          <SearchProposalInput />
        </Flex>
        <Flex zIndex="1001" flexDir="column">
          <Flex
            justify="space-between"
            gap={{ base: '1', md: '2' }}
            align="center"
            flexWrap="wrap"
            pt="6"
            pb="4"
          >
            <Text
              color={theme.tokenHolders.delegations.card.columns.voting.total}
              fontWeight="700"
              fontSize="sm"
            >
              {`Total proposals `}
              {allVotes.length ? (
                <Text
                  as="span"
                  color={
                    theme.tokenHolders.delegations.card.columns.voting
                      .totalNumber
                  }
                  fontWeight="normal"
                  fontSize="sm"
                >
                  ({formatNumber(allVotes.length)})
                </Text>
              ) : (
                ''
              )}
            </Text>
            <Flex gap="2" flexDir="row" align="center">
              <Text
                fontWeight="700"
                fontSize="14px"
                color={
                  theme.tokenHolders.delegations.card.columns.voting.proposals
                    .sort.text
                }
              >
                Sort by
              </Text>
              <Menu placement="bottom-end">
                <MenuButton
                  as={Button}
                  rightIcon={<DownChevron />}
                  borderWidth="1px"
                  borderColor={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .sort.border
                  }
                  borderStyle="solid"
                  fontWeight="400"
                  fontSize="14px"
                  color={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .sort.text
                  }
                  gap="5"
                >
                  {sortby}
                </MenuButton>
                <MenuList
                  borderWidth="1px"
                  borderColor={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .sort.border
                  }
                  borderStyle="solid"
                  bg={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .sort.bg
                  }
                  color={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .sort.text
                  }
                  minW="max-content"
                >
                  <MenuItem
                    bg={
                      theme.tokenHolders.delegations.card.columns.voting
                        .proposals.sort.bg
                    }
                    color={
                      theme.tokenHolders.delegations.card.columns.voting
                        .proposals.sort.text
                    }
                    onClick={() => changeSort('Date')}
                    _hover={{ opacity: 0.6 }}
                  >
                    Date
                  </MenuItem>
                  <MenuItem
                    bg={
                      theme.tokenHolders.delegations.card.columns.voting
                        .proposals.sort.bg
                    }
                    color={
                      theme.tokenHolders.delegations.card.columns.voting
                        .proposals.sort.text
                    }
                    onClick={() => changeSort('Choice')}
                    _hover={{ opacity: 0.6 }}
                  >
                    Choice
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          <Divider bgColor={`${theme.modal.votingHistory.divider}40`} />
          <Flex gap="0.5" flexDir="column">
            {isLoading ? loadRows() : renderVotes()}
          </Flex>
        </Flex>
        <Flex w="full" justify="center" py="4">
          <Navigation />
        </Flex>
      </Flex>
    </Flex>
  );
};
