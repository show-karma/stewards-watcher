import {
  Flex,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React, { useEffect, useState } from 'react';
import { ToDelegate } from './ToDelegate';
import { TokensDelegated } from './TokensDelegated';

interface IDelegateVotesModal {
  isOpen: boolean;
  onClose?: () => void;
}

export const DelegateVotesModal: React.FC<IDelegateVotesModal> = ({
  isOpen = false,
  onClose = () => ({}),
}) => {
  const { theme, daoInfo } = useDAO();
  const { delegateTo: modalTheme } = theme.modal;

  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState(false);

  const handleOnOk = () => {
    if (daoInfo.config.ALLOW_BULK_DELEGATE) {
      onClose();
    }
  };

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
            <Img
              w="54px"
              h="54px"
              src={success ? '/icons/check.svg' : '/icons/delegate.svg'}
            />
          </Flex>
          {success ? (
            <TokensDelegated address={address} />
          ) : (
            <ToDelegate
              onOk={handleOnOk}
              address={address}
              setAddress={setAddress}
              setSuccess={setSuccess}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
