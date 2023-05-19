import {
  Button,
  ButtonProps,
  Flex,
  Icon,
  Img,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ChakraLink,
  DelegateLoginButton,
  DelegateLoginModal,
  UserProfile,
} from 'components';
import { DelegateVotesModal } from 'components/Modals/DelegateToAnyone';
import { useDAO, useDelegates, useWallet } from 'contexts';
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
      px="4"
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
  const { delegateLoginIsOpen, delegateLoginOnClose, delegateLoginOnOpen } =
    useWallet();

  const {
    isOpen: isBurgerMenuOpen,
    onClose: closeBurgerMenu,
    onOpen: openBurgerMenu,
  } = useDisclosure();

  return (
    <Flex flexDir="column" w="full">
      <Flex
        bg={theme.headerBg}
        bgSize="cover"
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
          maxW={{ base: '400px', md: '820px', lg: '944px', xl: '1360px' }}
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
              <ChakraLink href="/">
                <Img
                  w="auto"
                  maxW="36"
                  h="10"
                  objectFit="contain"
                  src={config.DAO_LOGO}
                />
              </ChakraLink>
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
                {daoInfo.config.ENABLE_DELEGATE_TRACKER ? (
                  <ChakraLink href="/delegate-lookup" _hover={{}}>
                    <StyledButton>Delegate Look Up</StyledButton>
                  </ChakraLink>
                ) : null}
                {daoInfo.config.DAO_DELEGATE_MODE !== 'hidden' && (
                  <StyledButton onClick={onToggle}>
                    Delegate Tokens
                  </StyledButton>
                )}
                <ChakraLink href="/guide" _hover={{}}>
                  <StyledButton>Guide</StyledButton>
                </ChakraLink>
                {daoInfo.config.DAO_DEFAULT_SETTINGS?.FAQ && (
                  <ChakraLink href="/faq" _hover={{}}>
                    <StyledButton>FAQ</StyledButton>
                  </ChakraLink>
                )}
                {daoInfo.config.DAO_RESOURCES &&
                  daoInfo.config.DAO_RESOURCES.length > 0 && <ResourcesMenu />}
                <DelegateLoginButton onOpen={delegateLoginOnOpen} />
                <ThemeButton />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <HeaderBurgerMenu isOpen={isBurgerMenuOpen} onClose={closeBurgerMenu}>
          <Flex flexDir="column" gap="4">
            {daoInfo.config.ENABLE_DELEGATE_TRACKER ? (
              <ChakraLink href="/delegate-lookup" _hover={{}}>
                <StyledButton>Delegate Look Up</StyledButton>
              </ChakraLink>
            ) : null}
            {daoInfo.config.DAO_DELEGATE_MODE !== 'hidden' && (
              <StyledButton onClick={onToggle} px="2">
                Delegate Tokens
              </StyledButton>
            )}
            <ChakraLink href="/guide" _hover={{}}>
              <StyledButton>Guide</StyledButton>
            </ChakraLink>
            {daoInfo.config.DAO_DEFAULT_SETTINGS?.FAQ && (
              <ChakraLink href="/faq" _hover={{}} w="full">
                <StyledButton w="full">FAQ</StyledButton>
              </ChakraLink>
            )}
            {daoInfo.config.DAO_RESOURCES &&
              daoInfo.config.DAO_RESOURCES.length > 0 && <ResourcesMenu />}
            <DelegateLoginButton onOpen={delegateLoginOnOpen} />
            <ThemeButton />
          </Flex>
        </HeaderBurgerMenu>
        <DelegateVotesModal isOpen={isOpen} onClose={onToggle} />
      </Flex>
      <DelegateLoginModal
        isOpen={delegateLoginIsOpen}
        onClose={delegateLoginOnClose}
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
            userCreatedAt: profileSelected.userCreatedAt,
          }}
          selectedTab={selectedTab}
        />
      )}
    </Flex>
  );
};
