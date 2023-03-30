import { Flex, Grid, Icon, IconProps, Skeleton, Text } from '@chakra-ui/react';
import {
  FilledCheckIcon,
  FilledNoIcon,
  InfoIcon,
  ProposalsIcon,
  VotesIcon,
} from 'components/Icons';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO, useDelegates } from 'contexts';
import { useOffChainVotes, useOnChainVotes } from 'hooks';
import moment from 'moment';
import { FC, useMemo, useState } from 'react';
import { IChainRow, IDelegatingHistories } from 'types';
import { formatNumberPercentage, truncateAddress } from 'utils';

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
}

export const SinceDelegation: FC<ISinceDelegationProps> = ({
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
    proposalsCreated: '0',
    votesOnProposal: { total: '0', pct: '0' },
    passRate: '0',
    againstRate: '0',
  });

  const cardStats: IDelegationStats[] = [
    {
      icon: ProposalsIcon,
      value: delegationStats.proposalsCreated,
      description: 'Proposals created',
    },
    {
      icon: VotesIcon,
      value: delegationStats.votesOnProposal.total,
      description: `Votes on proposals (${delegationStats.votesOnProposal.pct})`,
    },
    {
      icon: FilledCheckIcon,
      value: delegationStats.passRate,
      description: `Pass rate on voted proposals`,
    },
    {
      icon: FilledNoIcon,
      value: delegationStats.againstRate,
      description: `of proposals voted on against`,
    },
  ];

  const votesCounter = (votes: IChainRow[]) => {
    let voteFor = 0;
    let voteAgainst = 0;

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
        if (/abstain/gi.test(vote.choice)) return;
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
      total: voteFor + voteAgainst,
      voteFor,
      voteAgainst,
    };
  };

  const getVotesSinceDate = () => {
    const votesInterval = {
      start: selectedDelegation.timestamp,
      end: moment().unix(),
    };

    const votesSince = allVotes.filter(vote => {
      const unixExecuted = moment(vote.executed).unix();
      if (
        unixExecuted >= votesInterval.start &&
        unixExecuted <= votesInterval.end
      )
        return true;
      return false;
    });
    const votesCounterResult = votesCounter(votesSince);

    setDelegationStats({
      proposalsCreated: votesSince.length.toString(),
      votesOnProposal: {
        total: votesCounterResult.total.toString(),
        pct: formatNumberPercentage(
          (votesCounterResult.total / votesSince.length) * 100
        ),
      },
      passRate: formatNumberPercentage(
        (votesCounterResult.voteFor / votesCounterResult.total) * 100
      ),
      againstRate: formatNumberPercentage(
        (votesCounterResult.voteAgainst / votesCounterResult.total) * 100
      ),
    });
    return votesSince;
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
      minH="360px"
      maxH="360px"
      bg={theme.tokenHolders.delegations.bg.primary}
      borderRadius="md"
      borderBottomRadius="none"
    >
      <Flex
        bg={theme.tokenHolders.delegations.bg.secondary}
        align="center"
        py="5"
        px="4"
        borderRadius="md"
        borderBottomRadius="none"
        gap="1"
        flexWrap="wrap"
      >
        <InfoIcon
          boxSize="16px"
          borderRadius="full"
          mr="1"
          color={theme.tokenHolders.delegations.text.primary}
        />
        <Text
          fontSize="14px"
          color={`${theme.tokenHolders.delegations.text.primary}BF`}
          fontWeight="light"
        >
          Since their delegation,{' '}
        </Text>
        <Flex gap="1" align="center">
          <ImgWithFallback
            boxSize="16px"
            fallback={userDelegatedTo.address}
            src={userDelegatedTo.picture}
            borderRadius="full"
          />
          <Text
            fontSize="md"
            color={theme.tokenHolders.delegations.text.primary}
            fontWeight="semibold"
          >
            {userDelegatedTo.name || truncateAddress(userDelegatedTo.address)}
          </Text>
        </Flex>
        <Text
          fontSize="14px"
          color={`${theme.tokenHolders.delegations.text.primary}BF`}
          fontWeight="light"
          as="span"
        >
          has
        </Text>
      </Flex>
      <Grid
        bg={theme.tokenHolders.delegations.bg.primary}
        columnGap="4"
        rowGap="2"
        px={{ base: '3', xl: '6' }}
        py="3"
        gridTemplateColumns="repeat(2, 1fr)"
      >
        {cardStats.map((stat, index) => (
          <Flex
            key={+index}
            flexDir="column"
            flex="48%"
            textAlign="center"
            align="center"
            py="4"
            px={{ base: '1', md: '2.5' }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={theme.tokenHolders.border}
            borderStyle="solid"
            bg={`${theme.tokenHolders.delegations.bg.quaternary}40`}
            position="relative"
            minWidth={{ base: '80px', sm: '100px', xl: '184px' }}
            minHeight={{ base: '100px' }}
            zIndex="0"
          >
            <Icon
              as={stat.icon}
              color={`${theme.tokenHolders.delegations.text.primary}20`}
              position="absolute"
              top="5%"
              width="95%"
              height="95%"
              zIndex="0"
            />
            <Flex w="full" h="full" flexDir="column" align="center" zIndex="1">
              <Icon
                as={stat.icon}
                color={`${theme.tokenHolders.delegations.text.primary}80`}
                mb="2.5"
                boxSize="32px"
              />
              <Skeleton isLoaded={!isLoading} minW="10" minH="5">
                <Text
                  fontWeight="semibold"
                  fontSize="xl"
                  color={theme.tokenHolders.delegations.text.primary}
                >
                  {stat.value}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} minW="10" minH="5">
                <Text
                  fontWeight="semibold"
                  fontSize="12px"
                  color={theme.tokenHolders.delegations.text.primary}
                >
                  {stat.description}
                </Text>
              </Skeleton>
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};
