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
import { DelegateCompensationStats, IDelegateFromAPI } from 'types';
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
          `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=50&offset=0&order=desc&field=delegatedVotes&period=30d&statuses=active`
        );
        if (!response.data.data.delegates)
          throw new Error('Error fetching delegates');
        const responseDelegates = response.data.data.delegates;

        const parsedDelegates: DelegateCompensationStats[] =
          responseDelegates.map((delegate: IDelegateFromAPI, index: number) => {
            const PR = '20';
            const SV = {
              tn: 12,
              rn: 12,
              score: '15',
            };
            const TV = {
              tn: 10,
              rn: 10,
              score: '25',
            };
            const CR = {
              tn: 5,
              rn: 5,
              score: '25',
            };
            const CP = {
              tn: 5,
              rn: 5,
              score: '15',
            };
            const totalParticipation = '100';
            const paymentARB = 5000;
            const bonusPoint = 40;

            return {
              delegate:
                delegate.realName || delegate.ensName || delegate.publicAddress,
              delegateImage: delegate.profilePicture,
              ranking: index + 1,
              fundsARB: 5000,
              participationRate: PR,
              snapshotVoting: SV,
              onChainVoting: TV,
              communicatingRationale: CR,
              commentingProposal: CP,
              totalParticipation,
              payment: paymentARB,
              bonusPoint,
            } as DelegateCompensationStats;
          });
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
