/* eslint-disable react/jsx-no-useless-fragment */
import {
  Button,
  Divider,
  Flex,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useClipboard,
  Icon,
  Box,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react';
import { FC, useState, useMemo } from 'react';
import { BsChat } from 'react-icons/bs';
import { IoCopy, IoPersonOutline } from 'react-icons/io5';
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
import { IBreakdownProps } from 'contexts/scoreBreakdown';
import { DELEGATOR_TRACKER_DAOS } from 'helpers';
import dynamic from 'next/dynamic';
import { FaDiscord } from 'react-icons/fa';
import { ImgWithFallback } from '../ImgWithFallback';
import { DelegateButton } from '../DelegateButton';
import { ForumIcon, TwitterIcon } from '../Icons';
import { ExpandableCardText } from './ExpandableCardText';

const DelegateStat = dynamic(() =>
  import('./DelegateStat').then(module => module.DelegateStat)
);

const ScoreStat = dynamic(() =>
  import('./ScoreStat').then(module => module.ScoreStat)
);

const StatPopover = dynamic(() =>
  import('./StatPopover').then(module => module.StatPopover)
);

const UserInfoButton = dynamic(() =>
  import('components/UserInfoButton').then(module => module.UserInfoButton)
);

interface IStatCasesProps {
  statItem: ICardStat;
  canShowBreakdown: boolean;
  daoName: string;
  delegateAddress: string;
}

const StatCases: FC<IStatCasesProps> = ({
  statItem,
  canShowBreakdown,
  daoName,
  delegateAddress,
}) => {
  const daoSupportsDelegatorPage = DELEGATOR_TRACKER_DAOS.find(
    dao => dao === daoName
  );
  if (statItem.id === 'delegatorCount' && daoSupportsDelegatorPage)
    return (
      <Link
        background="transparent"
        href={`https://karmahq.xyz/dao/${daoName}/delegators/${delegateAddress}`}
        _hover={{}}
        h="max-content"
        isExternal
        cursor="pointer"
      >
        <DelegateStat stat={statItem} />
      </Link>
    );
  if (
    (statItem.id === 'forumScore' && canShowBreakdown) ||
    (statItem.id !== 'forumScore' && statItem.statAction)
  )
    return (
      <Box
        role="button"
        background="transparent"
        onClick={() => statItem.statAction?.()}
        _hover={{}}
        h="max-content"
      >
        <DelegateStat stat={statItem} />
      </Box>
    );

  return <DelegateStat stat={statItem} />;
};

interface IDelegateCardProps {
  data?: IDelegate;
  onModalOpen?: (user: IBreakdownProps) => void;
}

export const DelegateCard: FC<IDelegateCardProps> = props => {
  const { data } = props;
  const { daoInfo, theme, daoData } = useDAO();
  const { selectProfile, period, setSelectedProfileData, addToDelegatePool } =
    useDelegates();
  const { onCopy } = useClipboard(data?.address || '');

  const { config } = daoInfo;
  const isLoaded = !!data;

  const getScore = () => {
    if (data?.gitcoinHealthScore) return formatNumber(data.gitcoinHealthScore);
    if (data?.karmaScore && daoInfo.config.DAO_KARMA_ID !== 'gitcoin')
      return formatNumber(data?.karmaScore);
    return '-';
  };

  const karmaScoreType = (
    scoreType: IBreakdownProps['type']
  ): IBreakdownProps['type'] => {
    if (scoreType === 'forumScore') return scoreType;

    return daoInfo.config.DAO_KARMA_ID === 'gitcoin'
      ? 'gitcoinHealthScore'
      : 'karmaScore';
  };

  const openScoreBreakdown = (scoreType: IBreakdownProps['type']) => {
    const { onModalOpen } = props;
    if (data)
      onModalOpen?.({
        address: data.address,
        period,
        type: karmaScoreType(scoreType),
      });
  };

  const allStats: ICardStat[] = [
    {
      title: 'Total Delegators',
      icon: BsChat,
      value: data?.delegatorCount ? formatNumber(data.delegatorCount) : '-',
      id: 'delegatorCount',
      // tooltipText: 'Total of delegators for this delegate',
    },
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
      statAction: () => {
        openScoreBreakdown('forumScore');
      },
    },
    {
      title: 'Discord Score',
      icon: BsChat,
      value: data?.discordScore ? formatNumber(data.discordScore) : '-',
      id: 'discordScore',
      tooltipText: 'Score based on their contribution in the discord',
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
  };

  const getInterests = () => {
    const foundInterests = customFields?.find(
      item =>
        item.label === 'interests' ||
        item.label.toLowerCase().includes('interests')
    );
    if (!foundInterests) return emptyField;
    if (Array.isArray(foundInterests.value)) return foundInterests;
    const { value } = foundInterests;
    return {
      label: 'Interests',
      value: value.split(','),
      displayAs: 'interests',
    };
  };

  const interests = getInterests();

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
        tooltipText: `Based on ${formatNumber(
          data?.delegatorCount || 0
        )} delegators`,
      });

    const order = [
      'delegatedVotes',
      'votingWeight',
      'offChainVotesPct',
      'onChainVotesPct',
      'delegatorCount',
      'forumScore',
      'karmaScore',
      'discordScore',
    ];

    if (config.DAO_DEFAULT_SETTINGS?.SORT_ORDER) {
      const customOrder = config.DAO_DEFAULT_SETTINGS?.SORT_ORDER;
      filtereds.sort(
        (one, two) => customOrder.indexOf(one.id) - customOrder.indexOf(two.id)
      );
    } else {
      filtereds.sort(
        (one, two) => order.indexOf(one.id) - order.indexOf(two.id)
      );
    }

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

  const renderCategory = () => {
    const workstreamsExist =
      data?.workstreams &&
      data.workstreams.length > 0 &&
      data.workstreams[0]?.description.toLowerCase() !== 'general';
    const tracksExist = data?.tracks && data.tracks.length > 0;

    if (!workstreamsExist && !tracksExist) {
      return undefined;
    }

    const type = daoInfo.config.DAO_CATEGORIES_TYPE;
    const categoryName = data?.[type]?.[0]?.name;

    return (
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
        {categoryName}
      </Text>
    );
  };

  const shortAddress = data && truncateAddress(data.address);

  const checkIfDelegate = () =>
    !!daoInfo.config.DAO_DELEGATE_CONTRACT ||
    daoInfo.config.ALLOW_BULK_DELEGATE;

  const canDelegate = checkIfDelegate();

  const findStatement = customFields.find(
    item =>
      item?.displayAs === 'headline' ||
      item?.label?.toLowerCase() === 'statement'
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

  const { toast } = useToasty();
  const copyText = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      description: 'Address copied',
      duration: 3000,
    });
  };

  const statBorderWidth = (index: number) => {
    if (index === firstRowStats.length - 1) {
      if (index === 0) return '1px 1px 1px 1px';
      if (index === 1) return '1px';
      return '1px 1px 1px 0';
    }
    if (index === 0) return '1px 0 1px 1px';
    if (index === 1) return '1px';
    return '1px 1px 1px 0';
  };

  const statBorderRadius = (index: number) => {
    if (index === firstRowStats.length - 1) {
      if (index === 0) return '8px 8px 8px 8px';
      return '0 8px 8px 0';
    }
    if (index === 0) return '8px 0 0 8px';
    return '0 0 0 0';
  };

  const getDataStatusColor = (status: string) => {
    if (status === 'inactive' || status === 'withdrawn') return '#F4EB0F';
    return '#30E320';
  };

  const handleAddToDelegatePool = (delegate: IDelegate) => {
    if (!delegate.tracks?.length) {
      toast({
        title: 'Error',
        description: 'This delegate does not belong any track',
        status: 'error',
        duration: 3000,
      });
    } else {
      setSelectedProfileData(delegate);
    }
  };

  return (
    <Flex
      bg={theme.card.background}
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
      minH="max-content"
      h={{
        base: 'full',
        sm: 'full',
      }}
    >
      <Flex
        flexDir="row"
        gap={{ base: '2', md: '4' }}
        w="full"
        align="flex-start"
        px={{ base: '14px', lg: '5', xl: '4' }}
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
              onClick={() => selectProfile(data, 'statement')}
              cursor="pointer"
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
        <Flex w="full" justifyContent="space-between" align="flex-start">
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
                  maxW={{ base: '200px', lg: '250px' }}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  onClick={() => selectProfile(data, 'statement')}
                  cursor="pointer"
                >
                  {data.realName || data.ensName || shortAddress}
                </Text>
                <Flex flexDir="row" color={theme.subtitle} gap="1.5">
                  <Text fontSize="xs" fontWeight="medium">
                    {shortAddress}
                  </Text>
                  <Button
                    bg="transparent"
                    py="0"
                    px="0"
                    _hover={{
                      opacity: 0.7,
                    }}
                    _active={{}}
                    _focus={{}}
                    onClick={copyText}
                    h="max-content"
                    w="min-content"
                    minW="min-content"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={IoCopy} color={theme.subtitle} boxSize="4" />
                  </Button>
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
                <Flex gap="1" align="center">
                  <Flex
                    borderRadius="full"
                    w="7px"
                    h="7px"
                    backgroundColor={getDataStatusColor(
                      data.status || 'active'
                    )}
                  />
                  <Text fontWeight="400" fontSize="13px" color={theme.title}>
                    {data.status
                      ? data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)
                      : 'Active'}
                  </Text>
                </Flex>
                <Flex
                  flexDir="row"
                  gap="1.5"
                  overflowX="hidden"
                  width="max-content"
                >
                  {renderCategory()}
                  {!isLoaded ? (
                    <Flex h="21px" />
                  ) : (
                    <>
                      {interests.value.length > 0 &&
                        (interests.value.slice(0, 3) as string[]).map(
                          (interest, index) => (
                            <Tooltip
                              label={interest}
                              key={+index}
                              color={theme.card.interests.text}
                              bg={theme.background}
                              hasArrow
                              placement="top"
                              boxShadow="2xl"
                              border="1px solid"
                              borderColor={theme.card.border}
                              arrowShadowColor={theme.card.border}
                            >
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
                                maxW="20"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
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
                            </Tooltip>
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
                    cursor="pointer"
                    right="0"
                    top="0"
                    onClick={() => {
                      openScoreBreakdown('karmaScore');
                    }}
                  >
                    <ScoreStat stat={score} />
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
          px={{ base: '3', lg: '5', xl: '4' }}
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
                <>
                  {!(config.SHOULD_NOT_SHOW === 'statement') && <Text>-</Text>}
                </>
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
                    <Flex flexDir="column" w="full" align="center">
                      <Flex
                        gridColumnGap="0"
                        bgColor={theme.card.statBg}
                        borderRadius="8px"
                        h="full"
                        w="full"
                        flexDir="row"
                        justifyContent="space-between"
                        alignItems="center"
                        position="relative"
                        boxShadow="0px 0px 6px rgba(255, 255, 255, 0.03)"
                      >
                        {firstRowStats.map((statItem, index) => (
                          <Flex
                            align="center"
                            justify="center"
                            key={+index}
                            flex="1"
                            borderStyle="solid"
                            borderColor={theme.card.border}
                            py="2"
                            px="1.5"
                            borderWidth={statBorderWidth(index)}
                            borderRadius={statBorderRadius(index)}
                            maxW="full"
                          >
                            <StatCases
                              statItem={statItem}
                              canShowBreakdown={
                                !!data?.discourseHandle &&
                                !!daoData?.socialLinks.forum &&
                                !!config.DAO_FORUM_TYPE
                              }
                              daoName={config.DAO_KARMA_ID}
                              delegateAddress={data.address}
                            />
                          </Flex>
                        ))}
                        {restRowStats.length > 0 && (
                          <StatPopover stats={restRowStats} data={data} />
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
          flexDir="row"
          gap="3"
          mt={{ base: '3' }}
          h="max-content"
          px={{ base: '14px', lg: '5', xl: '4' }}
          pb={{ base: '5', lg: '5' }}
          align="center"
          justify="space-between"
          w="full"
        >
          {isLoaded ? (
            <Flex flexDir="row" justifyContent="space-between" w="full" gap="3">
              <Flex flexDir="row" gap="3">
                {canDelegate &&
                  (data?.status === 'withdrawn' ? (
                    <Tooltip
                      label="This delegate has indicated that they are no longer accepting delegations."
                      bg={theme.collapse.bg || theme.card.background}
                      color={theme.collapse.text}
                    >
                      <Flex>
                        <DelegateButton
                          delegated={data.address}
                          disabled
                          isDisabled
                        />
                      </Flex>
                    </Tooltip>
                  ) : (
                    <DelegateButton
                      delegated={data.address}
                      px={['4', '8']}
                      beforeOnClick={() => {
                        if (config.ALLOW_BULK_DELEGATE) {
                          handleAddToDelegatePool(data);
                        } else {
                          setSelectedProfileData(data);
                        }
                      }}
                      shouldBlockModal={
                        !(config.ALLOW_BULK_DELEGATE && !!data.tracks?.length)
                      }
                    />
                  ))}
                <UserInfoButton onOpen={selectProfile} profile={data} />
              </Flex>
              <Flex gap="4" align="center" justify="center">
                {data?.twitterHandle && (
                  <Link
                    href={`https://twitter.com/${data.twitterHandle}`}
                    isExternal
                    color={theme.card.socialMedia}
                    _hover={{
                      transform: 'scale(1.25)',
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="max-content"
                  >
                    <TwitterIcon w="17px" h="17px" />
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
                        transform: 'scale(1.25)',
                      }}
                      h="max-content"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <ForumIcon w="17px" h="17px" />
                    </Link>
                  )}
                {data.discordUsername && (
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        color={theme.card.socialMedia}
                        _hover={{
                          transform: 'scale(1.25)',
                        }}
                        h="max-content"
                        w="min-content"
                        minW="min-content"
                        maxW="min-content"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        px="0"
                        bg="transparent"
                        _active={{}}
                        _focus={{}}
                        _focusWithin={{}}
                      >
                        <Icon as={FaDiscord} w="17px" h="17px" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      w="max-content"
                      color={theme.card.interests.text}
                      bg={theme.background}
                    >
                      <PopoverArrow
                        color={theme.card.interests.text}
                        bg={theme.background}
                      />
                      <PopoverBody>{data.discordUsername}</PopoverBody>
                    </PopoverContent>
                  </Popover>
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
  );
};
