import { Button, Flex, Text } from '@chakra-ui/react';
import { VotesToDelegate } from 'components/Modals/Delegate/VotesToDelegate';
import { useDAO, useDelegates, useGovernanceVotes } from 'contexts';
import React from 'react';
import { useProvider } from 'wagmi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract } from '@wagmi/core';
// import { IDelegate, ITracks } from 'types';
import { DelegatePoolList } from './DelegatePoolList';
import { EmptyDelegatePool } from './EmptyDelegatePool';

export const DelegationPool: React.FC = () => {
  const { theme, daoInfo, daoData } = useDAO();
  const { delegatePoolList, removeFromDelegatePool } = useDelegates();
  const { votes } = useGovernanceVotes();

  const handleDelegation = () => {
    if (daoInfo.config.BULK_DELEGATE_ACTION)
      return daoInfo.config.BULK_DELEGATE_ACTION(
        delegatePoolList.map(payload => ({
          ...payload,
          amount: votes,
        })),
        writeContract
      );
    return null;
  };

  return (
    <Flex
      bg={theme.card.background}
      boxShadow={theme.card.shadow}
      borderRadius="xl"
      w="full"
      flexDir={{ base: 'column', xl: 'row' }}
      flexWrap="wrap"
      gap="8"
      align={{ base: 'flex-start', xl: 'center' }}
      py="5"
      px="4"
      mt="1.5rem"
    >
      <Flex
        justifyContent="space-between"
        w="full"
        direction="row"
        flexWrap="wrap"
      >
        <Flex alignItems="center">
          <Text
            fontFamily="heading"
            fontWeight="bold"
            color={theme.filters.head}
            borderRight={
              delegatePoolList.length > 0 ? '1px solid #CED1D4' : 'none'
            }
            pr={5}
            mr={5}
            py={3}
          >
            Group delegation
          </Text>
          {delegatePoolList.length ? (
            <Flex alignItems="center" flexWrap="wrap" gap="2">
              <Text>You are delegating</Text>
              <VotesToDelegate
                logoUrl={
                  daoData?.socialLinks?.logoUrl || daoInfo.config.DAO_LOGO
                }
                daoName={daoInfo.config.DAO}
                votes={votes}
              />
              <Text>to the following users</Text>
            </Flex>
          ) : (
            <Text color="#7E8C9D">No delegates selected</Text>
          )}
        </Flex>
        <Flex alignItems="center">
          <Button
            disabled={
              !delegatePoolList.length ||
              !!delegatePoolList.find(delegate => delegate.tracks.length === 0)
            }
            isDisabled={
              !delegatePoolList.length ||
              !!delegatePoolList.find(delegate => delegate.tracks.length === 0)
            }
            background={delegatePoolList.length ? theme.branding : '#CED1D4'}
            color="white"
            onClick={handleDelegation}
            _hover={{
              opacity: 0.8,
            }}
            _active={{
              opacity: 0.8,
            }}
            _focus={{
              opacity: 0.8,
            }}
            _focusVisible={{
              opacity: 0.8,
            }}
            _focusWithin={{
              opacity: 0.8,
            }}
            _disabled={{
              opacity: 0.5,
            }}
          >
            Delegate
          </Button>
        </Flex>
      </Flex>
      {delegatePoolList.length ? (
        <DelegatePoolList
          delegates={delegatePoolList}
          onRemove={removeFromDelegatePool}
        />
      ) : (
        <EmptyDelegatePool />
      )}
    </Flex>
  );
};
