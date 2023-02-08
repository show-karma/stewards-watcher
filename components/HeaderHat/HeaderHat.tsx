import {
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  Img,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { DelegateLoginModal } from 'components';
import { DelegateVotesModal } from 'components/Modals/DelegateVotes';
import { useDAO } from 'contexts';
import { useAuth } from 'contexts/auth';
import { FC } from 'react';
import { IoMenu } from 'react-icons/io5';
import { HeaderBurgerMenu } from './HeaderBurgerMenu';
import { Madeby } from './Madeby';
import { ThemeButton } from './ThemeButton';

const DelegateToAnyoneButton: FC<{ onToggle: () => void }> = ({ onToggle }) => {
  const { theme } = useDAO();
  return (
    <Button
      color={useColorModeValue(theme.branding, 'white')}
      bgColor="transparent"
      onClick={onToggle}
      px="6"
      py="6"
      fontWeight="semibold"
      _active={{}}
      _focus={{}}
      _hover={{}}
      minH="52px"
    >
      Delegate to Anyone
    </Button>
  );
};

const DelegateLoginButton: FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { theme } = useDAO();
  const { isAuthenticated, disconnect } = useAuth();

  return (
    <Button
      bgColor={useColorModeValue(theme.branding, 'white')}
      color={useColorModeValue(theme.buttonText, 'black')}
      onClick={() => {
        if (isAuthenticated) {
          disconnect();
          return;
        }
        onOpen();
      }}
      px="5"
      py="3"
      fontWeight="semibold"
      _active={{}}
      _focus={{}}
      _hover={{}}
      minH={{ base: '52px', lg: 'max-content' }}
    >
      {isAuthenticated ? 'Disconnect' : 'Delegate Login'}
    </Button>
  );
};

export const HeaderHat = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { isOpen, onToggle } = useDisclosure();
  const {
    onClose: onCloseDelegateLogin,
    isOpen: isOpenDelegateLogin,
    onOpen: onOpenDelegateLogin,
  } = useDisclosure();

  const {
    isOpen: isBurgerMenuOpen,
    onClose: closeBurgerMenu,
    onOpen: openBurgerMenu,
  } = useDisclosure();

  return (
    <Flex flexDir="column" w="full">
      <Flex
        bgColor={theme.headerBg}
        py="3"
        w="full"
        align="center"
        justify="center"
        px={{ base: '4', lg: '20' }}
        zIndex="2"
        boxShadow={useColorModeValue(
          '0px 4px 10px rgba(0, 0, 0, 0.1);',
          'none'
        )}
      >
        <Flex
          w={{ base: 'full', '2xl': '1360px' }}
          flexDir="row"
          justify="space-between"
          gap="4"
          flexWrap="wrap"
        >
          <Flex
            flexDir="row"
            flex={['1', 'none']}
            align={{ base: 'center' }}
            gap={{ base: '2', md: '16' }}
            w="full"
            justify={{ base: 'space-between' }}
          >
            <Flex
              flexDir="column"
              flex={['1', 'none']}
              align={['flex-start', 'flex-start']}
            >
              <Img
                w="auto"
                maxW="36"
                h="10"
                objectFit="contain"
                src={config.DAO_LOGO}
              />
              <Madeby />
            </Flex>
            <Flex
              flexDir="row"
              alignItems="center"
              justify="flex-end"
              w={{ base: 'max-content', lg: 'full' }}
            >
              <Flex
                display={{ base: 'flex', md: 'none' }}
                w="max-content"
                align="center"
                justify="center"
              >
                <Button
                  bg="none"
                  _hover={{}}
                  _active={{}}
                  _focus={{}}
                  _focusWithin={{}}
                  _focusVisible={{}}
                  onClick={openBurgerMenu}
                  color={theme.hat.text.primary}
                >
                  <Icon as={IoMenu} boxSize="8" />
                </Button>
              </Flex>
              <Flex
                justify="center"
                alignItems="center"
                height="100%"
                display={{ base: 'none', md: 'flex' }}
                gap="4"
              >
                <ThemeButton />
                <DelegateToAnyoneButton onToggle={onToggle} />
                <DelegateLoginButton onOpen={onOpenDelegateLogin} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <HeaderBurgerMenu isOpen={isBurgerMenuOpen} onClose={closeBurgerMenu}>
          <Flex flexDir="column" gap="4">
            <ThemeButton />
            <DelegateToAnyoneButton onToggle={onToggle} />
            <DelegateLoginButton onOpen={onOpenDelegateLogin} />
          </Flex>
        </HeaderBurgerMenu>
        <DelegateVotesModal isOpen={isOpen} onClose={onToggle} />
      </Flex>
      <DelegateLoginModal
        isOpen={isOpenDelegateLogin}
        onClose={onCloseDelegateLogin}
      />
    </Flex>
  );
};
