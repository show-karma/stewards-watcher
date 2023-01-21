/* eslint-disable react/destructuring-assignment */
import {
  Flex,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React, { useState } from 'react';

export const StyledModal: React.FC<ModalProps> = props => {
  const { theme } = useDAO();
  const { delegateTo: modalTheme } = theme.modal;

  return (
    <Modal {...props}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalCloseButton color={modalTheme.text} />
      <ModalContent mx="1rem" borderTopRadius="12px" bgColor="transparent">
        <ModalBody bgColor="transparent">{props.children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
