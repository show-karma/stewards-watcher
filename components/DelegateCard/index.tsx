/* eslint-disable react/jsx-no-useless-fragment */
import {
  Divider,
  Flex,
  Icon,
  Link,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { FC, useState, useMemo, useCallback } from 'react';
import { BsChat } from 'react-icons/bs';
import { SiTwitter } from 'react-icons/si';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { MdForum } from 'react-icons/md';
import { BiPlanet } from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';
import { ICardStat, ICustomFields, IDelegate } from 'types';
import { useDAO, useDelegates } from 'contexts';
import {
  axiosInstance,
  convertHexToRGBA,
  formatDate,
  formatNumber,
  formatNumberPercentage,
  getUserForumUrl,
  truncateAddress,
} from 'utils';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons/lib';
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
  const { DAO_KARMA_ID, DAO_DEFAULT_SETTINGS } = daoInfo.config;
  const { selectProfile } = useDelegates();

  const { config } = daoInfo;
  const isLoaded = !!data;
  const allStats: ICardStat[] = [
    {
      title: 'Voting weight',
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
      title: 'Forum score',
      icon: BsChat,
      value: data?.forumActivity ? formatNumber(data.forumActivity) : '-',
      id: 'forumScore',
      tooltipText: 'Score based on their contribution in the forum',
    },
    {
      title: 'Delegators',
      icon: IoPersonOutline,
      value: data?.delegators ? formatNumber(data.delegators) : '-',
      id: 'delegators',
      tooltipText: 'Total number of delegators',
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
    if (router.query.site === 'op') {
      const randomId = Math.floor(Math.random() * 3);
      data?.workstreams?.push({
        id: randomId,
        name: ['Tooling', 'DeFi', 'Governance'][randomId],
        description: ['Tooling', 'DeFi', 'Governance'][randomId],
      });
    }
    if (DAO_KARMA_ID === 'gitcoin') {
      const gitcoinWorkstream = () => {
        if (!data?.workstreams?.length) return '-';
        if (data.workstreams[0]?.description.toLowerCase() === 'general') {
          if (data.workstreams.length === 1) return '';
          return data.workstreams[1]?.description || data.workstreams[1]?.name;
        }
        return data.workstreams[0]?.description || data.workstreams[0]?.name;
      };
      filtereds.push({
        title: 'Workstream',
        icon: BiPlanet,
        value: gitcoinWorkstream(),
        id: 'workstream',
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

  const userStatement = customFields.find(item => item.displayAs === 'headline')
    ?.value as string;

  return (
    <Flex
      bgColor={theme.card.background}
      flexDir="column"
      px={{ base: '14px', lg: '5' }}
      py={{ base: '5', lg: '5' }}
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
      maxWidth="420px"
      h={{ base: '400px', lg: '329px' }}
    >
      <Flex flexDir="row" gap="4" w="full" align="flex-start">
        {data ? (
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
          {data ? (
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
      {userStatement ? (
        <Flex h="full" align="flex-start">
          <ExpandableCardText
            text={userStatement}
            isExpanded={isExpanded}
            toggleIsExpanded={toggleIsExpanded}
          />
        </Flex>
      ) : (
        'Placeholder Text for User Statement'
      )}
      {!isExpanded && (
        <Flex
          flexDir="row"
          gap="2"
          w="full"
          bgColor={theme.card.statBg}
          px="2"
          py="4"
          borderRadius="xl"
          justify="space-between"
          maxH="max-content"
          flexWrap="wrap"
        >
          {stats.map((statItem, index) =>
            statItem.id === 'forumScore' &&
            data?.discourseHandle &&
            daoData?.socialLinks.forum &&
            config.DAO_FORUM_TYPE ? (
              <Flex
                flexBasis={{ base: '46%', lg: 'unset' }}
                align="center"
                justify="center"
                key={+index}
              >
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
              </Flex>
            ) : (
              <Flex flexBasis={{ base: '46%', lg: 'unset' }} key={+index}>
                <DelegateStat stat={statItem} />
              </Flex>
            )
          )}
        </Flex>
      )}

      <Flex flexDir="column" gap="3">
        <Divider borderColor={theme.card.divider} w="full" />

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
                <Flex flexDir="row">
                  <UserInfoButton onOpen={selectProfile} profile={data} />
                  <DelegateButton delegated={data.address} px={['4', '8']} />
                </Flex>
              </Flex>
            ) : (
              <>
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
  );
};
