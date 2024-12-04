import {
  Button,
  Flex,
  Grid,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useAuth } from 'contexts/auth';
import { FC } from 'react';

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
  ];

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
        mt={{ base: '4', lg: '5%' }}
      >
        <ModalHeader
          display="flex"
          flexDir="row"
          w="full"
          px={{ base: '4', lg: '10' }}
          pt={{ base: '8', lg: '8' }}
          pb={{ base: '0', lg: '8' }}
        >
          <Flex
            flexDir="row"
            flexWrap="wrap"
            w="full"
            gap={{ base: '1', lg: '4' }}
          >
            <Img
              w="auto"
              maxW="36"
              h="10"
              objectFit="contain"
              color="white"
              fill="white"
              src={theme.loginModal.logo || config.DAO_LOGO}
              rounded={theme.isLogoRounded ? '9999px' : undefined}
            />
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="black" boxSize="8" />
        <ModalBody px={{ base: '3', lg: '6' }}>
          <Flex
            flexDir="column"
            mt={{ base: '0', lg: '6' }}
            px={{ base: '1', lg: '4' }}
          >
            <Text
              fontWeight="medium"
              fontSize={{ base: '2xl', lg: '28px' }}
              pr={{ base: '0', lg: '25' }}
              color={theme.loginModal.text}
            >
              Welcome to the Delegate Dashboard
            </Text>
            <Text
              fontWeight="normal"
              fontSize={{ base: 'md', lg: '18px' }}
              color={theme.loginModal.text}
              mt="6px"
              mb="8"
            >
              If you are a contributor, login with your wallet to:
            </Text>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="4"
              mb={{ base: '4', lg: '8' }}
            >
              {points.map(point => (
                <Flex key={point.text} flex="1" gap="4">
                  <Img
                    src={point.icon}
                    boxSize={{ base: '5', lg: '6' }}
                    color="#898A8D"
                  />
                  <Text
                    fontWeight="500"
                    fontSize={{ base: 'sm', lg: '17px' }}
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
            mx={{ base: '-12px', lg: '-24px' }}
            borderRadius="0 0 20px 20px"
            py={{ base: '4', lg: '8' }}
            px={{ base: '4', lg: '10' }}
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
