import {
  Button,
  Flex,
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { THEME } from 'configs';
import { FC } from 'react';
import { IconType } from 'react-icons';
import { BsCalendar4, BsChat } from 'react-icons/bs';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { ISteward } from 'types';
import { getStewardImage, truncateAddress } from 'utils';

interface IStewardCardProps {
  data?: ISteward;
}

export const StewardCard: FC<IStewardCardProps> = props => {
  const { data } = props;
  const isLoaded = !!data;

  const statIcons = [
    {
      title: 'Stewards since',
      icon: BsCalendar4,
      value: data?.stewardSince ? data.stewardSince : '-',
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
    {
      title: 'On-chain votes',
      icon: AiOutlineThunderbolt,
      value: data?.voteParticipation.onChain
        ? `${data.voteParticipation.onChain}%`
        : '-',
    },
  ];

  const shortAddress = data && truncateAddress(data.address);

  return (
    <Flex
      bgColor={THEME.card}
      flexDir="column"
      p="4"
      borderRadius="16"
      w="max-content"
      gap="4"
      boxShadow="0px 0px 10px 1px rgba(0,0,0,0.3)"
    >
      <Flex flexDir="row" gap="8">
        {data ? (
          <Img
            h="24"
            w="24"
            borderRadius="12"
            src={getStewardImage(data.address)}
          />
        ) : (
          <SkeletonCircle h="24" w="24" borderRadius="12" />
        )}
        <Flex flexDir="column" gap="0.5" justify="center">
          {data ? (
            <>
              <Text color={THEME.title} fontSize="xl" fontWeight="medium">
                {data.ensName || shortAddress}
              </Text>
              <Text color={THEME.branding} fontSize="xl">
                {shortAddress}
              </Text>
            </>
          ) : (
            <>
              <Skeleton isLoaded={isLoaded} mr="10">
                SkeletonText
              </Skeleton>
              <Skeleton isLoaded={isLoaded} mr="10">
                SkeletonSubText
              </Skeleton>
            </>
          )}
        </Flex>
      </Flex>
      <Flex flexDir="column" color={THEME.title} gap="4">
        {statIcons?.map((stat, index) => (
          <Flex key={+index} align="center" gap="10" justify="space-between">
            <Flex gap="5" align="center">
              {isLoaded ? (
                <Icon as={stat.icon} h="10" w="10" color={THEME.branding} />
              ) : (
                <SkeletonCircle isLoaded={isLoaded} h="10" w="10">
                  SkeletonText
                </SkeletonCircle>
              )}
              {isLoaded ? (
                <Text color={THEME.title} fontSize="xl" fontWeight="medium">
                  {stat.title}
                </Text>
              ) : (
                <Skeleton isLoaded={isLoaded} w="32" h="6">
                  SkeletonText
                </Skeleton>
              )}
            </Flex>
            {isLoaded ? (
              <Text color={THEME.title} fontSize="xl" fontWeight="normal">
                {stat.value}
              </Text>
            ) : (
              <Skeleton isLoaded={isLoaded} w="20" h="6">
                SkeletonText
              </Skeleton>
            )}
          </Flex>
        ))}
      </Flex>
      <Flex justify="center" align="center">
        {isLoaded ? (
          <Button
            bgColor="red.800"
            fontSize="xl"
            px="6"
            py="6"
            fontWeight="medium"
            _hover={{}}
            _focus={{}}
            _active={{}}
          >
            Delegate
          </Button>
        ) : (
          <Skeleton isLoaded={isLoaded} w="36" h="12">
            SkeletonText
          </Skeleton>
        )}
      </Flex>
    </Flex>
  );
};
