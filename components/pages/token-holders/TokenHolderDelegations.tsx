import {
  Button,
  Divider,
  Flex,
  Input,
  Spinner,
  Text,
  useFocusEffect,
} from '@chakra-ui/react';
import { useDAO, useTokenHolders } from 'contexts';
import { FC, useMemo, useRef, useState } from 'react';

import { DelegatesAccordion } from './DelegatesAccordion';

export const TokenHolderDelegation: FC = () => {
  const { theme } = useDAO();

  const {
    changeAddresses,
    isLoadingSelectedAddresses: isLoading,
    isFetchingSelectedAddresses: isFetching,
    selectedAddressesData: tokenholders,
    selectedAddresses,
  } = useTokenHolders();

  const [inputValue, setInputValue] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const inputRef = useRef(null);
  useFocusEffect(inputRef, {
    shouldFocus: !showPlaceholder && !inputValue,
  });
  const disableButtonCondition = isFetching && isLoading && !inputValue;

  const changeInput = (text: string) => {
    setInputValue(text);
  };

  useMemo(() => {
    if (selectedAddresses.join(',') !== inputValue) {
      setInputValue(selectedAddresses.join(','));
    }
  }, [selectedAddresses]);

  useMemo(() => {
    if (inputValue) {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
  }, [inputValue]);

  const renderItems = () => {
    if (!tokenholders)
      return (
        <Flex align="center" w="full" justify="center" my="8">
          <Text
            fontStyle="normal"
            fontWeight="normal"
            fontSize={{ base: '16px', xl: '20px' }}
            color={theme.tokenHolders.delegations.text.primary}
          >
            No addresses found.
          </Text>
        </Flex>
      );
    if (tokenholders.length === 0) return undefined;
    return tokenholders.map((holderData, index) => {
      const { length } = Object.keys(holderData.delegatingHistories);
      if (!length) return null;
      return <DelegatesAccordion holderData={holderData} key={+index} />;
    });
  };

  return (
    <Flex w="full" flexDir="column">
      <Flex
        borderWidth="1.5px"
        borderColor={theme.tokenHolders.border}
        borderStyle="solid"
        borderTop="none"
        w="full"
        flexDir="column"
        align="center"
        h="max-content"
        py="7"
      >
        <Text
          fontStyle="normal"
          fontWeight="600"
          fontSize={{ base: '20px', xl: '24px' }}
          color={theme.tokenHolders.delegations.text.primary}
        >
          Token Holder Delegation
        </Text>
        <Text
          fontStyle="normal"
          fontWeight="normal"
          fontSize={{ base: '16px', xl: '20px' }}
          color={theme.tokenHolders.delegations.text.secondary}
          mt="2"
          px="2"
          textAlign="center"
        >
          Enter one or more token holder addresses to see their activity
        </Text>
        <Flex
          bg={theme.tokenHolders.delegations.bg.primary}
          px="4"
          py="5"
          borderRadius="md"
          mt="6"
          mb="7"
          align="center"
        >
          <Flex
            maxW={{ base: '200px', lg: '300px', xl: '462px' }}
            minW={{ base: '200px', lg: '300px', xl: '462px' }}
            w="full"
            position="relative"
          >
            <Input
              ref={inputRef}
              bg={`${theme.tokenHolders.delegations.bg.secondary}BF`}
              color={theme.tokenHolders.delegations.text.primary}
              fontSize={{ base: '12px', lg: '14px' }}
              w="full"
              px="4"
              py="4"
              border="none"
              outline="none"
              boxShadow="none"
              onFocus={() => setShowPlaceholder(false)}
              onBlur={() => setShowPlaceholder(true)}
              _placeholder={{
                color: `${theme.tokenHolders.delegations.text.primary}33`,
              }}
              _disabled={{
                opacity: 0.5,
              }}
              _hover={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              }}
              _focusVisible={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              }}
              value={inputValue}
              onChange={event => changeInput(event.target.value)}
            />
            {showPlaceholder && !inputValue && (
              <Flex
                position="absolute"
                left="16px"
                top="8px"
                userSelect="none"
                cursor="text"
                onClick={() => setShowPlaceholder(false)}
                fontSize={{ base: '12px', lg: '14px' }}
                maxW={{ base: '170px', lg: '240px', xl: '462px' }}
                w="full"
                overflow="hidden"
              >
                <Text
                  fontWeight="500"
                  as="span"
                  color={`${theme.tokenHolders.delegations.text.primary}33`}
                >
                  0x5e3…09ee
                </Text>
                <Text
                  fontWeight="500"
                  as="span"
                  color={theme.tokenHolders.delegations.text.primary}
                  mr="1"
                >
                  ,
                </Text>
                <Text
                  fontWeight="500"
                  as="span"
                  color={`${theme.tokenHolders.delegations.text.primary}33`}
                >
                  0g4e3…04de
                </Text>
                <Text
                  fontWeight="500"
                  as="span"
                  color={theme.tokenHolders.delegations.text.primary}
                  mr="1"
                >
                  ,
                </Text>
                <Text
                  fontWeight="500"
                  as="span"
                  color={`${theme.tokenHolders.delegations.text.primary}33`}
                >
                  0x5e3…09ee
                </Text>
              </Flex>
            )}
          </Flex>
          <Divider bgColor={`${theme.tokenHolders.border}0D`} w="4" />
          <Button
            bg={theme.tokenHolders.delegations.bg.tertiary}
            color={theme.tokenHolders.delegations.text.primary}
            _disabled={{
              opacity: 0.5,
            }}
            _hover={{
              opacity: 0.8,
            }}
            _active={{
              opacity: 0.8,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            _focus={{
              opacity: 0.8,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            _focusVisible={{
              opacity: 0.8,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            _focusWithin={{
              opacity: 0.8,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            onClick={() => changeAddresses(inputValue)}
            isLoading={isFetching}
            disabled={disableButtonCondition}
            isDisabled={disableButtonCondition}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
      <Flex
        flexDir="column"
        w="full"
        borderWidth="1px"
        borderColor={theme.tokenHolders.border}
        borderStyle="solid"
        borderTop="none"
        borderBottom="none"
        minH="200px"
      >
        {isFetching ? (
          <Flex w="full" align="center" justify="center" minH="40">
            <Spinner
              boxSize="10"
              color={theme.tokenHolders.delegations.text.primary}
            />
          </Flex>
        ) : (
          renderItems()
        )}
      </Flex>
    </Flex>
  );
};
