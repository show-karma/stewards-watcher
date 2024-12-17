import {
  Flex,
  Icon,
  Image,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ChakraLink } from 'components/ChakraLink';
import { DiscordIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { FaTelegram } from 'react-icons/fa';
import { DelegateCompensationStats } from 'types';
import { formatNumber, formatSimpleNumber } from 'utils';
import { fetchDelegates } from 'utils/delegate-compensation/fetchDelegates';
import { HeaderCarousel } from '../../../Carousels';
import { ScoringSystemAccordion } from './Accordion';
import { ScoringSystemModal } from './ScoringSystemModal';

type CardProps = {
  iconUrl: string;
  iconBg?: string;
  title: string;
  value: string;
  isLoading?: boolean;
};

const Card = ({ iconUrl, iconBg, title, value, isLoading }: CardProps) => {
  const { theme } = useDAO();
  return (
    <Flex
      bg={theme.compensation?.performanceOverview.header.bg.card}
      flexDir="column"
      alignItems="start"
      gap={['3', '4']}
      px={{ base: '3', '2xl': '5' }}
      py={{ base: '5' }}
      borderRadius="8px"
      w={['max-content']}
      minW={{ base: '240px', xl: '210px' }}
      flex={{ base: 'none', xl: '1' }}
      h={{ base: '136px', sm: '160px', xl: '184px' }}
    >
      <Flex
        bg={iconBg}
        borderRadius="4px"
        p="2"
        width="40px"
        height="40px"
        alignItems="center"
        justifyContent="center"
      >
        <Image alt={title} src={iconUrl} width="24px" height="24px" />
      </Flex>
      <Flex flexDir="column" alignItems="start" gap={['1', '2']}>
        <Text
          color={theme.compensation?.performanceOverview.header.text}
          fontSize="16px"
          fontWeight="600"
        >
          {title}
        </Text>
        <Skeleton w="full" minH="24px" isLoaded={!isLoading}>
          <Text
            color={theme.compensation?.performanceOverview.header.text}
            fontSize="24px"
            fontWeight="700"
          >
            {value}
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  );
};

export const DelegatePerformanceOverviewHeader = () => {
  const { selectedDate } = useDelegateCompensation();
  const { theme, daoInfo } = useDAO();
  const { isOpen, onToggle } = useDisclosure();

  const { data: optInDelegates, isLoading: isLoadingOptInDelegates } = useQuery(
    {
      queryKey: [
        'optInCounter',
        daoInfo.config.DAO_KARMA_ID,
        selectedDate?.value.month,
        selectedDate?.value.year,
      ],
      queryFn: () =>
        fetchDelegates(
          daoInfo.config.DAO_KARMA_ID,
          true,
          selectedDate?.value.month as number,
          selectedDate?.value.year as number,
          true
        ),
      enabled:
        !!daoInfo.config.DAO_KARMA_ID &&
        !!selectedDate?.value.month &&
        !!selectedDate?.value.year,
    }
  );

  const optInCounter = optInDelegates?.length;

  const powerfulDelegates =
    optInDelegates?.filter(
      (delegate: any) => delegate.votingPower && +delegate.votingPower >= 50000
    )?.length || 0;

  const {
    data: delegates,
    isLoading: isDelegatesLoading,
    isFetching: isDelegatesFetching,
  } = useQuery<DelegateCompensationStats[]>({
    queryKey: [
      'delegate-compensation',
      daoInfo.config.DAO_KARMA_ID,
      selectedDate?.value.month,
      selectedDate?.value.year,
      true,
    ],
    queryFn: () =>
      fetchDelegates(
        daoInfo.config.DAO_KARMA_ID,
        true,
        selectedDate?.value.month as number,
        selectedDate?.value.year as number
      ),
    enabled:
      !!selectedDate?.value.month &&
      !!selectedDate?.value.year &&
      !!daoInfo.config.DAO_KARMA_ID,
  });

  const averageParticipationRate = delegates?.length
    ? delegates.reduce((acc, delegate) => {
        const participationRate = delegate.stats?.participationRate
          ? parseFloat(delegate.stats.participationRate)
          : 0;
        return acc + participationRate;
      }, 0) / delegates.length
    : 0;

  const averageVotingPower = delegates?.length
    ? delegates.reduce((acc, delegate) => {
        const currentVotingPower = delegate.votingPower
          ? delegate.votingPower
          : 0;
        return acc + currentVotingPower;
      }, 0) / delegates.length
    : 0;

  const dataPoints = [
    {
      iconUrl: '/icons/delegate-compensation/check.png',
      iconBg: theme.compensation?.performanceOverview.header.bg.optedIn,
      title: 'Delegates Opted in',
      value: formatSimpleNumber(optInCounter || 0),
      isLoading: isLoadingOptInDelegates,
    },
    {
      iconUrl: '/icons/delegate-compensation/trophy.png',
      iconBg:
        theme.compensation?.performanceOverview.header.bg.greaterThan50kVP,
      title: 'Delegates with >50k VP',
      value: formatSimpleNumber(powerfulDelegates || 0),
      isLoading: isLoadingOptInDelegates,
    },
    {
      iconUrl: '/icons/delegate-compensation/lookUp.png',
      iconBg:
        theme.compensation?.performanceOverview.header.bg
          .averageParticipationRate,
      title: 'Average Participation Rate',
      value: formatSimpleNumber(averageParticipationRate || 0),
      isLoading: isDelegatesLoading || !averageParticipationRate,
    },
    {
      iconUrl: '/icons/delegate-compensation/flexArm.png',
      iconBg:
        theme.compensation?.performanceOverview.header.bg.averageVotingPower,
      title: 'Average Voting Power',
      value: formatNumber(averageVotingPower || 0),
      isLoading: isDelegatesLoading || !averageVotingPower,
    },
  ];
  return (
    <Flex
      flexDir="column"
      alignItems="flex-start"
      gap={{ base: '2', '2xl': '5' }}
    >
      {selectedDate ? (
        <Text fontSize="24px" fontWeight="600">
          {selectedDate.name} {selectedDate.value.year}
        </Text>
      ) : null}
      <Flex
        flexDir="row"
        alignItems="center"
        gap={{ base: '2', '2xl': '5' }}
        w="full"
        justifyContent="space-between"
        display={{ base: 'none', xl: 'flex' }}
        flexWrap="wrap"
      >
        {dataPoints.map(dataPoint => (
          <Card key={dataPoint.title} {...dataPoint} />
        ))}
        <Flex
          bg={theme.compensation?.performanceOverview.header.bg.card}
          flexDir="column"
          alignItems="start"
          gap="4"
          px={{ base: '3', '2xl': '5' }}
          py={{ base: '5' }}
          borderRadius="8px"
          w="210px"
          h="184px"
        >
          <Flex
            bg={theme.compensation?.performanceOverview.header.bg.discord}
            borderRadius="4px"
            p="2"
            width="40px"
            height="40px"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaTelegram} width="24px" height="24px" color="white" />
          </Flex>
          <Flex flexDir="column" alignItems="start" gap="2">
            <Text
              color={theme.compensation?.performanceOverview.header.text}
              fontSize="16px"
              fontWeight="600"
            >
              Got questions or feedback? Message us on{' '}
              <ChakraLink
                isExternal
                href="https://t.me/karmahq"
                color="#155EEF"
                textDecor="underline"
              >
                Telegram
              </ChakraLink>
            </Text>
          </Flex>
        </Flex>
        <Flex
          bg={theme.compensation?.performanceOverview.header.bg.card}
          flexDir="column"
          alignItems="start"
          gap={['3', '4']}
          px={{ base: '3', '2xl': '5' }}
          py={{ base: '5' }}
          borderRadius="8px"
          w="210px"
          h="184px"
        >
          <Flex
            bg={theme.compensation?.performanceOverview.header.bg.scoringSystem}
            borderRadius="4px"
            p="1"
            width="40px"
            height="40px"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              alt="Learn how Scoring System works"
              src="/icons/delegate-compensation/brain.png"
              width="32px"
              height="32px"
            />
          </Flex>
          <Flex flexDir="column" alignItems="start" gap="2">
            <Text
              color={theme.compensation?.performanceOverview.header.text}
              fontSize="16px"
              fontWeight="600"
              textDecor="underline"
              onClick={onToggle}
              cursor="pointer"
            >
              Learn how Scoring System works
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex display={{ base: 'flex', xl: 'none' }} w="full">
        <HeaderCarousel
          items={dataPoints
            .map(stat => ({
              id: stat.title,
              component: <Card key={stat.title} {...stat} />,
            }))
            .concat({
              id: 'telegram',
              component: (
                <Flex
                  bg={theme.compensation?.performanceOverview.header.bg.card}
                  flexDir="column"
                  alignItems="start"
                  gap={['3', '4']}
                  px={{ base: '3', '2xl': '5' }}
                  py={{ base: '5' }}
                  borderRadius="8px"
                  w={['260px']}
                  flex={{ base: 'none', xl: '1' }}
                  minW={{ base: '240px', xl: '210px' }}
                  h={{ base: '136px', sm: '160px', xl: '184px' }}
                >
                  <Flex
                    bg={
                      theme.compensation?.performanceOverview.header.bg.discord
                    }
                    borderRadius="4px"
                    p="2"
                    width="40px"
                    height="40px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <DiscordIcon width="24px" height="24px" color="white" />
                  </Flex>
                  <Flex flexDir="column" alignItems="start" gap="2">
                    <Text
                      color={
                        theme.compensation?.performanceOverview.header.text
                      }
                      fontSize="16px"
                      fontWeight="600"
                    >
                      Got questions or feedback? Message us on{' '}
                      <ChakraLink
                        isExternal
                        href="https://t.me/karmahq"
                        color="#155EEF"
                        textDecor="underline"
                      >
                        Telegram
                      </ChakraLink>
                    </Text>
                  </Flex>
                </Flex>
              ),
            })}
        />
      </Flex>
      <Flex display={{ base: 'flex', xl: 'none' }} w="full">
        <ScoringSystemAccordion />
      </Flex>

      <ScoringSystemModal isModalOpen={isOpen} setIsModalOpen={onToggle} />
    </Flex>
  );
};
