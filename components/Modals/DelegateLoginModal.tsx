import { FC } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Img,
  Button,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from 'contexts/auth';
import { useDAO } from 'contexts';

interface IDelegateLogin {
  isOpen: boolean;
  onClose: () => void;
}

export const DelegateLoginModal: FC<IDelegateLogin> = ({ isOpen, onClose }) => {
  const { authenticate, isLoadingSign } = useAuth();
  const { daoInfo, theme } = useDAO();

  const { config } = daoInfo;
  const points = [
    {
      text: 'Become a delegate and update your pitch and interests',
      icon: '/icons/user.svg',
    },
    {
      text: 'Withdraw your nomination',
      icon: '/icons/withdraw.svg',
    },
    {
      text: 'Verify and link your social handles',
      icon: '/icons/edit.svg',
    },
    {
      text: 'Add voting reason to proposals you have voted on',
      icon: '/icons/votingcheck.svg',
    },
  ];

  const variantImg = useColorModeValue(
    '/images/karma_logo_green_and_black.svg',
    '/images/karma_logo_white.png'
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        w={{ base: 'max-content' }}
        maxW={{ base: 'max-content' }}
        mx="1rem"
        maxH="max-content"
        borderRadius="20px"
        bgColor={theme.loginModal.background}
      >
        <ModalHeader
          display="flex"
          flexDir="row"
          w="full"
          gap="4"
          px="10"
          py="8"
        >
          <Img
            w="auto"
            maxW="36"
            h="10"
            objectFit="contain"
            color="white"
            fill="white"
            src={theme.logo || config.DAO_LOGO}
          />
          <Flex gap="3" w="full" align="center">
            <Text
              fontWeight="normal"
              fontSize="16px"
              w="max-content"
              color={theme.loginModal.text}
            >
              Powered By
            </Text>
            <Img src={variantImg} h="8" w="80px" objectFit="contain" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="black" boxSize="8" />
        <ModalBody px="6">
          <Flex flexDir="column" mt="6" px="4">
            <Text
              fontWeight="medium"
              fontSize="28px"
              pr="25"
              color={theme.loginModal.text}
            >
              Welcome to the Delegate Dashboard
            </Text>
            <Text
              fontWeight="normal"
              fontSize="18px"
              color={theme.loginModal.text}
              mt="6px"
              mb="8"
            >
              If you are a contributor, login with your wallet to:
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap="4" mb="8">
              {points.map(point => (
                <Flex key={point.text} flex="1" gap="4">
                  <Img src={point.icon} boxSize="6" color="#898A8D" />
                  <Text
                    fontWeight="500"
                    fontSize="17px"
                    color={theme.loginModal.text}
                    maxW="284px"
                  >
                    {point.text}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Flex>
          <Flex
            bgColor={theme.loginModal.footer.bg}
            mb="-8px"
            mx="-24px"
            borderRadius="0 0 20px 20px"
            px="10"
            py="8"
            flexDir="column"
            gap="4"
          >
            <Text
              fontWeight="600"
              fontSize="18px"
              color={theme.loginModal.footer.text}
            >
              To get started, login by connecting your wallet.
            </Text>
            <Button
              onClick={() => {
                authenticate();
              }}
              color={theme.loginModal.button.text}
              background={theme.loginModal.button.bg}
              maxW="174px"
              borderRadius="4px"
              _hover={{}}
              _active={{}}
              _focus={{}}
              _focusWithin={{}}
              _focusVisible={{}}
              isLoading={isLoadingSign}
            >
              Connect wallet
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
