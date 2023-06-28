import { Flex, Grid, Icon, IconProps, Skeleton, Text } from '@chakra-ui/react';
import {
  PassRateIcon,
  StatsIcon,
  VotedNoIcon,
  VotedProposalsIcon,
} from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { useOffChainVotes, useOnChainVotes } from 'hooks';
import moment from 'moment';
import { FC, useMemo, useState } from 'react';
import { IChainRow, IDelegatingHistories } from 'types';
import { formatNumber, formatNumberPercentage } from 'utils';

interface ISinceDelegationProps {
  userDelegatedTo: {
    name?: string;
    address: string;
    picture?: string;
  };
  selectedDelegation: IDelegatingHistories;
  delegations: IDelegatingHistories[];
}

interface IDelegationStats {
  icon: (props: IconProps) => JSX.Element;
  value: string;
  description: string;
  showTotal?: boolean;
}

export const PerformanceStats: FC<ISinceDelegationProps> = ({
  userDelegatedTo,
  selectedDelegation,
  delegations,
}) => {
  const { theme } = useDAO();
  const { voteInfos } = useDelegates();

  const { data: dataOffChainVotes } = useOffChainVotes(
    voteInfos.snapshotIds,
    userDelegatedTo.address
  );
  const { data: dataOnChainVotes } = useOnChainVotes(
    voteInfos.onChainId,
    userDelegatedTo.address
  );
  const [offChainVotes, setOffChainVotes] = useState<IChainRow[] | undefined>(
    undefined
  );
  const [onChainVotes, setOnChainVotes] = useState<IChainRow[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  const allVotes = useMemo(
    () =>
      (offChainVotes || [])
        .concat(onChainVotes || [])
        .sort((voteA, voteB) =>
          moment(voteA.executed).isBefore(voteB.executed) ? 1 : -1
        ) || [],
    [onChainVotes, offChainVotes]
  );

  const setupVotes = () => {
    setIsLoading(true);
    setOnChainVotes(dataOnChainVotes || []);
    setOffChainVotes(dataOffChainVotes || []);
    setIsLoading(false);
  };

  useMemo(() => {
    if (dataOffChainVotes && dataOnChainVotes) setupVotes();
  }, [dataOffChainVotes, dataOnChainVotes]);

  const [delegationStats, setDelegationStats] = useState({
    votedProposals: '0',
    totalProposals: '0',
    passRate: '0',
    votedNo: '0',
    votingPct: '0',
  });

  const cardStats: IDelegationStats[] = [
    {
      icon: VotedProposalsIcon,
      value: delegationStats.votingPct,
      description: 'Voting Percentage',
    },
    {
      icon: PassRateIcon,
      value: delegationStats.passRate,
      description: `Pass rate on voted proposals`,
    },
    {
      icon: VotedProposalsIcon,
      value: delegationStats.votedProposals,
      description: 'Voted proposals',
      showTotal: true,
    },
    {
      icon: VotedNoIcon,
      value: delegationStats.votedNo,
      description: `Voted no`,
      showTotal: true,
    },
  ];

  const votesCounter = (votes: IChainRow[]) => {
    let voteFor = 0;
    let voteAgainst = 0;
    let voteAbstain = 0;

    votes.forEach(vote => {
      if (typeof vote === 'undefined') {
        return;
      }
      if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string') {
        if (/not vote/gi.test(vote.choice)) return;
        if (
          vote.choice.toLocaleLowerCase().substring(0, 2) === 'no' ||
          /agai+nst/gi.test(vote.choice.toLocaleLowerCase())
        ) {
          voteAgainst += 1;
          return;
        }
        if (/abstain/gi.test(vote.choice)) {
          voteAbstain += 1;
          return;
        }
        voteFor += 1;
        return;
      }
      if (vote.choice === 0) {
        voteAgainst += 1;
        return;
      }
      if (vote.choice === 1) {
        voteFor += 1;
      }
    });
    return {
      total: voteFor + voteAgainst + voteAbstain,
      voteFor,
      voteAgainst,
      voteAbstain,
    };
  };

  const getVotesSinceDate = () => {
    const votesInterval = {
      start: selectedDelegation.timestamp,
      end: moment().unix(),
    };

    const proposalsSince = allVotes.filter(vote => {
      const unixExecuted = moment(vote.executed).unix();
      if (
        unixExecuted >= votesInterval.start &&
        unixExecuted <= votesInterval.end
      )
        return true;
      return false;
    });
    const votesCounterResult = votesCounter(proposalsSince);

    setDelegationStats({
      totalProposals: formatNumber(proposalsSince.length.toString()),
      votedProposals: formatNumber(votesCounterResult.total.toString()),
      passRate: formatNumberPercentage(
        (votesCounterResult.voteFor / votesCounterResult.total) * 100
      ),
      votingPct: formatNumberPercentage(
        (votesCounterResult.total / proposalsSince.length) * 100
      ),
      votedNo: formatNumber(votesCounterResult.voteAgainst.toString()),
    });
    return proposalsSince;
  };

  useMemo(() => {
    if (allVotes.length) getVotesSinceDate();
  }, [allVotes]);

  return (
    <Flex
      flexDir="column"
      w={{ base: 'full' }}
      minW={{ base: 'full', lg: 'max-content' }}
      maxW={{ base: '100%', lg: '50%' }}
      h="full"
      bg={theme.tokenHolders.delegations.bg.primary}
      borderRadius="md"
      borderBottomRadius="none"
    >
      <Flex
        align="center"
        py="5"
        px="4"
        borderRadius="md"
        borderBottomRadius="none"
        gap="3"
        flexWrap="wrap"
      >
        <StatsIcon
          boxSize="32px"
          borderRadius="full"
          color={theme.tokenHolders.delegations.card.columns.icon.text}
        />
        <Text
          fontSize="11px"
          color={theme.tokenHolders.delegations.card.columns.text}
          fontWeight="700"
        >
          PERFORMANCE STATS
        </Text>
      </Flex>
      <Grid
        bg={theme.tokenHolders.delegations.bg.primary}
        columnGap="4"
        rowGap="4"
        px={{ base: '3', xl: '6' }}
        py="3"
        gridTemplateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        maxWidth="452"
      >
        {cardStats.map((stat, index) => (
          <Flex
            key={+index}
            flexDir="column"
            flex="48%"
            align="center"
            py="4"
            px={{ base: '1', md: '2.5' }}
            borderRadius="4px"
            borderWidth="1px"
            borderColor={
              theme.tokenHolders.delegations.card.columns.stats.border
            }
            borderStyle="solid"
            borderLeftColor={
              theme.tokenHolders.delegations.card.columns.stats.leftBorder
            }
            borderLeftWidth="5px"
            bg="transparent"
            position="relative"
            minWidth={{ base: '80px', sm: '100px', xl: '218px' }}
            maxWidth="100%"
            minHeight={{ base: '100px' }}
            zIndex="0"
            textAlign="left"
          >
            <Flex
              w="full"
              h="full"
              flexDir="row"
              align="center"
              zIndex="1"
              gap="2"
            >
              <Icon
                as={stat.icon}
                color={
                  theme.tokenHolders.delegations.card.columns.stats.leftBorder
                }
                m="2"
                boxSize="24px"
              />
              <Flex flexDir="column" align="flex-start">
                <Skeleton isLoaded={!isLoading} minW="5" minH="5">
                  <Text
                    fontWeight="800"
                    fontSize="20px"
                    color={
                      theme.tokenHolders.delegations.card.columns.stats.primary
                    }
                  >
                    {`${stat.value}${
                      stat.showTotal ? `/${delegationStats.totalProposals}` : ''
                    }`}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} minW="10" minH="5">
                  <Text
                    fontWeight="400"
                    fontSize="14px"
                    color={
                      theme.tokenHolders.delegations.card.columns.stats
                        .secondary
                    }
                  >
                    {stat.description}
                  </Text>
                </Skeleton>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};
