import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useEffect, useState } from 'react';
import { api } from 'helpers';
import { DelegateCompensationStats, DelegateStatsFromAPI } from 'types';
import { blo } from 'blo';
import { Table } from './Table';

export const DelegateCompensation = () => {
  const { theme, daoInfo } = useDAO();
  const { config } = daoInfo;
  const [delegates, setDelegates] = useState<DelegateCompensationStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDelegates = async () => {
      setIsLoading(true);
      try {
        // const response = await api.get(
        //   `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=200&offset=0&order=desc&field=delegatedVotes&period=30d&statuses=active`
        // );
        const response = await api.get(
          `/delegate/arbitrum/incentive-programs-stats`
        );
        if (!response.data.data.delegates)
          throw new Error('Error fetching delegates');
        const responseDelegates = response.data.data.delegates;
        if (responseDelegates.length === 0) {
          setDelegates([]);
          return;
        }
        const orderDelegates = responseDelegates.sort(
          (itemA: DelegateStatsFromAPI, itemB: DelegateStatsFromAPI) =>
            +itemB.stats.totalParticipation - +itemA.stats.totalParticipation
        );

        const parsedDelegates: DelegateCompensationStats[] = orderDelegates.map(
          (delegate: DelegateStatsFromAPI, index: number) => {
            const snapshotVoting = {
              rn: delegate.stats.snapshotVoting.rn.toString(),
              tn: delegate.stats.snapshotVoting.tn.toString(),
              score: delegate.stats.snapshotVoting.score.toString(),
            };
            const onChainVoting = {
              rn: delegate.stats.onChainVoting.rn.toString(),
              tn: delegate.stats.onChainVoting.tn.toString(),
              score: delegate.stats.onChainVoting.score.toString(),
            };
            const communicatingRationale = {
              rn: delegate.stats.communicatingRationale.rn.toString(),
              tn: delegate.stats.communicatingRationale.tn.toString(),
              score: delegate.stats.communicatingRationale.score.toString(),
            };

            const commentingProposal = {
              rn: delegate.stats.commentingProposal.rn.toString(),
              tn: delegate.stats.commentingProposal.tn.toString(),
              score: delegate.stats.commentingProposal.score.toString(),
            };
            const paymentARB = Math.round(
              +delegate.stats.totalParticipation >= 5000
                ? 5000
                : 5000 * (+delegate.stats.totalParticipation / 100)
            );

            return {
              delegate: delegate.stats.address,
              delegateImage: blo(delegate.stats.address as `0x${string}`),
              ranking: index + 1 <= 50 ? index + 1 : null,
              fundsARB: 5000,
              participationRate: delegate.stats.participationRate,
              snapshotVoting,
              onChainVoting,
              communicatingRationale,
              commentingProposal,
              totalParticipation: delegate.stats.totalParticipation,
              payment: paymentARB,
              bonusPoint: delegate.stats.bonusPoint.toString(),
            } as DelegateCompensationStats;
          }
        );
        setDelegates(parsedDelegates);
      } catch (error) {
        console.log(error);
        setDelegates([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDelegates();
  }, []);

  return (
    <Flex flexDir="row" w="full" gap="48px" py="10">
      <Flex flexDir="column" w="full" maxW="200px" gap="4">
        <Flex
          px="4"
          py="4"
          flexDir="column"
          bg={theme.card.background}
          borderRadius="2xl"
          w="full"
        >
          <Text>Delegates</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text>{delegates.length}</Text>
          </Skeleton>
        </Flex>
      </Flex>
      <Flex flex="1" w="full" flexDirection="column" gap="8">
        <Flex
          flexDirection="row"
          gap="4"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flexDirection="row" gap="4" alignItems="center">
            <Text color={theme.card.text} fontSize="lg">
              Month
            </Text>
            <Menu>
              <MenuButton
                w="max-content"
                bg={theme.filters.activeBg}
                as={Button}
              >
                January
              </MenuButton>
              <MenuList bg={theme.filters.bg}>
                <MenuItem bg={theme.filters.bg} _hover={{ opacity: 0.7 }}>
                  January
                </MenuItem>
                <MenuItem
                  disabled
                  isDisabled
                  bg={theme.filters.bg}
                  _disabled={{ opacity: 0.4 }}
                >
                  February
                </MenuItem>
                <MenuItem
                  disabled
                  isDisabled
                  bg={theme.filters.bg}
                  _disabled={{ opacity: 0.4 }}
                >
                  March
                </MenuItem>
                <MenuItem
                  disabled
                  isDisabled
                  bg={theme.filters.bg}
                  _disabled={{ opacity: 0.4 }}
                >
                  April
                </MenuItem>
                <MenuItem
                  disabled
                  isDisabled
                  bg={theme.filters.bg}
                  _disabled={{ opacity: 0.4 }}
                >
                  May
                </MenuItem>
                <MenuItem
                  disabled
                  isDisabled
                  bg={theme.filters.bg}
                  _disabled={{ opacity: 0.4 }}
                >
                  June
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" w="full">
            <Spinner w="32px" h="32px" />
          </Flex>
        ) : (
          <Table delegates={delegates} />
        )}
      </Flex>
    </Flex>
  );
};
