import {
  Flex,
  Grid,
  GridItem,
  Icon,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { BsCalendar4, BsChat } from 'react-icons/bs';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IDelegate } from 'types';
import { useDAO } from 'contexts';
import { truncateAddress } from 'utils';
import { ImgWithFallback } from './ImgWithFallback';
import { DelegateButton } from './DelegateButton';

interface IDelegateCardProps {
  data?: IDelegate;
}

export const DelegateCard: FC<IDelegateCardProps> = props => {
  const { data } = props;
  const { daoInfo } = useDAO();
  const { theme, config } = daoInfo;
  const isLoaded = !!data;

  const statIcons = [
    {
      title: 'Delegates since',
      icon: BsCalendar4,
      value: data?.delegateSince ? data.delegateSince : '-',
    },
    {
      title: 'Forum activity',
      icon: BsChat,
      value: data?.forumActivity ? data.forumActivity : '-',
    },
    {
      title: 'Voting weight',
      icon: IoIosCheckboxOutline,
      value: data?.votingWeight ? data.votingWeight : '-',
    },
    {
      title: 'Delegators',
      icon: IoPersonOutline,
      value: data?.delegators ? data.delegators : '-',
    },
    {
      title: 'Off-chain votes',
      icon: AiOutlineThunderbolt,
      value: data?.voteParticipation.offChain
        ? `${data.voteParticipation.offChain}%`
        : '-',
    },
    // {
    //   title: 'On-chain votes',
    //   icon: AiOutlineThunderbolt,
    //   value: data?.voteParticipation.onChain
    //     ? `${data.voteParticipation.onChain}%`
    //     : '-',
    // },
  ];

  const shortAddress = data && truncateAddress(data.address);

  return (
    <Flex
      bgColor={theme.card}
      flexDir="column"
      px="8"
      py="6"
      borderRadius="16"
      w={['full', '22rem']}
      gap="8"
      boxShadow="0px 0px 10px 1px rgba(0,0,0,0.3)"
      h="520"
    >
      <Flex flexDir="row" gap={['2', '4']} w="full" align="center">
        {data ? (
          <Flex
            minH={['48px', '64px']}
            minW={['48px', '64px']}
            h={['48px', '64px']}
            w={['48px', '64px']}
          >
            <ImgWithFallback
              h={['48px', '64px']}
              w={['48px', '64px']}
              borderRadius="full"
              src={`${config.IMAGE_PREFIX_URL}${data.address}`}
              fallback={data.address}
              boxShadow={`0px 0px 0px 2px ${theme.branding}`}
            />
          </Flex>
        ) : (
          <Flex
            minH={['48px', '64px']}
            minW={['48px', '64px']}
            h={['48px', '64px']}
            w={['48px', '64px']}
          >
            <SkeletonCircle
              h={['48px', '64px']}
              w={['48px', '64px']}
              borderRadius="full"
            />
          </Flex>
        )}
        <Flex
          flexDir="column"
          gap="0.5"
          justify="center"
          w="full"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="break-spaces"
        >
          {data ? (
            <>
              <Text
                color={theme.title}
                fontSize={['lg', 'xl']}
                fontWeight="medium"
              >
                {data.ensName || shortAddress}
              </Text>
              <Text color={theme.branding} fontSize={['lg', 'xl']}>
                {shortAddress}
              </Text>
            </>
          ) : (
            <>
              <Skeleton isLoaded={isLoaded}>SkeletonText</Skeleton>
              <Skeleton isLoaded={isLoaded}>SkeletonSubText</Skeleton>
            </>
          )}
        </Flex>
      </Flex>

      <Grid gridTemplateColumns="1fr 1fr" w="full" gap="4">
        {statIcons?.map((stat, index) =>
          isLoaded ? (
            <GridItem
              key={+index}
              alignContent="start"
              gap="4"
              flexDir="column"
              w="max-content"
            >
              <Flex gap="1" flexDir="column">
                <Icon as={stat.icon} h="6" w="6" color={theme.branding} />
                <Text color={theme.title} fontSize="sm" fontWeight="medium">
                  {stat.title}
                </Text>
                <Text
                  color={theme.title}
                  fontFamily="heading"
                  fontSize="lg"
                  fontWeight="normal"
                >
                  {stat.value}
                </Text>
              </Flex>
            </GridItem>
          ) : (
            <GridItem
              key={+index}
              alignContent="start"
              gap="4"
              flexDir="column"
              w="full"
            >
              <Flex gap="1" flexDir="column" w="full">
                <SkeletonCircle isLoaded={isLoaded} h="6" w="6">
                  SkeletonText
                </SkeletonCircle>
                <Skeleton isLoaded={isLoaded} w="full" h="6">
                  SkeletonText
                </Skeleton>
                <Skeleton isLoaded={isLoaded} w="full" h="6">
                  SkeletonText
                </Skeleton>
              </Flex>
            </GridItem>
          )
        )}
      </Grid>
      <Flex justify="center" align="center">
        {isLoaded ? (
          <DelegateButton delegated={data.address} />
        ) : (
          <Skeleton isLoaded={isLoaded} w="36" h="12">
            SkeletonText
          </Skeleton>
        )}
      </Flex>
    </Flex>
  );
};
