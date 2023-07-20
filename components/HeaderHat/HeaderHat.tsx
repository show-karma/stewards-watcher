import {
  Button,
  ButtonProps,
  Divider,
  Flex,
  Img,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  ChakraLink,
  DelegateLoginButton,
  DelegateLoginModal,
  UserProfile,
} from 'components';
import { DelegateVotesModal } from 'components/Modals/DelegateToAnyone';
import { useDAO, useDelegates, useWallet } from 'contexts';
import { FC, useEffect } from 'react';
import { KARMA_WEBSITE } from 'helpers';
import { UndelegateModal } from 'components/pages/token-holders/UndelegateModal';
import { NavMenu } from './NavMenu';
import { HeaderBurgerAccordion } from './HeaderBurgerAccordion';
import { Madeby } from './Madeby';
import { ThemeButton } from './ThemeButton';

export const StyledButton: FC<ButtonProps> = ({ children, ...rest }) => {
  const { theme } = useDAO();
  return (
    <Button
      color={theme.hat.text.primary}
      bgColor="transparent"
      px={{ base: '0', lg: '1', xl: '4' }}
      py={{ base: '1', lg: '6' }}
      fontWeight="semibold"
      _active={{}}
      _focus={{}}
      _hover={{
        color: theme.hat.text.secondary,
      }}
      minH={{ base: 'max-content', lg: '52px' }}
      alignItems="center"
      justifyContent="flex-start"
      fontSize={{ base: 'sm', lg: 'md' }}
      {...rest}
    >
      {children}
    </Button>
  );
};

interface IHeaderHat {
  shouldOpenDelegateToAnyone?: boolean;
}

export const HeaderHat: FC<IHeaderHat> = ({
  shouldOpenDelegateToAnyone = false,
}) => {
  const { daoInfo, theme, rootPathname } = useDAO();
  const { config } = daoInfo;
  const {
    isOpenProfile,
    onCloseProfile,
    profileSelected,
    selectedTab,
    isOpenVoteToAnyone,
    onToggleVoteToAnyone,
  } = useDelegates();
  const { delegateLoginIsOpen, delegateLoginOnClose, delegateLoginOnOpen } =
    useWallet();

  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [isSmallScreen] = useMediaQuery('(max-width: 1280px)');

  const mountingForTokenholders = (): {
    title: string;
    path?: string;
    action?: () => void;
    isExternal?: boolean;
  }[] => {
    const array = [];

    if (daoInfo.config.ENABLE_DELEGATE_TRACKER)
      array.push({
        title: 'Delegate Look Up',
        path: `${rootPathname}/delegate-lookup`,
        isExternal: false,
      });
    if (
      daoInfo.config.DAO_DELEGATE_CONTRACT ||
      daoInfo.config.ALLOW_BULK_DELEGATE
    )
      array.push({
        title: 'Delegate Tokens',
        action: onToggleVoteToAnyone,
      });

    return array;
  };

  const mountingForDelegates = (): {
    title: string;
    path: string;
    isExternal?: boolean;
  }[] => {
    const array = [];

    array.push({
      title: 'Delegator Look Up',
      path: KARMA_WEBSITE.delegators(daoInfo.config.DAO_KARMA_ID),
      isExternal: true,
    });

    return array;
  };

  const mountingResources = () => {
    const { DAO_RESOURCES } = daoInfo.config;
    if (!DAO_RESOURCES) return [];
    const array = DAO_RESOURCES.map(item => ({
      title: item.title,
      path: item.url,
    }));

    return array;
  };

  useEffect(() => {
    if (shouldOpenDelegateToAnyone) {
      onToggleVoteToAnyone();
    }
  }, [shouldOpenDelegateToAnyone]);

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
        {isMobile ? (
          <HeaderBurgerAccordion
            mountingForTokenholders={mountingForTokenholders}
            mountingForDelegates={mountingForDelegates}
          >
            <Flex flexDir="column" gap="1">
              <NavMenu
                title="For Tokenholders"
                childrens={mountingForTokenholders()}
                accordion
              >
                {daoInfo.config?.ALLOW_UNDELEGATE && (
                  <UndelegateModal
                    buttonProps={{
                      color: theme.hat.text.primary,
                    }}
                  />
                )}
              </NavMenu>
              {daoInfo.config.HIDE_FOR_DELEGATES?.length ? undefined : (
                <NavMenu
                  title="For Delegates"
                  childrens={mountingForDelegates()}
                  accordion
                />
              )}
              <ChakraLink href={`${rootPathname}/guide`} _hover={{}}>
                <StyledButton>Guide</StyledButton>
              </ChakraLink>
              {daoInfo.config.DAO_DEFAULT_SETTINGS?.FAQ && (
                <ChakraLink href={`${rootPathname}/faq`} _hover={{}} w="full">
                  <StyledButton w="full">FAQs</StyledButton>
                </ChakraLink>
              )}
              {daoInfo.config.DAO_RESOURCES &&
                daoInfo.config.DAO_RESOURCES.length > 0 && (
                  <NavMenu
                    title="Resources"
                    childrens={mountingResources()}
                    accordion
                  />
                )}
              <Divider borderColor={theme.filters.title} />
              <DelegateLoginButton onOpen={delegateLoginOnOpen} />
              <ThemeButton />
            </Flex>
          </HeaderBurgerAccordion>
        ) : (
          <Flex
            w={{ base: 'full' }}
            maxW={{ base: '400px', md: '820px', lg: '944px', xl: '1360px' }}
            flexDir="row"
            justify="space-between"
            gap={{ base: '1', xl: '4' }}
            flexWrap="wrap"
          >
            <Flex
              flexDir="row"
              flex={['1', 'none']}
              align={{ base: 'center' }}
              gap={{ base: '2', lg: '4', xl: '16' }}
              w="full"
              justify={{ base: 'space-between' }}
            >
              <Flex
                flexDir="column"
                flex={['1', 'none']}
                align={['flex-start', 'flex-start']}
                gap="1"
              >
                <ChakraLink href={`${rootPathname}/`}>
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
                  justify="center"
                  alignItems="center"
                  height="100%"
                  gap="4"
                >
                  <NavMenu
                    title="For Tokenholders"
                    childrens={mountingForTokenholders()}
                  >
                    {daoInfo.config?.ALLOW_UNDELEGATE && <UndelegateModal />}
                  </NavMenu>
                  {daoInfo.config.HIDE_FOR_DELEGATES?.length ? undefined : (
                    <NavMenu
                      title="For Delegates"
                      childrens={mountingForDelegates()}
                      accordion
                    />
                  )}

                  {isSmallScreen ? null : (
                    <>
                      <ChakraLink href={`${rootPathname}/guide`} _hover={{}}>
                        <StyledButton>Guide</StyledButton>
                      </ChakraLink>
                      {daoInfo.config.DAO_DEFAULT_SETTINGS?.FAQ && (
                        <ChakraLink href={`${rootPathname}/faq`} _hover={{}}>
                          <StyledButton>FAQs</StyledButton>
                        </ChakraLink>
                      )}
                      {daoInfo.config.DAO_RESOURCES &&
                        daoInfo.config.DAO_RESOURCES.length > 0 && (
                          <NavMenu
                            title="Resources"
                            childrens={mountingResources()}
                          />
                        )}
                    </>
                  )}
                  <DelegateLoginButton onOpen={delegateLoginOnOpen} />
                  <ThemeButton />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
      <DelegateVotesModal
        isOpen={isOpenVoteToAnyone}
        onClose={onToggleVoteToAnyone}
      />
      <DelegateLoginModal
        isOpen={delegateLoginIsOpen}
        onClose={delegateLoginOnClose}
      />
      {profileSelected && (
        <UserProfile
          isOpen={isOpenProfile}
          onClose={onCloseProfile}
          profile={{
            ...profileSelected,
            avatar:
              profileSelected.profilePicture ||
              `${config.IMAGE_PREFIX_URL}${profileSelected.address}`,
            twitter: profileSelected.twitterHandle,
            forumHandle: profileSelected.discourseHandle,
          }}
          selectedTab={selectedTab}
        />
      )}
    </Flex>
  );
};
