import {
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
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

  const [address, setAddress] = useState<string>('');

  const handleChange = (addr: string) => {
    if (address !== addr) setAddress(addr);
  };

  const isEthAddress = useMemo(
    () => ethers.utils.isAddress(address),
    [address]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        w={{ base: 'max-content', lg: '920' }}
        maxW={{ base: 'max-content', lg: '920' }}
        borderRadius="12px"
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.modal.header.border}
        bgColor={theme.modal.background}
        mx="1rem"
      >
        <ModalCloseButton />
        <ModalBody px={{ base: '1.25rem', lg: '2.5rem' }} py={6}>
          <Text mb={2}>Enter ETH address to delegate your tokens</Text>
          <Input
            placeholder="0x4fa...65c2b"
            type="text"
            onChange={event => handleChange(event.target.value)}
            mb={4}
            width="43ch"
          />
          <Flex justifyContent="flex-end">
            <DelegateButton delegated={address} disabled={!isEthAddress} />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
