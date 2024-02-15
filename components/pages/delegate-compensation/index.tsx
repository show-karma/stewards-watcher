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
  const [month, setMonth] = useState(() => {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    return {
      name: date.toLocaleString('default', { month: 'long' }),
      value: currentMonth,
    };
  });

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
            month: month?.value || undefined,
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
            votingPower: +delegate.votingPower,
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
  }, [onlyOptIn, month]);

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

  const renderMonthList = () => {
    const allMonths = Array.from(
      { length: +new Date().getMonth() + 1 },
      (_, indx) => ({
        name: new Date(2022, indx, 1).toLocaleString('default', {
          month: 'long',
        }),
        value: indx + 1,
      })
    );

    return allMonths.map(listMonth => (
      <MenuItem
        key={listMonth.value}
        bg={theme.filters.bg}
        _hover={{ opacity: 0.7 }}
        onClick={() => {
          setMonth(listMonth);
        }}
      >
        {listMonth.name}
      </MenuItem>
    ));
  };

  return (
    <Flex
      flexDir={{ base: 'column', lg: 'row' }}
      w="full"
      gap={{ base: '24px', '2xl': '48px' }}
      py="10"
    >
      <Flex
        flexDir={{ base: 'row', lg: 'column' }}
        w="full"
        maxW={{ base: 'full', lg: '220px' }}
        gap="4"
        paddingX={{ base: '2', lg: '0' }}
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        <Flex
          px="4"
          py="4"
          flexDir="column"
          bg={theme.card.background}
          borderRadius="2xl"
          w={{ base: 'full', sm: '220px', lg: 'full' }}
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
          w={{ base: 'full', sm: '220px', lg: 'full' }}
        >
          <Text>{`Delegates with >50k VP`}</Text>
          <Skeleton isLoaded={!!powerfulDelegates}>
            <Text>{formatSimpleNumber(powerfulDelegates)}</Text>
          </Skeleton>
        </Flex>
      </Flex>
      <Flex
        paddingX={{ base: '2', lg: '0' }}
        flex="1"
        w="full"
        overflowX="auto"
        flexDirection="column"
        gap={{ base: '4', lg: '8' }}
      >
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
                {month.name}
              </MenuButton>
              <MenuList bg={theme.filters.bg}>{renderMonthList()}</MenuList>
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
