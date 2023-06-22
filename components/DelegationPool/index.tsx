import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { VotesToDelegate } from 'components/Modals/Delegate/VotesToDelegate';
import { useDAO, useDelegates, useGovernanceVotes } from 'contexts';
import React, { useMemo, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract, waitForTransaction } from '@wagmi/core';
import { useToasty } from 'hooks';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { DelegatePoolList } from './DelegatePoolList';
import { EmptyDelegatePool } from './EmptyDelegatePool';

export const DelegationPool: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme, daoInfo, daoData } = useDAO();
  const {
    delegatePoolList,
    removeFromDelegatePool,
    clearDelegationPool,
    delegationWillHaveError,
  } = useDelegates();

  const { votes } = useGovernanceVotes();
  const { toast } = useToasty();

  const votesToDelegate = useMemo(() => {
    const totalVotes = delegatePoolList.reduce(
      (acc, cur) => acc + +cur.amount,
      0
    );
    return totalVotes >= +votes
      ? (+votes - 1).toString()
      : totalVotes.toString();
  }, [delegatePoolList]);

  const handleDelegation = async () => {
    if (daoInfo.config.BULK_DELEGATE_ACTION) {
      try {
        setIsLoading(true);
        const hash = await daoInfo.config.BULK_DELEGATE_ACTION(
          delegatePoolList,
          writeContract
        );

        await waitForTransaction({
          hash,
        });

        clearDelegationPool();

        toast({
          title: 'Delegation successful',
          description: `Transaction ${hash} completed.`,
          status: 'success',
        });
      } catch (error: any) {
        let errorMessage = '';

        if (error instanceof BaseError) {
          // Option 1: checking the instance of the error
          if (error.cause instanceof ContractFunctionRevertedError) {
            const { cause } = error;
            errorMessage = cause.message;
          }
          // Option 2: using `walk` method from `BaseError`
          const revertError = error.walk(
            err => err instanceof ContractFunctionRevertedError
          ) as ContractFunctionRevertedError;
          if (revertError) {
            errorMessage = revertError.message;
            // regex to get what is between "message":" and "
            const regex = /(?<="message":")(.*)(?=")/gm;
            const customMessage = errorMessage.match(regex)?.[0];
            if (customMessage) {
              errorMessage = customMessage;
            }
          }
        }

        if (errorMessage?.includes('message: ')) {
          // regex to get what is between Some(" and ")
          const regex = /(?<=Some\(")(.*)(?="\))/gm;
          const message = errorMessage.match(regex)?.[0];
          if (!message) {
            toast({
              title: 'Delegation failed',
              description: `Transaction failed.`,
              status: 'error',
            });
            return;
          }
          const dictionary = daoInfo.config.DELEGATION_ERRORS_DICTIONARY;
          if (dictionary && dictionary[message]) {
            toast({
              title: 'Delegation failed',
              description: `${dictionary[message]}`,
              status: 'error',
            });
            return;
          }
          // regex to remove camelcase to spaces and capitalize first letter of first word
          const regex2 = /([A-Z])/g;
          const messageFormatted = message.replace(regex2, ' $1');

          toast({
            title: 'Delegation failed',
            description: `${messageFormatted} 22`,
            status: 'error',
          });
        } else if (
          error.stack?.includes('code=ACTION_REJECTED') ||
          error.stack?.includes('code=4001') ||
          error.message.includes('User rejected')
        ) {
          toast({
            title: 'Error',
            description: 'The transaction was cancelled. Please try again.',
            status: 'error',
          });
        } else if (errorMessage) {
          toast({
            title: 'Delegation failed',
            description: `${errorMessage}`,
            status: 'error',
          });
        } else {
          toast({
            title: 'Delegation failed',
            description: `Transaction failed.`,
            status: 'error',
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
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
      position="relative"
    >
      {isLoading && (
        <Box
          position="absolute"
          top="0"
          borderRadius="xl"
          left="0"
          w="full"
          h="full"
          bg="rgba(255,255,255,0.5)"
          zIndex="1"
        />
      )}
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
                votes={votesToDelegate}
                hideNoTokens
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
              !!delegatePoolList.find(
                delegate => delegate.tracks.length === 0
              ) ||
              delegationWillHaveError
            }
            isDisabled={
              !delegatePoolList.length ||
              !!delegatePoolList.find(
                delegate => delegate.tracks.length === 0
              ) ||
              delegationWillHaveError
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
