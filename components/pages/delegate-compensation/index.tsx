import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spinner,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useEffect, useState } from 'react';
import { api } from 'helpers';
import { DelegateCompensationStats, DelegateStatsFromAPI } from 'types';
import { formatSimpleNumber } from 'utils';
import { Table } from './Table';

export const DelegateCompensation = () => {
  const { theme } = useDAO();
  const [delegates, setDelegates] = useState<DelegateCompensationStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlyOptIn, setOnlyOptIn] = useState(true);

  const [optInCounter, setOptInCounter] = useState<number | undefined>(
    undefined
  );
  const [powerfulDelegates, setPowerfulDelegates] = useState(0);

  const fetchDelegates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/delegate/arbitrum/incentive-programs-stats`,
        {
          params: {
            incentiveOptedIn: onlyOptIn || undefined,
          },
        }
      );
      if (!response.data.data.delegates)
        throw new Error('Error fetching delegates');
      const responseDelegates = response.data.data.delegates;
      if (onlyOptIn) {
        setOptInCounter(responseDelegates.length);
      }

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
            rn: formatSimpleNumber(delegate.stats.snapshotVoting.rn.toString()),
            tn: formatSimpleNumber(delegate.stats.snapshotVoting.tn.toString()),
            score: formatSimpleNumber(
              delegate.stats.snapshotVoting.score.toString()
            ),
          };
          const onChainVoting = {
            rn: formatSimpleNumber(delegate.stats.onChainVoting.rn.toString()),
            tn: formatSimpleNumber(delegate.stats.onChainVoting.tn.toString()),
            score: formatSimpleNumber(
              delegate.stats.onChainVoting.score.toString()
            ),
          };
          const communicatingRationale = {
            rn: formatSimpleNumber(
              delegate.stats.communicatingRationale.rn.toString()
            ),
            tn: formatSimpleNumber(
              delegate.stats.communicatingRationale.tn.toString()
            ),
            score: formatSimpleNumber(
              delegate.stats.communicatingRationale.score.toString()
            ),
          };

          const commentingProposal = {
            rn: formatSimpleNumber(
              delegate.stats.commentingProposal.rn.toString()
            ),
            tn: formatSimpleNumber(
              delegate.stats.commentingProposal.tn.toString()
            ),
            score: formatSimpleNumber(
              delegate.stats.commentingProposal.score.toString()
            ),
          };

          return {
            id: delegate.id,
            delegate: {
              publicAddress: delegate.publicAddress as `0x${string}`,
              name: delegate.name,
              profilePicture: delegate.profilePicture,
              shouldUse:
                delegate.name || delegate.ensName || delegate.publicAddress,
            },
            incentiveOptedIn: delegate.incentiveOptedIn,
            delegateImage: delegate.profilePicture,
            ranking: index + 1 <= 50 ? index + 1 : null,
            fundsARB: 5000,
            participationRate: delegate.stats.participationRate,
            snapshotVoting,
            onChainVoting,
            communicatingRationale,
            commentingProposal,
            totalParticipation: delegate.stats.totalParticipation,
            payment: formatSimpleNumber(delegate.stats.payment),
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
  useEffect(() => {
    fetchDelegates();
  }, [onlyOptIn]);

  useEffect(() => {
    const getPowerfulDelegates = async () => {
      try {
        const response = await api.get(
          `/delegate/arbitrum/incentive-programs-stats`,
          {
            params: {
              incentiveOptedIn: false,
            },
          }
        );
        if (!response.data.data.delegates) {
          setPowerfulDelegates(0);
          return;
        }
        const responseDelegates = response.data.data.delegates;
        setPowerfulDelegates(responseDelegates.length);
      } catch (error) {
        setPowerfulDelegates(0);
        console.log(error);
      }
    };
    getPowerfulDelegates();
  }, []);

  return (
    <Flex flexDir="row" w="full" gap="48px" py="10">
      <Flex flexDir="column" w="full" maxW="220px" gap="4">
        <Flex
          px="4"
          py="4"
          flexDir="column"
          bg={theme.card.background}
          borderRadius="2xl"
          w="full"
        >
          <Text>Delegates opted-in</Text>
          <Skeleton isLoaded={optInCounter !== undefined}>
            <Text>{formatSimpleNumber(optInCounter || 0)}</Text>
          </Skeleton>
        </Flex>
        <Flex
          px="4"
          py="4"
          flexDir="column"
          bg={theme.card.background}
          borderRadius="2xl"
          w="full"
        >
          <Text>{`Delegates with >50k VP`}</Text>
          <Skeleton isLoaded={!!powerfulDelegates}>
            <Text>{formatSimpleNumber(powerfulDelegates)}</Text>
          </Skeleton>
        </Flex>
      </Flex>
      <Flex flex="1" w="full" flexDirection="column" gap="8">
        <Flex
          flexDirection="row"
          gap="4"
          alignItems="center"
          justifyContent="flex-start"
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
          <Switch
            display="flex"
            defaultChecked={onlyOptIn}
            onChange={event => {
              setOnlyOptIn(event.target.checked);
            }}
            alignItems="center"
            gap="1"
            id="only-opt-in"
          >
            Show only opt-in
          </Switch>
        </Flex>
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" w="full">
            <Spinner w="32px" h="32px" />
          </Flex>
        ) : (
          <Table delegates={delegates} refreshFn={fetchDelegates} />
        )}
      </Flex>
    </Flex>
  );
};
