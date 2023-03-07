import {
  Button,
  ButtonProps,
  Flex,
  Icon,
  Img,
  Link,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  DelegateLoginButton,
  DelegateLoginModal,
  UserProfile,
} from 'components';
import { DelegateVotesModal } from 'components/Modals/DelegateVotes';
import { useDAO, useDelegates } from 'contexts';
import { FC } from 'react';
import { IoMenu } from 'react-icons/io5';
import { HeaderBurgerMenu } from './HeaderBurgerMenu';
import { Madeby } from './Madeby';
import { ResourcesMenu } from './ResourcesMenu';
import { ThemeButton } from './ThemeButton';

const StyledButton: FC<ButtonProps> = ({ children, ...rest }) => {
  const { theme } = useDAO();
  return (
    <Button
      color={theme.hat.text.primary}
      bgColor="transparent"
      px="6"
      py="6"
      fontWeight="semibold"
      _active={{}}
      _focus={{}}
      _hover={{
        color: theme.hat.text.secondary,
      }}
      minH="52px"
      {...rest}
    >
      {children}
    </Button>
  );
};

export const HeaderHat = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { isOpen, onToggle } = useDisclosure();
  const { isOpenProfile, onCloseProfile, profileSelected, selectedTab } =
    useDelegates();
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
        px={{ base: '4', lg: '8' }}
        zIndex="2"
        boxShadow={useColorModeValue('0px 4px 10px rgba(0, 0, 0, 0.1)', 'none')}
      >
        <Flex
          w={{ base: 'full' }}
          maxW="1360px"
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
              gap="1"
            >
              <Link href="/">
                <Img
                  w="auto"
                  maxW="36"
                  h="10"
                  objectFit="contain"
                  src={config.DAO_LOGO}
                />
              </Link>
              <Madeby />
            </Flex>
            <Flex
              flexDir="row"
              alignItems="center"
              justify="flex-end"
              w={{ base: 'max-content', lg: 'full' }}
            >
              <Flex
                display={{ base: 'flex', lg: 'none' }}
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
                display={{ base: 'none', lg: 'flex' }}
                gap="4"
              >
                <ThemeButton />
                {daoInfo.config.DAO_RESOURCES &&
                  daoInfo.config.DAO_RESOURCES.length > 0 && <ResourcesMenu />}
                {daoInfo.config.DAO_DEFAULT_SETTINGS?.FAQ && (
                  <Link href="/faq" _hover={{}}>
                    <StyledButton>FAQ</StyledButton>
                  </Link>
                )}
                <StyledButton onClick={onToggle}>
                  Delegate to Anyone
                </StyledButton>
                <DelegateLoginButton onOpen={onOpenDelegateLogin} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <HeaderBurgerMenu isOpen={isBurgerMenuOpen} onClose={closeBurgerMenu}>
          <Flex flexDir="column" gap="4">
            <ThemeButton />
            {daoInfo.config.DAO_DEFAULT_SETTINGS?.FAQ && (
              <Link href="/faq" _hover={{}}>
                <StyledButton>FAQ</StyledButton>
              </Link>
            )}
            {daoInfo.config.DAO_RESOURCES &&
              daoInfo.config.DAO_RESOURCES.length > 0 && <ResourcesMenu />}
            <StyledButton onClick={onToggle}>Delegate to Anyone</StyledButton>
            <DelegateLoginButton onOpen={onOpenDelegateLogin} />
          </Flex>
        </HeaderBurgerMenu>
        <DelegateVotesModal isOpen={isOpen} onClose={onToggle} />
      </Flex>
      <DelegateLoginModal
        isOpen={isOpenDelegateLogin}
        onClose={onCloseDelegateLogin}
      />
      {profileSelected && (
        <UserProfile
          isOpen={isOpenProfile}
          onClose={onCloseProfile}
          profile={{
            address: profileSelected.address,
            avatar:
              profileSelected.profilePicture ||
              `${config.IMAGE_PREFIX_URL}${profileSelected.address}`,
            ensName: profileSelected.ensName,
            twitter: profileSelected.twitterHandle,
            aboutMe: profileSelected.aboutMe,
            realName: profileSelected.realName,
            forumHandle: profileSelected.discourseHandle,
          }}
          selectedTab={selectedTab}
        />
      )}
    </Flex>
  );
};
