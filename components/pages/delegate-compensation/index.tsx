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
import { useRouter } from 'next/router';
import { DownChevron } from 'components/Icons';
import { Table } from './Table';

export const DelegateCompensation = () => {
  const { theme } = useDAO();
  const [delegates, setDelegates] = useState<DelegateCompensationStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlyOptIn, setOnlyOptIn] = useState(true);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(() => {
    const queryString = router.asPath.split('?')[1];
    const monthQuery = queryString?.match(/(?<=month=)[^&]*/i)?.[0];
    const yearQuery = Number(queryString?.match(/(?<=year=)[^&]*/i)?.[0]);
    const date = new Date('2024-09-03');
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    if (monthQuery) {
      const year = yearQuery || currentYear;
      const queryDate = new Date(`${monthQuery} 1, ${year}`);
      const queryMonth = queryDate.getMonth() + 1;
      if (queryMonth > currentMonth) {
        return {
          name: date.toLocaleString('en-US', { month: 'long' }),
          value: {
            month: currentMonth,
            year: currentYear,
          },
        };
      }
      return {
        name: new Date(year, queryMonth - 1, 1).toLocaleString('en-US', {
          month: 'long',
        }),
        value: {
          month: queryMonth,
          year,
        },
      };
    }
    return {
      name: date.toLocaleString('en-US', { month: 'long' }),
      value: {
        month: currentMonth,
        year: currentYear,
      },
    };
  });

  const [optInCounter, setOptInCounter] = useState<number | undefined>(
    undefined
  );
  const [loadingOptInCounter, setLoadingOptInCounter] = useState(false);
  const [powerfulDelegates, setPowerfulDelegates] = useState(0);

  const fetchDelegates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/delegate/arbitrum/incentive-programs-stats`,
        {
          params: {
            incentiveOptedIn: onlyOptIn || undefined,
            month: selectedDate?.value.month || undefined,
            year: selectedDate?.value.year || undefined,
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
            breakdown: delegate.stats.communicatingRationale.breakdown,
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
            participationRatePercent: +delegate.stats.participationRatePercent,
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
    const getOptInCounter = async () => {
      setLoadingOptInCounter(true);

      try {
        const response = await api.get(
          `/delegate/arbitrum/incentive-programs-stats`,
          {
            params: {
              incentiveOptedIn: true,
              month: selectedDate?.value.month || undefined,
              year: selectedDate?.value.year || undefined,
            },
          }
        );
        if (!response.data.data.delegates) {
          setOptInCounter(0);
          return;
        }
        const responseDelegates = response.data.data.delegates;
        setOptInCounter(responseDelegates.length);
      } catch (error) {
        setOptInCounter(0);
        console.log(error);
      } finally {
        setLoadingOptInCounter(false);
      }
    };
    getOptInCounter();
    fetchDelegates();
  }, [onlyOptIn, selectedDate]);

  useEffect(() => {
    const getPowerfulDelegates = async () => {
      try {
        const response = await api.get(
          `/delegate/arbitrum/incentive-programs-stats`,
          {
            params: {
              incentiveOptedIn: false,
              month: selectedDate?.value.month || undefined,
              year: selectedDate?.value.year || undefined,
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
  }, [selectedDate]);

  const { rootPathname } = useDAO();

  const renderMonthList = () => {
    const supportedDates = [];
    const startYear = 2024;
    const currentDate = new Date();

    for (let year = startYear; year <= currentDate.getFullYear(); year += 1) {
      for (let month = 0; month < 12; month += 1) {
        if ((month === 0 && year === 2024) || (month === 1 && year === 2024)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (
          year === currentDate.getFullYear() &&
          month > currentDate.getMonth()
        ) {
          break;
        }
        supportedDates.push({
          name: new Date(year, month, 1).toLocaleString('en-US', {
            month: 'long',
          }),
          value: {
            month: month + 1,
            year,
          },
        });
      }
    }

    return supportedDates.map(itemDate => (
      <MenuItem
        key={itemDate.name}
        bg={theme.filters.bg}
        _hover={{ opacity: 0.7 }}
        onClick={() => {
          setSelectedDate({
            name: itemDate.name,
            value: itemDate.value,
          });
          router.push(
            {
              pathname: `/${rootPathname}/delegate-compensation`,
              query: {
                month: itemDate.name.toLowerCase(),
                year: itemDate.value.year,
              },
            },
            undefined,
            { shallow: true }
          );
        }}
      >
        {itemDate.name} {itemDate.value.year}
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
          alignItems="center"
        >
          <Text>Delegates opted-in</Text>
          <Skeleton isLoaded={!loadingOptInCounter}>
            <Text fontSize="40px">{formatSimpleNumber(optInCounter || 0)}</Text>
          </Skeleton>
        </Flex>
        <Flex
          px="4"
          py="4"
          flexDir="column"
          bg={theme.card.background}
          borderRadius="2xl"
          w={{ base: 'full', sm: '220px', lg: 'full' }}
          alignItems="center"
        >
          <Text>{`Delegates with >50k VP`}</Text>
          <Skeleton isLoaded={!!powerfulDelegates}>
            <Text fontSize="40px">{formatSimpleNumber(powerfulDelegates)}</Text>
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
                borderWidth="1px"
                borderStyle="solid"
                borderColor={theme.card.interests.text}
                rightIcon={
                  <DownChevron
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxSize="4"
                  />
                }
              >
                {selectedDate?.name} {selectedDate?.value.year}
              </MenuButton>
              <MenuList
                _hover={{
                  opacity: 0.7,
                }}
                bg={theme.filters.bg}
                maxH={300}
                overflowY="auto"
              >
                {renderMonthList()}
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
