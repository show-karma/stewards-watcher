import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ChakraLink } from 'components/ChakraLink';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO, useDelegates } from 'contexts';
import moment from 'moment';
import { FC, useEffect, useMemo, useState } from 'react';
import { IDelegatingHistories } from 'types';
import { addressToENSName, formatNumber, truncateAddress } from 'utils';
import { PerformanceStats } from './PerformanceStats';
import { VotingHistory } from './VotingHistory';

interface IDelegationCardProps {
  userDelegating: {
    name?: string;
    address: string;
    picture?: string;
    amountDelegated?: string | number;
  };
  userDelegatedTo: {
    name?: string;
    address: string;
    picture?: string;
  };
  data: IDelegatingHistories[];
  selectedDelegation: IDelegatingHistories;
}

export const DelegationCard: FC<IDelegationCardProps> = ({
  userDelegatedTo,
  userDelegating,
  data,
  selectedDelegation,
}) => {
  const { theme, daoInfo } = useDAO();

  const { tracks } = useDelegates();

  const getTrackText = (delegate: IDelegationCardProps['userDelegatedTo']) => {
    const delegationData = data.find(
      item => item.toDelegate === delegate.address
    );

    if (delegationData && typeof delegationData.trackId === 'number') {
      const hasTrack = tracks.find(
        track => track.id === delegationData.trackId
      );
      if (hasTrack) {
        return hasTrack.displayName;
      }
    }

    return '';
  };

  const sinceDate = moment
    .unix(selectedDelegation.timestamp)
    .format('MMM DD, YYYY');

  const [delegatedUserEnsName, setDelegatedUserEnsName] = useState(
    truncateAddress(userDelegatedTo.address)
  );
  const [isLoadingEnsName, setIsLoadingEnsName] = useState(true);

  const checkENSName = async () => {
    try {
      setIsLoadingEnsName(true);
      const name = await addressToENSName(userDelegatedTo.address);
      if (name) {
        if (name.toLowerCase() === userDelegatedTo.address.toLowerCase()) {
          setDelegatedUserEnsName(truncateAddress(userDelegatedTo.address));
          return;
        }
        setDelegatedUserEnsName(name);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEnsName(false);
    }
  };

  useEffect(() => {
    if (!userDelegatedTo.name) checkENSName();
  }, [userDelegatedTo.address]);

  return (
    <AccordionItem borderRadius="md" borderBottomRadius="md" _hover={{}}>
      {({ isExpanded }) => (
        <>
          <Flex
            bg={theme.tokenHolders.delegations.bg.primary}
            px="6"
            py="4"
            borderTopRadius="md"
            borderBottomRadius={isExpanded ? '0' : 'md'}
            flexDir={{ base: 'column', md: 'row' }}
            gap="4"
          >
            <Flex
              w="full"
              borderRadius="md"
              borderBottomRadius="0"
              color={theme.tokenHolders.delegations.text.primary}
            >
              <Flex
                flex="1"
                textAlign="left"
                w="full"
                gap={{ base: '2', lg: '2' }}
                align="center"
                flexWrap="wrap"
              >
                <Flex
                  flexDir="row"
                  align="center"
                  gap="2"
                  bg={theme.tokenHolders.delegations.card.header.pillBg}
                  py="2"
                  px="2"
                  borderRadius="40px"
                >
                  <ImgWithFallback
                    fallback={userDelegating.address}
                    src={userDelegating.picture}
                    boxSize={{ base: '20px', lg: '26px' }}
                    borderRadius="full"
                  />
                  <Text
                    color={theme.tokenHolders.delegations.card.header.pillText}
                    fontSize={{ base: 'sm' }}
                    fontWeight="normal"
                    maxW={{ base: '150px', sm: '200px' }}
                    w="max-content"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {userDelegating.name ||
                      truncateAddress(userDelegating.address)}
                  </Text>
                </Flex>
                <Text
                  color={theme.tokenHolders.delegations.card.header.text}
                  fontWeight="normal"
                  fontSize={{ base: 'sm', lg: 'md' }}
                >
                  has delegated
                </Text>
                {userDelegating.amountDelegated ? (
                  <Text
                    color={theme.tokenHolders.delegations.card.header.pillText}
                    fontSize={{ base: 'sm' }}
                    fontWeight="700"
                    p="1"
                    borderRadius="md"
                    maxW="210px"
                    w="max-content"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {formatNumber(userDelegating.amountDelegated)} tokens
                  </Text>
                ) : null}
                <Text
                  color={theme.tokenHolders.delegations.card.header.text}
                  fontWeight="normal"
                  fontSize={{ base: 'sm', lg: 'md' }}
                >
                  to
                </Text>
                <Flex
                  flexDir="row"
                  align="center"
                  gap="2"
                  bg={theme.tokenHolders.delegations.card.header.pillBg}
                  py="2"
                  px="2"
                  borderRadius="40px"
                >
                  <ImgWithFallback
                    fallback={userDelegatedTo.address}
                    src={userDelegatedTo.picture}
                    boxSize={{ base: '20px', lg: '26px' }}
                    borderRadius="full"
                  />
                  <Skeleton isLoaded={!isLoadingEnsName}>
                    <ChakraLink
                      color={
                        theme.tokenHolders.delegations.card.header.pillText
                      }
                      fontSize={{ base: 'sm' }}
                      fontWeight="normal"
                      maxW="170px"
                      w="max-content"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textDecoration="underline"
                      isExternal
                      href={`https://karmahq.xyz/dao/${daoInfo.config.DAO_KARMA_ID}/delegators/${userDelegatedTo.address}`}
                    >
                      {userDelegatedTo.name || delegatedUserEnsName}
                    </ChakraLink>
                  </Skeleton>
                </Flex>
                <Text
                  color={theme.tokenHolders.delegations.card.header.text}
                  fontWeight="normal"
                  fontSize={{ base: 'sm', lg: 'md' }}
                >
                  since
                </Text>
                <Text
                  color={theme.tokenHolders.delegations.card.header.text}
                  fontWeight="700"
                  fontSize={{ base: 'sm', lg: 'md' }}
                >
                  {sinceDate}
                </Text>
                <Tooltip
                  label={
                    daoInfo.config.TRACKS_DICTIONARY &&
                    daoInfo.config.TRACKS_DICTIONARY[
                      getTrackText(userDelegatedTo)
                    ]
                      ? daoInfo.config.TRACKS_DICTIONARY[
                          getTrackText(userDelegatedTo)
                        ].description
                      : undefined
                  }
                  bg={theme.collapse.bg || theme.card.background}
                  color={theme.collapse.text}
                >
                  <Flex flexDir="row">
                    <Text>Track:</Text>
                    <Flex flexDir="row" gap="1">
                      <Text>
                        {daoInfo.config.TRACKS_DICTIONARY &&
                        daoInfo.config.TRACKS_DICTIONARY[
                          getTrackText(userDelegatedTo)
                        ]
                          ? daoInfo.config.TRACKS_DICTIONARY[
                              getTrackText(userDelegatedTo)
                            ].emoji
                          : undefined}
                      </Text>
                      <Text>{getTrackText(userDelegatedTo)}</Text>
                    </Flex>
                  </Flex>
                </Tooltip>
              </Flex>
            </Flex>
            <AccordionButton
              w={{ base: 'full', sm: 'max-content' }}
              minW="max-content"
              color={theme.tokenHolders.delegations.accordion.button.text}
              borderColor={theme.tokenHolders.delegations.accordion.button.text}
              borderWidth="1px"
              borderStyle="solid"
              fontWeight="600"
              fontSize="14px"
              px="4"
              py="3"
              borderRadius="4px"
              gap="10px"
              justifyContent="space-between"
              _hover={{
                opacity: '0.8',
              }}
            >
              <Flex
                align="center"
                h="full"
                w="full"
                gap="10px"
                justifyContent="space-between"
              >
                View delegate activity
                <AccordionIcon width="24px" h="24px" />
              </Flex>
            </AccordionButton>
          </Flex>
          <AccordionPanel
            bg={theme.tokenHolders.delegations.bg.primary}
            pb={4}
            px="0"
            pt="0"
            borderBottomRadius="md"
          >
            <Flex
              px="6"
              py="3"
              bgColor={theme.tokenHolders.delegations.card.legend.bg}
              gap="2"
              align="center"
              flexWrap="wrap"
            >
              <Text
                color={theme.tokenHolders.delegations.card.legend.text}
                fontWeight="700"
                fontSize="11px"
              >
                PERFORMANCE SUMMARY FOR
              </Text>
              <Flex
                gap="1"
                bgColor={theme.tokenHolders.delegations.card.legend.pillBg}
                pl="1"
                pr="2"
                py="1"
                borderRadius="full"
                align="center"
              >
                <ImgWithFallback
                  fallback={userDelegatedTo.address}
                  src={userDelegatedTo.picture}
                  boxSize={{ base: '20px', lg: '26px' }}
                  borderRadius="full"
                />
                <Skeleton isLoaded={!isLoadingEnsName}>
                  <Text
                    color={theme.tokenHolders.delegations.card.legend.pillText}
                    fontWeight="700"
                    fontSize={{ base: '14px', lg: '16px' }}
                  >
                    {userDelegatedTo.name || delegatedUserEnsName}
                  </Text>
                </Skeleton>
              </Flex>
              <Text
                color={theme.tokenHolders.delegations.card.legend.text}
                fontWeight="700"
                fontSize="11px"
              >
                SINCE
              </Text>

              <Text
                bgColor={theme.tokenHolders.delegations.card.legend.pillBg}
                px="2"
                py="1"
                borderRadius="full"
                color={theme.tokenHolders.delegations.card.legend.pillText}
                fontWeight="700"
                fontSize={{ base: '14px', lg: '16px' }}
              >
                {sinceDate}
              </Text>
            </Flex>

            <Flex
              gap="6"
              flexDir="row"
              justify="space-between"
              pt="6"
              pb="20"
              pr={{ base: '4', lg: '8' }}
              pl={{ base: '2', lg: '4' }}
              align="flex-start"
              w="full"
              flexWrap={{ base: 'wrap', xl: 'nowrap' }}
            >
              <PerformanceStats
                userDelegatedTo={{
                  name: userDelegatedTo.name,
                  address: userDelegatedTo.address,
                  picture: userDelegatedTo.picture,
                }}
                selectedDelegation={selectedDelegation}
                delegations={data}
              />
              <VotingHistory address={userDelegatedTo.address} />
            </Flex>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
