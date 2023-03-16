/* eslint-disable react/destructuring-assignment */
import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React from 'react';

export const StyledModal: React.FC<
  ModalProps & {
    title: string;
    headerLogo?: boolean;
    description?: string | React.ReactNode;
  }
> = props => {
  const {
    theme,
    daoInfo: {
      config: { DAO_LOGO },
    },
  } = useDAO();
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
        paddingBottom={24}
        width={{ lg: '920', sm: '250' }}
        maxWidth="920"
        borderTopRadius="12px"
        bgColor={theme.background}
        overflow="hidden"
      >
        <ModalCloseButton zIndex={10} id="cu" color={modalTheme.subtext} />
        <Flex
          alignItems="center"
          justifyContent="center"
          position="relative"
          minH={48}
          direction="column"
        >
          {props.headerLogo && (
            <Box
              style={{
                position: 'absolute',
                top: '-10%',
                backgroundImage: `url(${DAO_LOGO})`,
                backgroundPosition: 'center',
                backgroundSize: '80%',
                backgroundRepeat: 'no-repeat',
                minHeight: 'inherit',
                width: '100%',
                opacity: 0.05,
              }}
            />
          )}
          <Heading textAlign="center" mb={8}>
            {props.title}
          </Heading>
          <Box textAlign="left">{props.description}</Box>
        </Flex>
        <ModalBody bgColor="transparent" px={{ base: '0', lg: '6' }}>
          {props.children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
