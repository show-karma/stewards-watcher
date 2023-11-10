import { Flex } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import {
  formatNumber,
  formatNumberPercentage,
  getEndorsementsOfAddress,
} from 'utils';
import { IStats } from 'types';
import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';

interface Stats {
  title: string;
  amount: string;
  id: IStats;
}

export const StatsRow = () => {
  const { profileSelected } = useDelegates();
  const { daoInfo } = useDAO();
  const { config } = daoInfo;
  const [endorsementsNumber, setEndorsementsNumber] = useState(0);

  const getScore = () => {
    if (profileSelected?.gitcoinHealthScore)
      return formatNumber(profileSelected.gitcoinHealthScore);
    if (
      profileSelected?.karmaScore &&
      daoInfo.config.DAO_KARMA_ID !== 'gitcoin'
    )
      return formatNumber(profileSelected?.karmaScore);
    return '-';
  };
  const getScoreId = () => {
    if (profileSelected?.gitcoinHealthScore) return 'healthScore';
    return 'karmaScore';
  };

  const getEndorsements = async () => {
    if (!profileSelected?.address) return;
    const endorsements = await getEndorsementsOfAddress(
      profileSelected?.address,
      daoInfo.config.DAO_KARMA_ID
    );

    setEndorsementsNumber(endorsements.length);
  };

  const stats: Stats[] = [
    {
      title: 'Delegated Tokens',
      amount: profileSelected?.delegatedVotes
        ? formatNumber(profileSelected.delegatedVotes)
        : '-',
      id: 'delegatedVotes',
    },

    {
      title: 'Snapshot Percentage',
      amount: profileSelected?.voteParticipation.offChain
        ? `${profileSelected.voteParticipation.offChain}%`
        : '-',
      id: 'offChainVotesPct',
    },
    {
      title: 'On-chain votes',
      amount: profileSelected?.voteParticipation.onChain
        ? `${profileSelected.voteParticipation.onChain}%`
        : '-',
      id: 'onChainVotesPct',
    },
    {
      title: 'Total Delegators',
      amount: profileSelected?.delegatorCount
        ? formatNumber(profileSelected.delegatorCount)
        : '-',
      id: 'delegatorCount',
    },
    {
      title: 'Score',
      amount: getScore(),
      id: getScoreId(),
    },
    {
      title: 'Forum Score',
      amount: profileSelected?.forumActivity
        ? formatNumber(profileSelected.forumActivity)
        : '-',
      id: 'forumScore',
    },
    {
      title: 'Discord Score',
      amount: profileSelected?.discordScore
        ? formatNumber(profileSelected.discordScore)
        : '-',
      id: 'discordScore',
    },
    {
      title: 'Endorsements',
      amount: endorsementsNumber ? formatNumber(endorsementsNumber) : '-',
      id: 'endorsements',
    },
  ];

  const filteredCards = () => {
    if (!config) return [];
    const filtereds: Stats[] = [];

    stats.forEach(item => {
      if (config.EXCLUDED_CARD_FIELDS.includes(item.id)) return;
      filtereds.push(item);
    });
    if (
      filtereds.find(
        item => item.id === 'offChainVotesPct' || item.id === 'onChainVotesPct'
      ) &&
      !config.EXCLUDED_CARD_FIELDS.includes('delegatedVotes')
    ) {
      filtereds.push({
        title: 'Voting Weight',
        amount: profileSelected?.votingWeight
          ? `${formatNumberPercentage(profileSelected?.votingWeight)}`
          : '-',
        id: 'votingWeight',
      });
    }
    return filtereds;
  };

  const cardStats = filteredCards();

  useEffect(() => {
    getEndorsements();
  }, [profileSelected]);

  return (
    <Flex flexDir="row" flexWrap="wrap" gap="4" mb="6">
      {cardStats.map(
        item =>
          item.amount !== '-' &&
          item.amount && (
            <StatCard
              key={item.title}
              title={item.title}
              amount={item.amount}
            />
          )
      )}
    </Flex>
  );
};
