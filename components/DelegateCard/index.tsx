/* eslint-disable react/jsx-no-useless-fragment */
import {
  Divider,
  Flex,
  Link,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { FC, useState, useMemo, useCallback } from 'react';
import { BsChat } from 'react-icons/bs';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { ICardStat, ICustomFields, IDelegate } from 'types';
import { useDAO, useDelegates } from 'contexts';
import {
  convertHexToRGBA,
  formatDate,
  formatNumber,
  formatNumberPercentage,
  getUserForumUrl,
  truncateAddress,
} from 'utils';
import { useRouter } from 'next/router';
import { ImgWithFallback } from '../ImgWithFallback';
import { DelegateButton } from '../DelegateButton';
import { UserInfoButton } from '../UserInfoButton';
import { ForumIcon, TwitterIcon } from '../Icons';
import { ExpandableCardText } from './ExpandableCardText';
import { DelegateStat } from './DelegateStat';

interface IDelegateCardProps {
  data?: IDelegate;
}

export const DelegateCard: FC<IDelegateCardProps> = props => {
  const { data } = props;
  const { daoInfo, theme, daoData } = useDAO();
  const { selectProfile } = useDelegates();

  const { config } = daoInfo;
  const isLoaded = !!data;
  const allStats: ICardStat[] = [
    {
      title: 'Delegated Tokens',
      icon: IoIosCheckboxOutline,
      pct: data?.votingWeight ? formatNumberPercentage(data.votingWeight) : '-',
      value: data?.delegatedVotes ? formatNumber(data?.delegatedVotes) : '-',
      id: 'delegatedVotes',
      tooltipText: `Total votes delegated`,
    },
    {
      title: 'Snapshot votes',
      icon: AiOutlineThunderbolt,
      pct: data?.voteParticipation.offChain
        ? `${data.voteParticipation.offChain}%`
        : '-',
      value: data?.voteParticipation.offChain
        ? `${data.voteParticipation.offChain}%`
        : '-',
      id: 'offChainVotesPct',
      tooltipText: `Contributor's voting % for off-chain (snapshot) proposals`,
    },
    {
      title: 'On-chain votes',
      icon: AiOutlineThunderbolt,
      pct: data?.voteParticipation.onChain
        ? `${data.voteParticipation.onChain}%`
        : '-',
      value: data?.voteParticipation.onChain
        ? `${data.voteParticipation.onChain}%`
        : '-',
      id: 'onChainVotesPct',
      tooltipText: `Contributor's voting % for on-chain proposals`,
    },
    {
      title: 'Score',
      icon: IoPersonOutline,
      value: data?.karmaScore ? formatNumber(data?.karmaScore) : '-',
      id: 'karmaScore',
      tooltipText: 'Total Score based on all the delegate activity',
    },
    {
      title: 'Forum score',
      icon: BsChat,
      value: data?.forumActivity ? formatNumber(data.forumActivity) : '-',
      id: 'forumScore',
      tooltipText: 'Score based on their contribution in the forum',
    },
  ];

  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleIsExpanded = () => setIsExpanded(!isExpanded);

  const [stats, setStats] = useState<ICardStat[]>(allStats);

  const customFields: ICustomFields[] = data?.delegatePitch?.customFields || [];
  const emptyField: ICustomFields = { label: '', value: [] };

  const interests =
    customFields?.find(
      item =>
        item.displayAs === 'interests' ||
        item.label.toLowerCase().includes('interests')
    ) || emptyField;

  useMemo(() => {
    if (!config) return;
    const filtereds: ICardStat[] = [];

    allStats.forEach(item => {
      if (config.EXCLUDED_CARD_FIELDS.includes(item.id)) return;
      filtereds.push(item);
    });
    if (
      filtereds.find(
        item => item.id === 'offChainVotesPct' || item.id === 'onChainVotesPct'
      )
    )
      filtereds.push({
        title: 'Voting Weight',
        icon: IoPersonOutline,
        value: data?.votingWeight
          ? `${formatNumberPercentage(data?.votingWeight)}`
          : '-',
        id: 'votingWeight',
        tooltipText: `Based on ${data?.delegators} delegators`,
      });

    const order = [
      'delegatedVotes',
      'votingWeight',
      'offChainVotesPct',
      'onChainVotesPct',
      'karmaScore',
      'forumScore',
    ];

    filtereds.sort((one, two) => order.indexOf(one.id) - order.indexOf(two.id));

    if (router.query.site === 'op') {
      const randomId = Math.floor(Math.random() * 3);
      data?.workstreams?.push({
        id: randomId,
        name: ['Tooling', 'DeFi', 'Governance'][randomId],
        description: ['Tooling', 'DeFi', 'Governance'][randomId],
      });
    }

    setStats(filtereds);
  }, [config, data]);

  const shortAddress = data && truncateAddress(data.address);

  const checkIfDelegate = () => {
    if (daoInfo.config.DAO_DELEGATE_MODE === 'custom') {
      return !!daoInfo.ABI;
    }
    if (daoInfo.config.DAO_DELEGATE_MODE === 'snapshot') return true;
    return false;
  };

  const canDelegate = checkIfDelegate();

  const [isOverflowingInterest, setIsOverflowingInterest] = useState(false);
  const [interestsNumberToShow, setInterestsNumberToShow] = useState(4);
  const handleInterestOverflow = useCallback((ref: HTMLDivElement) => {
    if (ref?.clientHeight > 25 || ref?.scrollHeight > 25) {
      setIsOverflowingInterest(true);
      setInterestsNumberToShow(previous => previous - 1);
    }
  }, []);

  const findStatement = customFields.find(
    item => item.displayAs === 'headline'
  )?.value;
  const userStatement = Array.isArray(findStatement)
    ? findStatement[0]
    : findStatement;

  const showSecondRow = stats.length > 4;

  const columnsCalculator = () => {
    if (stats.length < 4) return stats.length;
    return 4;
  };

  const firstRowStats = stats.slice(0, columnsCalculator());
  const restRowStats = stats.slice(columnsCalculator(), stats.length);

  return (
    <Flex
      bgColor={theme.card.background}
      flexDir="column"
      borderRadius="16"
      flex="1"
      gap="2"
      justifyContent="space-between"
      boxShadow={theme.card.shadow}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={theme.card.border}
      w="full"
      minWidth="288px"
      h={{
        base: 'max-content',
        // eslint-disable-next-line no-nested-ternary
        sm: showSecondRow ? '480px' : '380px',
        lg: showSecondRow ? '480px' : '350px',
        '2xl': showSecondRow ? '440px' : '350px',
      }}
    >
      <Flex
        flexDir="row"
        gap="4"
        w="full"
        align="flex-start"
        px={{ base: '14px', lg: '5' }}
        pt={{ base: '5', lg: '5' }}
      >
        {isLoaded && data ? (
          <Flex
            minH={['48px', '54px']}
            minW={['48px', '54px']}
            h={['48px', '54px']}
            w={['48px', '54px']}
          >
            <ImgWithFallback
              h={['48px', '54px']}
              w={['48px', '54px']}
              borderRadius="full"
              src={
                data.profilePicture ||
                `${config.IMAGE_PREFIX_URL}${data.address}`
              }
              fallback={data.address}
              boxShadow="0px 0px 0px 2px white"
            />
          </Flex>
        ) : (
          <Flex
            minH={['48px', '54px']}
            minW={['48px', '54px']}
            h={['48px', '54px']}
            w={['48px', '54px']}
          >
            <SkeletonCircle
              h={['48px', '54px']}
              w={['48px', '54px']}
              borderRadius="full"
            />
          </Flex>
        )}
        <Flex
          flexDir="column"
          gap="0.5"
          justify="center"
          w="max-content"
          maxW="full"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="break-spaces"
        >
          {isLoaded && data ? (
            <>
              <Text
                color={theme.title}
                fontSize="lg"
                fontWeight="bold"
                maxH="30px"
                maxW="full"
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {data.realName || data.ensName || shortAddress}
              </Text>
              <Flex flexDir="row" color={theme.subtitle} gap="1.5">
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {shortAddress}
                </Text>
                {data.delegateSince && (
                  <Flex flexDir="row" gap="1.5" alignItems="center">
                    <Flex
                      w="3px"
                      h="3px"
                      bgColor={theme.subtitle}
                      borderRadius="full"
                    />
                    <Text fontSize="xs" fontWeight="medium">
                      Joined {formatDate(data.delegateSince)}
                    </Text>
                  </Flex>
                )}
              </Flex>
              <Flex
                flexDir="row"
                gap="1.5"
                overflowX="hidden"
                width="max-content"
              >
                {data.workstreams && data.workstreams.length > 0 && (
                  <Text
                    color={theme.card.background}
                    bgColor={theme.title}
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="10px"
                    fontWeight="medium"
                    _hover={{
                      backgroundColor: convertHexToRGBA(theme.title, 0.8),
                    }}
                  >
                    {data?.workstreams[0]?.name}
                  </Text>
                )}
                {!isLoaded ? (
                  <Flex h="21px" />
                ) : (
                  <>
                    {interests.value.length > 0 &&
                      (interests.value.slice(0, 3) as string[]).map(
                        (interest, index) => (
                          <Text
                            color={theme.subtitle}
                            bgColor={theme.card.statBg}
                            px="2"
                            py="1"
                            borderRadius="md"
                            fontSize="10px"
                            fontWeight="medium"
                            key={+index}
                            h="max-content"
                            _hover={{
                              backgroundColor: () => {
                                if (theme.card.statBg.includes('rgba'))
                                  return theme.card.statBg.replace(
                                    '0.15',
                                    '0.30'
                                  );
                                return convertHexToRGBA(theme.card.statBg, 0.1);
                              },
                            }}
                          >
                            {interest}
                          </Text>
                        )
                      )}
                  </>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Skeleton isLoaded={isLoaded}>SkeletonText</Skeleton>
              <Skeleton isLoaded={isLoaded}>SkeletonSubText</Skeleton>
            </>
          )}
        </Flex>
      </Flex>
      <Flex flexDir="column" justifyContent="space-between" h="full">
        <Flex
          flexDir="column"
          align="flex-start"
          justify="space-between"
          h="full"
          px={{ base: '14px', lg: '5' }}
        >
          {isLoaded ? (
            <>
              {userStatement ? (
                <Flex h="full" align="flex-start">
                  <ExpandableCardText
                    text={userStatement}
                    isExpanded={isExpanded}
                    toggleIsExpanded={toggleIsExpanded}
                    isShowingSecondRow={showSecondRow}
                  />
                </Flex>
              ) : (
                <Text>-</Text>
              )}
            </>
          ) : (
            <SkeletonText h="full" w="full" />
          )}
          {!isExpanded && (
            <>
              {isLoaded ? (
                <Flex flexDir="column" w="full">
                  <SimpleGrid
                    columns={columnsCalculator()}
                    gap="2"
                    w="full"
                    bgColor={theme.card.statBg}
                    px="2"
                    py="4"
                    borderRadius="xl"
                    maxH="max-content"
                  >
                    {firstRowStats.map((statItem, index) => (
                      <Flex
                        align="center"
                        justify="center"
                        key={+index}
                        w="full"
                      >
                        {statItem.id === 'forumScore' &&
                        data?.discourseHandle &&
                        daoData?.socialLinks.forum &&
                        config.DAO_FORUM_TYPE ? (
                          <Link
                            href={getUserForumUrl(
                              data.discourseHandle,
                              config.DAO_FORUM_TYPE,
                              daoData.socialLinks.forum
                            )}
                            isExternal
                            _hover={{}}
                            h="max-content"
                          >
                            <DelegateStat stat={statItem} />
                          </Link>
                        ) : (
                          <DelegateStat stat={statItem} />
                        )}
                      </Flex>
                    ))}
                  </SimpleGrid>
                  {stats.length > 4 && (
                    <SimpleGrid
                      columns={columnsCalculator()}
                      gap="2"
                      w="full"
                      bgColor="transparent"
                      px="2"
                      py="4"
                      maxH="max-content"
                    >
                      {restRowStats.map((statItem, index) => (
                        <Flex
                          align="center"
                          justify="center"
                          key={+index}
                          w="full"
                        >
                          {statItem.id === 'forumScore' &&
                          data?.discourseHandle &&
                          daoData?.socialLinks.forum &&
                          config.DAO_FORUM_TYPE ? (
                            <Link
                              href={getUserForumUrl(
                                data.discourseHandle,
                                config.DAO_FORUM_TYPE,
                                daoData.socialLinks.forum
                              )}
                              isExternal
                              _hover={{}}
                              h="max-content"
                            >
                              <DelegateStat stat={statItem} />
                            </Link>
                          ) : (
                            <DelegateStat stat={statItem} />
                          )}
                        </Flex>
                      ))}
                    </SimpleGrid>
                  )}
                </Flex>
              ) : (
                <Skeleton w="full" h="full" />
              )}
            </>
          )}
        </Flex>

        <Divider borderColor={theme.card.divider} w="full" mt={{ base: '3' }} />
        <Flex
          flexDir="column"
          gap="3"
          mt={{ base: '3' }}
          h="max-content"
          px={{ base: '14px', lg: '5' }}
          pb={{ base: '5', lg: '5' }}
        >
          {canDelegate && (
            <Flex justify="left" align="center" gap="4">
              {isLoaded ? (
                <Flex flexDir="row" justifyContent="space-between" w="full">
                  <Flex gap="4" align="center" justify="center">
                    {data?.twitterHandle && (
                      <Link
                        href={`https://twitter.com/${data.twitterHandle}`}
                        isExternal
                        color={theme.card.text}
                        _hover={{
                          transform: 'scale(1.5)',
                        }}
                      >
                        <TwitterIcon w="5" h="5" />
                      </Link>
                    )}
                    {data?.discourseHandle &&
                      daoData?.socialLinks.forum &&
                      config.DAO_FORUM_TYPE && (
                        <Link
                          href={getUserForumUrl(
                            data.discourseHandle,
                            config.DAO_FORUM_TYPE,
                            daoData.socialLinks.forum
                          )}
                          isExternal
                          color={theme.card.text}
                          _hover={{
                            transform: 'scale(1.5)',
                          }}
                        >
                          <ForumIcon w="5" h="5" />
                        </Link>
                      )}
                    {/* <Link
                    href={`https://discordapp.com/users/${1234}`}
                    isExternal
                    color={theme.card.text}
                  >
                    <Icon as={FaDiscord} w="5" h="5" />
                  </Link> */}
                  </Flex>
                  {data && (
                    <Flex flexDir="row">
                      <UserInfoButton onOpen={selectProfile} profile={data} />
                      <DelegateButton
                        delegated={data.address}
                        px={['4', '8']}
                      />
                    </Flex>
                  )}
                </Flex>
              ) : (
                <>
                  <Skeleton isLoaded={isLoaded} w="36" h="12">
                    SkeletonText
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} w="36" h="12">
                    SkeletonText
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} w="36" h="12">
                    SkeletonText
                  </Skeleton>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
