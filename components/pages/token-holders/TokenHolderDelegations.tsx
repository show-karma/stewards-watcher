import { Button, Flex, Input, Spinner, Text } from '@chakra-ui/react';
import { CloseIcon, SearchUserIcon } from 'components/Icons';
import { useDAO, useTokenHolders } from 'contexts';
import { FC, useState } from 'react';
import { truncateAddress } from 'utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DelegatesAccordion } from './DelegatesAccordion';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
const ensNameRegex = /^\S+\.eth$/;

export const TokenHolderDelegation: FC = () => {
  const { theme } = useDAO();

  const {
    changeAddresses,
    isLoadingSelectedAddresses: isLoading,
    isFetchingSelectedAddresses: isFetching,
    selectedAddressesData: tokenholders,
    selectedAddresses,
  } = useTokenHolders();

  const [addresses, setAddresses] = useState<string[]>(selectedAddresses);

  const splitAddressesText = (text: string) => {
    const removedSpaces = text.replace(/\s/g, '');
    const splitTexts = removedSpaces.split(',');
    const filteredTexts = splitTexts.filter(item => item !== '');
    return filteredTexts;
  };

  const schema = yup.object({
    addressInput: yup
      .string()
      .test('already-exists', 'Address already added.', value => {
        if (!value) return true;
        // if (addresses.includes(value)) return false;
        const addrs = splitAddressesText(value);
        if (addrs.length === 0) return false;
        const isInvalid = addrs.find(addr => {
          const alreadyExists = addresses.includes(addr);
          return alreadyExists;
        });
        if (isInvalid) return false;
        const duplicate = addrs.find((item, index) => {
          const firstIndex = addrs.indexOf(item);
          return firstIndex !== index;
        });
        if (duplicate) return false;
        return true;
      })
      .test(
        'is-valid-address',
        'Please enter a valid address or ENS name.',
        value => {
          if (!value && addresses.length !== 0) return true;
          if (value) {
            const addrs = splitAddressesText(value);
            if (addrs.length === 0) return false;
            const isValid = addrs.every(addr => {
              if (addressRegex.test(addr) || ensNameRegex.test(addr))
                return true;
              return false;
            });
            return isValid;
          }
          return false;
        }
      ),
  });
  type FormData = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const disableButtonCondition =
    isFetching && isLoading && !!errors.addressInput;

  const sendAddresses = (addrs: string[]) => {
    changeAddresses(addrs.join(','));
  };

  const inputValue = watch('addressInput');

  const clearInput = () => {
    reset({ addressInput: '' });
    clearErrors('addressInput');
  };

  const removeAddress = (addr: string) => {
    setAddresses(prev => prev.filter(address => address !== addr));
  };

  const handleMultiple = (text = inputValue) => {
    if (!text) return;
    const filteredTexts = splitAddressesText(text);
    setAddresses(previous => {
      const newAddresses = [...previous, ...filteredTexts];
      sendAddresses(newAddresses);
      return newAddresses;
    });
    clearInput();
  };

  const onSubmit = () => {
    if (!inputValue && addresses.length) {
      sendAddresses(addresses);
      return;
    }
    handleMultiple();
  };

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
    <Flex w="full" flexDir="column" px={{ base: '4', xl: '0' }}>
      <Flex
        w="full"
        flexDir="column"
        align="flex-start"
        h="max-content"
        pt="7"
        pb="3"
      >
        <Flex flexDir="row" gap="3">
          <SearchUserIcon
            w="8"
            h="8"
            color={theme.tokenHolders.delegations.bg.tertiary}
          />
          <Flex flexDir="column" gap="2">
            <Text
              fontStyle="normal"
              fontWeight="600"
              fontSize={{ base: '20px', xl: '24px' }}
              color={theme.tokenHolders.delegations.text.primary}
              lineHeight="1.25"
            >
              Delegate Activity Tracker
            </Text>
            <Text
              fontStyle="normal"
              fontWeight="normal"
              fontSize={{ base: '14px' }}
              color={theme.tokenHolders.delegations.text.secondary}
              textAlign="left"
            >
              {`Get real-time token balance data of delegators across multiple DAOs by
          simply selecting a DAO and entering a delegate address. Click "Show
          Delegators" to see a table with the Delegator Address and Token
          Balance.`}
            </Text>
          </Flex>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Flex
            bg={theme.tokenHolders.delegations.bg.primary}
            py="6"
            px="8"
            borderRadius="md"
            mt="6"
            mb="7"
            align="center"
            w="full"
            gap="6"
            flexDir={{ base: 'column', lg: 'row' }}
          >
            <Flex flexDir="column" w="full">
              <Text fontWeight="700" fontSize="14px" color="#080A0E">
                Enter one or multiple token holder addresses
              </Text>
              <Flex w="full" position="relative" flexDirection="column">
                <Flex
                  flex="1"
                  h="max-content"
                  bg={theme.tokenHolders.delegations.bg.primary}
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor={theme.tokenHolders.delegations.border.input}
                  borderRadius="4px"
                  flexWrap="wrap"
                  align="center"
                  minH="50px"
                >
                  {addresses.map((addr, index) => (
                    <Button
                      color={theme.tokenHolders.delegations.input.pillText}
                      bg={theme.tokenHolders.delegations.input.pillBg}
                      w="max-content"
                      my="1"
                      mx="2"
                      py="0"
                      borderRadius="full"
                      fontWeight="400"
                      fontSize="14px"
                      gap="1"
                      _hover={{
                        opacity: 0.8,
                      }}
                      _focus={{}}
                      _active={{}}
                      _focusWithin={{}}
                      key={+index}
                      onClick={() => removeAddress(addr)}
                    >
                      {addressRegex.test(addr) ? truncateAddress(addr) : addr}
                      <CloseIcon boxSize={6} />
                    </Button>
                  ))}

                  <Flex flex="1">
                    <Input
                      color={theme.tokenHolders.delegations.text.input.text}
                      bg="transparent"
                      border="none"
                      fontSize={{ base: '12px', lg: '14px' }}
                      w="full"
                      px="4"
                      py="4"
                      outline="none"
                      boxShadow="none"
                      placeholder={
                        addresses.length
                          ? undefined
                          : '0x5e3…09ee,0g4e3…04de,0x5e3…09ee'
                      }
                      maxW="full"
                      minW="100px"
                      _placeholder={{
                        color:
                          theme.tokenHolders.delegations.text.input.placeholder,
                      }}
                      _disabled={{
                        opacity: 0.5,
                      }}
                      _hover={{
                        outline: 'none',
                        boxShadow: 'none',
                      }}
                      _focusVisible={{
                        outline: 'none',
                        boxShadow: 'none',
                      }}
                      {...register('addressInput')}
                      onKeyDown={event => {
                        if (
                          event.key === 'Backspace' &&
                          (inputValue === '' || !inputValue) &&
                          addresses.length > 0
                        )
                          removeAddress(addresses[addresses.length - 1]);
                      }}
                    />
                  </Flex>
                </Flex>
              </Flex>

              {errors.addressInput && errors.addressInput.message ? (
                <Text fontWeight="400" fontSize="14px" color="red.300">
                  {errors.addressInput.message}
                </Text>
              ) : (
                <Text
                  fontWeight="400"
                  fontSize="14px"
                  color={theme.tokenHolders.delegations.text.input.placeholder}
                >
                  When entering multiple addresses use a comma to separate them
                </Text>
              )}
            </Flex>
            <Button
              bg={theme.tokenHolders.delegations.bg.tertiary}
              color={theme.tokenHolders.delegations.text.button}
              px={{ base: '4', lg: '8' }}
              w="full"
              maxW={{ base: 'full', lg: '233px' }}
              h="50px"
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
              isLoading={isFetching}
              disabled={disableButtonCondition}
              isDisabled={disableButtonCondition}
              type="submit"
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Flex>
      <Flex flexDir="column" w="full" minH="200px" gap="4">
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
