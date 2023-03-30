import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { IDelegatingHistories } from 'types';
import { formatNumber, truncateAddress } from 'utils';
import { DelegationHistory } from './DelegationHistory';
import { SinceDelegation } from './SinceDelegation';

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
  const { theme } = useDAO();

  return (
    <AccordionItem
      borderWidth="1px"
      borderRadius="md"
      borderBottomRadius="0"
      borderColor={`${theme.tokenHolders.delegations.text.primary}0D`}
      _hover={{}}
      mb="8"
    >
      <AccordionButton
        w="full"
        bg={theme.tokenHolders.delegations.bg.primary}
        borderRadius="md"
        borderBottomRadius="0"
        _hover={{
          opacity: '0.8',
        }}
        color={theme.tokenHolders.delegations.text.primary}
      >
        <Flex
          flex="1"
          textAlign="left"
          w="full"
          flexDir="row"
          gap="2"
          align="center"
          flexWrap="wrap"
        >
          <ImgWithFallback
            fallback={userDelegating.address}
            src={userDelegating.picture}
            boxSize={{ base: '20px', lg: '26px' }}
            borderRadius="full"
          />
          <Text
            fontWeight="bold"
            fontSize={{ base: 'sm', lg: 'md' }}
            color={`${theme.tokenHolders.delegations.text.primary}80`}
            maxW="200px"
            w="max-content"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {userDelegating.name || truncateAddress(userDelegating.address)}
          </Text>
          <Text
            color={theme.tokenHolders.delegations.text.primary}
            fontWeight="normal"
            fontSize={{ base: 'sm', lg: 'md' }}
          >
            has currently delegated
          </Text>
          {userDelegating.amountDelegated && (
            <Text
              bg={theme.tokenHolders.delegations.bg.tertiary}
              color={theme.tokenHolders.delegations.text.primary}
              fontWeight="bold"
              fontSize="2xl"
              py="1"
              px="3"
              borderRadius="md"
              minH="43px"
              maxW="210px"
              w="max-content"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {formatNumber(userDelegating.amountDelegated)} tokens
            </Text>
          )}
          <Text
            color={theme.tokenHolders.delegations.text.primary}
            fontWeight="normal"
            fontSize={{ base: 'sm', lg: 'md' }}
          >
            to delegate:
          </Text>
          <Flex
            flexDir="row"
            align="center"
            gap="2"
            bg={theme.tokenHolders.delegations.bg.tertiary}
            py="1"
            px="2"
            borderRadius="md"
            minH="43px"
          >
            <ImgWithFallback
              fallback={userDelegatedTo.address}
              src={userDelegatedTo.picture}
              boxSize={{ base: '20px', lg: '26px' }}
              borderRadius="full"
            />
            <Text
              color={theme.tokenHolders.delegations.text.primary}
              fontWeight="semibold"
              fontSize={{ base: 'sm', lg: 'lg' }}
              maxW="170px"
              w="max-content"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {userDelegatedTo.name || truncateAddress(userDelegatedTo.address)}
            </Text>
          </Flex>
        </Flex>
        <AccordionIcon boxSize="8" />
      </AccordionButton>
      <AccordionPanel
        bg={`${theme.tokenHolders.delegations.text.primary}05`}
        pb={4}
      >
        <Flex
          gap="6"
          flexDir="row"
          justify="space-between"
          pt="6"
          pb="20"
          pr={{ base: '4', lg: '8' }}
          pl={{ base: '2', lg: '4' }}
          align="center"
          w="full"
          flexWrap={{ base: 'wrap', xl: 'nowrap' }}
        >
          <DelegationHistory
            delegateHistory={data}
            selectedDelegation={selectedDelegation}
          />
          <SinceDelegation
            userDelegatedTo={{
              name: userDelegatedTo.name,
              address: userDelegatedTo.address,
              picture: userDelegatedTo.picture,
            }}
            selectedDelegation={selectedDelegation}
            delegations={data}
          />
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
