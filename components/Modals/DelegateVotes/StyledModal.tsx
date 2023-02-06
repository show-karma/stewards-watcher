/* eslint-disable react/destructuring-assignment */
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React from 'react';

export const StyledModal: React.FC<ModalProps & { title: string }> = props => {
  const { theme } = useDAO();
  const { delegateTo: modalTheme } = theme.modal;

  return (
    <Modal {...props}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        mx="1rem"
        p={4}
        minWidth="920"
        maxWidth="920"
        borderTopRadius="12px"
        bgColor={theme.modal.background}
      >
        <ModalCloseButton color={modalTheme.subtext} />
        <Heading textAlign="center" mb={8}>
          {props.title}
        </Heading>
        <ModalBody bgColor="transparent">{props.children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
