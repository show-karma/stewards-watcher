import {
  Flex,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { DelegateButton } from 'components/DelegateButton';
import { useDAO } from 'contexts';
import { ethers } from 'ethers';
import React, { useMemo, useState } from 'react';

interface IDelegateVotesModal {
  isOpen: boolean;
  onClose?: () => void;
}

export const DelegateVotesModal: React.FC<IDelegateVotesModal> = ({
  isOpen = false,
  onClose = () => ({}),
}) => {
  const { theme } = useDAO();
  const { delegateTo: modalTheme } = theme.modal;

  const [address, setAddress] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleChange = (addr: string) => {
    if (address !== addr) setAddress(addr);
  };

  const isEthAddress = useMemo(
    () => ethers.utils.isAddress(address),
    [address]
  );

  const emitSuccess = () => setSuccess(true);

  const fullDisabled = !isEthAddress && address.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        w={{ base: 'max-content', lg: '920' }}
        maxW={{ base: 'max-content', lg: '920' }}
        bgColor={modalTheme.bg}
        mx="1rem"
        maxH="max-content"
        borderTopRadius="12px"
      >
        <ModalCloseButton color={modalTheme.text} />
        <ModalBody
          px="0"
          py="0"
          w="416px"
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            w="full"
            bgColor={modalTheme.topBg}
            h="140px"
            maxH="140px"
            borderTopRadius="12px"
          />
          <Flex
            marginTop="-48px"
            w="94px"
            h="94px"
            bgColor={modalTheme.userBg}
            align="center"
            justify="center"
            borderRadius="full"
            boxShadow={modalTheme.userShadow}
            mb="4"
          >
            <Img w="54px" h="54px" src="/icons/delegate.svg" />
          </Flex>
          <Flex px="4" flexDir="column" align="center" maxW="368px" pb="6">
            <Text
              mb={1}
              color={modalTheme.text}
              fontWeight="semibold"
              fontSize="2xl"
              textAlign="left"
              w="full"
            >
              Delegate tokens to anyone.
            </Text>
            <Text
              mb={7}
              color={modalTheme.subtext}
              fontWeight="normal"
              fontSize="lg"
              textAlign="left"
              w="full"
            >
              Enter the ETH address to delegate your tokens to this individual.
            </Text>
            <Input
              placeholder="Enter ETH address"
              type="text"
              onChange={event => handleChange(event.target.value)}
              width="full"
              bgColor={modalTheme.bg}
              borderWidth="1px"
              borderColor={modalTheme.input.border}
              _placeholder={{ color: modalTheme.input.placeholder }}
              color={modalTheme.input.text}
              _focus={{
                borderWidth: '1px',
                borderColor: fullDisabled
                  ? modalTheme.input.error
                  : modalTheme.input.dirtyBorder,
                outline: 'none !important',
              }}
              _active={{
                borderWidth: '1px',
                borderColor: fullDisabled
                  ? modalTheme.input.error
                  : modalTheme.input.dirtyBorder,
                outline: 'none !important',
              }}
              _focusVisible={{
                borderWidth: '1px',
                borderColor: fullDisabled
                  ? modalTheme.input.error
                  : modalTheme.input.dirtyBorder,
                outline: 'none !important',
              }}
              _focusWithin={{
                borderWidth: '1px',
                borderColor: fullDisabled
                  ? modalTheme.input.error
                  : modalTheme.input.dirtyBorder,
                outline: 'none !important',
              }}
              _hover={{
                borderWidth: '1px',
                borderColor: fullDisabled
                  ? modalTheme.input.error
                  : modalTheme.input.dirtyBorder,
                outline: 'none !important',
              }}
            />
            {!isEthAddress && address !== '' && (
              <Text textAlign="start" w="full" color={modalTheme.input.error}>
                This is not a valid ETH
              </Text>
            )}
            <DelegateButton
              delegated={address}
              disabled={!isEthAddress}
              w="full"
              maxW="full"
              borderRadius="4px"
              mt={4}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
