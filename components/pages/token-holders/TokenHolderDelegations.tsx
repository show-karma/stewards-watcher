import { Button, Divider, Flex, Input, Spinner, Text } from '@chakra-ui/react';
import { CloseIcon } from 'components/Icons';
import { useDAO, useTokenHolders } from 'contexts';
import { FC, useMemo, useState } from 'react';
import { truncateAddress } from 'utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChakraLink } from 'components/ChakraLink';
import { DelegatesAccordion } from './DelegatesAccordion';

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
const ensNameRegex = /^\S+\.eth$/;

export const TokenHolderDelegation: FC = () => {
  const { theme, rootPathname } = useDAO();

  const {
    changeAddresses,
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

  useMemo(() => {
    setAddresses(selectedAddresses);
  }, [selectedAddresses]);

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

  const {
    handleSubmit,
    register,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const sendAddresses = (addrs: string[]) => {
    changeAddresses(addrs.join(','));
  };

  const inputValue = watch('addressInput');

  const disableButtonCondition =
    isFetching || !!errors.addressInput || (!inputValue && !addresses.length);

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

  const getAddressesToAText = () => {
    if (!selectedAddresses) return '';
    const addrs = selectedAddresses.map(addr =>
      addressRegex.test(addr) ? truncateAddress(addr) : addr
    );
    return addrs.join(', ');
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
            This address has not delegated any tokens. <br /> Find a suitable
            candidate and delegate your tokens{' '}
            <ChakraLink
              href={`${rootPathname}/`}
              isExternal
              textDecor="underline"
            >
              here.
            </ChakraLink>
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
        <Flex
          flexDir={{ base: 'column', lg: 'row' }}
          gap={{ base: '4', lg: '16' }}
          w="full"
          align="center"
        >
          <Flex
            flexDir={{ base: 'column', lg: 'row' }}
            gap={{ base: '20px', lg: '40px' }}
          >
            <Text
              fontStyle="normal"
              fontWeight="600"
              fontSize={{ base: '24px' }}
              color={theme.tokenHolders.delegations.text.primary}
              lineHeight="1.25"
              maxW="max-content"
              minW="max-content"
              w="max-content"
              textAlign={{ base: 'center', lg: 'left' }}
            >
              Delegate <Text as="br" />
              Activity Tracker
            </Text>
            <Divider
              display={{ base: 'none', lg: 'unset' }}
              h="100px"
              orientation="vertical"
              bg={theme.tokenHolders.delegations.text.primary}
            />
          </Flex>
          <Flex w="full" align="center" justify="center">
            <Flex
              position="relative"
              w={{ base: 'max-content' }}
              align="center"
            >
              <Flex
                h={{ base: '660px', lg: '1px' }}
                w={{ base: '1px', lg: '660px' }}
                maxW={{
                  base: '1px',
                  lg: 'calc(100% - 200px)',
                  xl: 'calc(100% - 224px)',
                }}
                maxH={{
                  base: 'calc(100% - 70px)',
                  lg: '1px',
                }}
                background={{
                  base: `repeating-linear-gradient(
                  to bottom,
                  transparent,
                  transparent 5px,
                  ${theme.tokenHolders.stepsColor} 5px,
                  ${theme.tokenHolders.stepsColor} 10px
                )`,
                  lg: `repeating-linear-gradient(
                to right,
                transparent,
                transparent 5px,
                ${theme.tokenHolders.stepsColor} 5px,
                ${theme.tokenHolders.stepsColor} 10px
              )`,
                }}
                top={{ base: '8px', lg: '10%' }}
                left={{ base: '12px', lg: '55px', xl: '70px' }}
                position="absolute"
                zIndex="5"
              />
              <Flex
                flexDir={{ base: 'column', lg: 'row' }}
                w="full"
                justify="center"
                gap={{ base: '10px', lg: '60px', xl: '120px' }}
              >
                <Flex
                  zIndex="3"
                  align={{ base: 'flex-start', lg: 'center' }}
                  flexDir={{ base: 'row', lg: 'column' }}
                  gap="2"
                >
                  <Flex
                    borderRadius="full"
                    boxSize="25px"
                    zIndex="4"
                    bg={theme.tokenHolders.delegations.bg.primary}
                    position="relative"
                    ml={{ base: '0', lg: '-70px' }}
                  >
                    <Flex
                      zIndex="3"
                      borderRadius="full"
                      boxSize="8px"
                      bg={theme.tokenHolders.stepsColor}
                      position="absolute"
                      top="50%"
                      left="37%"
                      transform="translate(0, -50%)"
                      marginRight="-50%"
                    />
                  </Flex>
                  <Flex
                    flexDir="column"
                    gap="8px"
                    maxW={{ base: '260px', lg: '180px', xl: '200px' }}
                  >
                    <Text
                      fontWeight="700"
                      fontSize={{ base: '14px', xl: '16px' }}
                      color={theme.tokenHolders.stepsColor}
                    >
                      TOKENHOLDER
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize={{ base: '14px', xl: '18px' }}
                      color={theme.tokenHolders.delegations.text.primary}
                      h="max-content"
                      w="max-content"
                      maxW={{ base: '260px', lg: '180px', xl: '200px' }}
                      lineHeight="22px"
                    >
                      Enter one or more token holder addresses.
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  zIndex="3"
                  align={{ base: 'flex-start', lg: 'center' }}
                  flexDir={{ base: 'row', lg: 'column' }}
                  gap="2"
                >
                  <Flex
                    borderRadius="full"
                    boxSize="25px"
                    zIndex="4"
                    bg={theme.tokenHolders.delegations.bg.primary}
                    position="relative"
                    ml={{ base: '0', lg: '-70px' }}
                  >
                    <Flex
                      zIndex="3"
                      borderRadius="full"
                      boxSize="8px"
                      bg={theme.tokenHolders.stepsColor}
                      position="absolute"
                      top="50%"
                      left="37%"
                      transform="translate(0, -50%)"
                      marginRight="-50%"
                    />
                  </Flex>
                  <Flex
                    flexDir="column"
                    gap="8px"
                    maxW={{ base: '260px', lg: '180px', xl: '200px' }}
                  >
                    <Text
                      fontWeight="700"
                      fontSize={{ base: '14px', xl: '16px' }}
                      color={theme.tokenHolders.stepsColor}
                    >
                      DELEGATE INFO
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize={{ base: '14px', xl: '18px' }}
                      color={theme.tokenHolders.delegations.text.primary}
                      h="max-content"
                      w="max-content"
                      maxW={{ base: '260px', lg: '180px', xl: '200px' }}
                      lineHeight="22px"
                    >
                      See who you have delegated your tokens to.
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  zIndex="3"
                  align={{ base: 'flex-start', lg: 'center' }}
                  flexDir={{ base: 'row', lg: 'column' }}
                  gap="2"
                >
                  <Flex
                    borderRadius="full"
                    boxSize="25px"
                    zIndex="4"
                    bg={theme.tokenHolders.delegations.bg.primary}
                    position="relative"
                    ml={{ base: '0', lg: '-100px' }}
                  >
                    <Flex
                      zIndex="3"
                      borderRadius="full"
                      boxSize="8px"
                      bg={theme.tokenHolders.stepsColor}
                      position="absolute"
                      top="50%"
                      left="37%"
                      transform="translate(0, -50%)"
                      marginRight="-50%"
                    />
                  </Flex>
                  <Flex
                    flexDir="column"
                    gap="8px"
                    maxW={{ base: '260px', lg: '180px', xl: '200px' }}
                  >
                    <Text
                      fontWeight="700"
                      fontSize={{ base: '14px', xl: '16px' }}
                      color={theme.tokenHolders.stepsColor}
                    >
                      GET INSIGHTS
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize={{ base: '14px', xl: '18px' }}
                      color={theme.tokenHolders.delegations.text.primary}
                      h="max-content"
                      w="max-content"
                      maxW={{ base: '260px', lg: '180px', xl: '240px' }}
                      lineHeight="22px"
                    >
                      Find out how your delegate has performed since you
                      delegated.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Flex
            bg={theme.tokenHolders.delegations.bg.primary}
            py="6"
            px={{ base: '4', sm: '8' }}
            borderRadius="md"
            mt="6"
            mb="7"
            align="center"
            w="full"
            gap="6"
            flexDir={{ base: 'column', lg: 'row' }}
          >
            <Flex flexDir="column" w="full">
              <Text
                fontWeight="700"
                fontSize="14px"
                color={theme.tokenHolders.delegations.text.input.text}
              >
                Enter one or more token holder addresses
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
                        addresses.length ? undefined : '0x5e3..09ee, nick.eth'
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
                  When entering multiple addresses, use a comma to separate them
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
              Look Up
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
