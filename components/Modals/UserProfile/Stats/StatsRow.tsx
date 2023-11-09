import { Flex } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import {
  AttestationSchema,
  EASAttestation,
  easDelegateEndorseDictionary,
  formatNumber,
  formatNumberPercentage,
  getEASChainInfo,
} from 'utils';
import { IStats } from 'types';
import { useEffect, useState } from 'react';
import { easQueryWithAddress } from 'helpers';
import axios from 'axios';
import { getAddress } from 'viem';
import { AttestationResponse } from 'types/eas';
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
    const projectEnvironment = process.env.NEXT_PUBLIC_ENV || 'dev';
    const chainsInfo = easDelegateEndorseDictionary[projectEnvironment];

    if (!chainsInfo) {
      return;
    }

    const results: EASAttestation<AttestationSchema>[] = [];

    const fetchAttestations = async (chain: string) => {
      try {
        const checkSumAddress = getAddress(profileSelected?.address as string);
        const response = await axios.post<AttestationResponse>(
          chainsInfo[chain].easAPI,
          {
            query: easQueryWithAddress(
              getEASChainInfo(daoInfo.config.DAO_KARMA_ID).schemaId,
              checkSumAddress
            ),
          }
        );

        const schema = response.data?.data?.schema;
        if (schema && schema.attestations) {
          let uniqueAttestations: EASAttestation<AttestationSchema>[] = [];
          const uniqueAttesters: string[] = [];
          schema.attestations.forEach(attestation => {
            const easAttestation = new EASAttestation<AttestationSchema>(
              attestation
            );
            if (!uniqueAttesters.includes(easAttestation.attester)) {
              uniqueAttestations.push(easAttestation);
              uniqueAttesters.push(easAttestation.attester);
            } else {
              const lastAttest = schema.attestations.reduce(
                (lastAttestation, searchAttestation) => {
                  if (
                    attestation.attester === searchAttestation.attester &&
                    attestation.timeCreated >= searchAttestation.timeCreated
                  ) {
                    return searchAttestation;
                  }
                  return lastAttestation;
                }
              );
              if (lastAttest) {
                const filteredArray = uniqueAttestations.filter(
                  item =>
                    item.attester.toLowerCase() !==
                    attestation.attester.toLowerCase()
                );
                const newAttestation = new EASAttestation<AttestationSchema>(
                  lastAttest
                );
                filteredArray.push(newAttestation);
                uniqueAttestations = filteredArray;
              }
            }
          });

          results.push(...uniqueAttestations);
        }
      } catch (error) {
        console.error('Error fetching attestation data:', error);
      }
    };

    const chainPromises = Object.keys(chainsInfo).map(chain =>
      fetchAttestations(chain)
    );
    await Promise.all(chainPromises);

    const filteredResults = await Promise.all(results);

    setEndorsementsNumber(filteredResults.length);
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
