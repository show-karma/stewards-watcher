/* eslint-disable react/jsx-no-useless-fragment */
import {
  Divider,
  Flex,
  Grid,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useClipboard,
  useDisclosure,
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
import { useToasty } from 'hooks';
import { ScoreBreakdown } from 'components/ScoreBreakdown';
import { StyledModal } from 'components/Modals/DelegateVotes/StyledModal';
import { ScoreBreakdownProvider } from 'contexts/scoreBreakdown';
import { ImgWithFallback } from '../ImgWithFallback';
import { DelegateButton } from '../DelegateButton';
import { UserInfoButton } from '../UserInfoButton';
import { ForumIcon, TwitterIcon } from '../Icons';
import { ExpandableCardText } from './ExpandableCardText';
import { DelegateStat } from './DelegateStat';
import { RestStatsRows } from './RestStatsRows';

interface IDelegateCardProps {
  data?: IDelegate;
}

export const DelegateCard: FC<IDelegateCardProps> = props => {
  const { data } = props;
  const { daoInfo, theme, daoData } = useDAO();
  const { selectProfile } = useDelegates();
  const { onCopy } = useClipboard(data?.address || '');

  const { onOpen, onClose, isOpen } = useDisclosure();

  const { config } = daoInfo;
  const isLoaded = !!data;

  const getScore = () => {
    if (data?.gitcoinHealthScore) return formatNumber(data.gitcoinHealthScore);
    if (data?.karmaScore) return formatNumber(data?.karmaScore);
    return '-';
  };

  const openScoreBreakdown = () => {
    onOpen();
  };

  const allStats: ICardStat[] = [
    {
      title: 'Delegated Tokens',
      icon: IoIosCheckboxOutline,
      value: data?.delegatedVotes ? formatNumber(data?.delegatedVotes) : '-',
      id: 'delegatedVotes',
      tooltipText: `Total votes delegated`,
    },
    {
      title: 'Snapshot pct.',
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
      value: data?.voteParticipation.onChain
        ? `${data.voteParticipation.onChain}%`
        : '-',
      id: 'onChainVotesPct',
      tooltipText: `Contributor's voting % for on-chain proposals`,
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

  const score: ICardStat = {
    title: 'Score',
    icon: IoPersonOutline,
    value: getScore(),
    id: 'karmaScore',
    tooltipText: data?.gitcoinHealthScore
      ? 'Total gitcoin health score'
      : 'Total Score based on all the delegate activity',
  };

  const interests =
    customFields?.find(
      item =>
        item.displayAs === 'interests' ||
        item.label.toLowerCase().includes('interests')
    ) || emptyField;

  useMemo(() => {
    if (!config) return;
    let filtereds: ICardStat[] = [];

    allStats.forEach(item => {
      if (config.EXCLUDED_CARD_FIELDS.includes(item.id)) return;
      filtereds.push(item);
    });
    if (
      filtereds.find(
        item => item.id === 'offChainVotesPct' || item.id === 'onChainVotesPct'
      ) &&
      !config.EXCLUDED_CARD_FIELDS.includes('delegatedVotes')
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
      'forumScore',
      'karmaScore',
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

    if (config.SHOULD_NOT_SHOW?.includes('stats')) filtereds = [];

    setStats(filtereds);
  }, [config, data]);

  const showSecondRow =
    config.DAO_KARMA_ID !== 'gitcoin' &&
    config.EXCLUDED_CARD_FIELDS.length < 2 &&
    !config.SHOULD_NOT_SHOW?.includes('stats');

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
    item =>
      item.displayAs === 'headline' || item.label.toLowerCase() === 'statement'
  )?.value;
  const userStatement = Array.isArray(findStatement)
    ? findStatement[0]
    : findStatement;

  const columnsCalculator = () => {
    if (stats.length < 4) return stats.length;
    return 4;
  };

  const firstRowStats = stats.slice(0, columnsCalculator());
  const restRowStats = stats.slice(columnsCalculator(), stats.length);

  const calculateSizeByStats = (size: 'sm' | 'lg') => {
    if (size === 'sm') {
      if (showSecondRow) return '400px';
      if (!stats.length) return '240px';
      return '300px';
    }
    if (showSecondRow) return '400px';
    if (!stats.length) return '240px';
    return '320px';
  };

  const { toast } = useToasty();
  const copyText = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      description: 'Address copied',
      duration: 3000,
    });
  };

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
      minWidth="min-content"
      maxW={{ base: 'full', sm: '380px', lg: '460px' }}
      minH={{ base: '400px', md: 'max-content' }}
      h={{
        base: '400px',
        sm: 'full',
      }}
    >
      <Flex
        flexDir="row"
        gap={{ base: '2', md: '4' }}
        w="full"
        align="flex-start"
        px={{ base: '14px', lg: '5' }}
        pt={{ base: '5', lg: '5' }}
      >
        {isLoaded && data ? (
          <Flex
            minH={['42px', '48px', '54px']}
            minW={['42px', '48px', '54px']}
            h={['42px', '48px', '54px']}
            w={['42px', '48px', '54px']}
          >
            <ImgWithFallback
              h={['42px', '48px', '54px']}
              w={['42px', '48px', '54px']}
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
          w="full"
          justifyContent="space-between"
          align="center"
          position="relative"
        >
          <Flex
            flexDir="column"
            gap="1"
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
                  maxW="286px"
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
                    onClick={copyText}
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
                      <Text fontSize={{ base: 'xs' }} fontWeight="medium">
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
                      color={theme.card.workstream.text}
                      bgColor={theme.card.workstream.bg}
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
                              color={theme.card.interests.text}
                              bgColor={theme.card.interests.bg}
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
                                  return convertHexToRGBA(
                                    theme.card.statBg,
                                    0.1
                                  );
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
          {!config.EXCLUDED_CARD_FIELDS.includes('karmaScore') &&
            !config.SHOULD_NOT_SHOW?.includes('stats') && (
              <>
                {isLoaded ? (
                  <Flex
                    position="absolute"
                    right="0"
                    top="0"
                    onClick={() => {
                      openScoreBreakdown();
                    }}
                  >
                    <DelegateStat stat={score} />
                  </Flex>
                ) : (
                  <Skeleton w="16" h="8" />
                )}
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
          px={{ base: '3', lg: '5' }}
        >
          {isLoaded ? (
            <Flex mb="4">
              {userStatement ? (
                <Flex h="full" align="flex-start">
                  <ExpandableCardText
                    text={userStatement}
                    isExpanded={isExpanded}
                    toggleIsExpanded={toggleIsExpanded}
                    selectProfile={() => selectProfile(data, 'statement')}
                  />
                </Flex>
              ) : (
                <Text>-</Text>
              )}
            </Flex>
          ) : (
            <SkeletonText h="full" w="full" />
          )}
          {!isExpanded && (
            <>
              {isLoaded ? (
                <>
                  {stats.length > 0 && (
                    <Flex flexDir="column" w="full">
                      <Grid
                        gridColumnGap="1"
                        gridRowGap="1"
                        w="full"
                        bgColor={theme.card.statBg}
                        px="2"
                        py="2"
                        borderRadius="xl"
                        h="full"
                        templateColumns={{
                          base: 'repeat(2, 1fr)',
                          sm: 'repeat(3, 1fr)',
                          md: 'repeat(3, 1fr)',
                          lg: 'repeat(4, 1fr)',
                        }}
                        justifyItems="center"
                        alignItems="center"
                      >
                        {firstRowStats.map((statItem, index) => (
                          <Flex
                            align="center"
                            justify="center"
                            key={+index}
                            w="max-content"
                          >
                            {statItem.id === 'forumScore' &&
                            data?.discourseHandle &&
                            daoData?.socialLinks.forum &&
                            config.DAO_FORUM_TYPE ? (
                              <Link
                                href={getUserForumUrl(
                                  data.discourseHandle,
                                  config.DAO_FORUM_TYPE,
                                  config.DAO_FORUM_URL ||
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
                      </Grid>
                      <Flex minH={showSecondRow ? '76px' : '0px'}>
                        {(stats.length > 4 || showSecondRow) && (
                          <RestStatsRows
                            restRowStats={restRowStats}
                            config={config}
                            daoData={daoData}
                            data={data}
                          />
                        )}
                      </Flex>
                    </Flex>
                  )}
                </>
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
          <Flex justify="left" align="center" gap="4">
            {isLoaded ? (
              <Flex flexDir="row" justifyContent="space-between" w="full">
                <Flex gap="4" align="center" justify="center">
                  {data?.twitterHandle && (
                    <Link
                      href={`https://twitter.com/${data.twitterHandle}`}
                      isExternal
                      color={theme.card.socialMedia}
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
                          config.DAO_FORUM_URL || daoData.socialLinks.forum
                        )}
                        isExternal
                        color={theme.card.socialMedia}
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
                    color={theme.card.socialMedia}
                  >
                    <Icon as={FaDiscord} w="5" h="5" />
                  </Link> */}
                </Flex>
                <Flex flexDir="row">
                  <UserInfoButton onOpen={selectProfile} profile={data} />
                  {canDelegate && (
                    <DelegateButton delegated={data.address} px={['4', '8']} />
                  )}
                </Flex>
              </Flex>
            ) : (
              <>
                <Skeleton isLoaded={isLoaded} w="full" h="12">
                  SkeletonText
                </Skeleton>
                <Skeleton isLoaded={isLoaded} w="full" h="12">
                  SkeletonText
                </Skeleton>
                <Skeleton isLoaded={isLoaded} w="full" h="12">
                  SkeletonText
                </Skeleton>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      <StyledModal isOpen={isOpen} onClose={onClose}>
        {data?.address ? (
          <ScoreBreakdownProvider
            address={data.address}
            period="lifetime"
            type="gitcoinHealthScore"
          >
            <ScoreBreakdown />
          </ScoreBreakdownProvider>
        ) : null}
      </StyledModal>
    </Flex>
  );
};
