import {
  Button,
  ButtonProps,
  Divider,
  Flex,
  Icon,
  Img,
  Link,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  ImgWithFallback,
  DelegateButton,
  ForumIcon,
  TwitterIcon,
  DiscordIcon,
} from 'components';
import {
  useDAO,
  useDelegates,
  useEditStatement,
  useHandles,
  useWallet,
} from 'contexts';
import { useAuth } from 'contexts/auth';
import { useToasty } from 'hooks';
import { FC, ReactNode, useMemo, useState } from 'react';
import { IActiveTab, IProfile } from 'types';
import { convertHexToRGBA, getUserForumUrl, truncateAddress } from 'utils';
import { useAccount } from 'wagmi';

interface INavButton extends ButtonProps {
  children: ReactNode;
  isActive: boolean;
}

const NavButton: FC<INavButton> = ({ children, isActive, ...props }) => {
  const { theme } = useDAO();

  return (
    <Button
      bgColor={theme.modal.buttons.navBg}
      color={
        isActive
          ? theme.modal.buttons.navText
          : theme.modal.buttons.navUnselectedText
      }
      borderBottomWidth="2px"
      borderBottomStyle="solid"
      borderBottomColor={
        isActive ? theme.modal.buttons.navBorder : 'transparent'
      }
      borderRadius="0"
      _hover={{
        borderBottomColor: theme.modal.buttons.navBorder,
        color: theme.modal.buttons.navText,
      }}
      fontSize={{ base: 'sm', lg: 'md' }}
      _focus={{}}
      _focusWithin={{}}
      _active={{}}
      {...props}
    >
      {children}
    </Button>
  );
};

type IMedias = 'twitter' | 'forum' | 'discord';
interface IMediaIcon {
  profile: IProfile;
  media: IMedias;
  changeTab: (selectedTab: IActiveTab) => void;
  isSamePerson: boolean;
  children: ReactNode;
}

interface IMediasObj {
  [key: string]: {
    url: string;
    value?: string;
    disabledCondition?: boolean;
  };
}

const MediaIcon: FC<IMediaIcon> = ({
  media,
  profile,
  changeTab,
  children,
  isSamePerson,
}) => {
  const { theme, daoData, daoInfo } = useDAO();

  const { isConnected } = useWallet();
  const { config } = daoInfo;
  const { twitterOnOpen, forumOnOpen } = useHandles();

  const medias: IMediasObj = {
    twitter: {
      url: `https://twitter.com/${profile.twitter}`,
      value: profile.twitter,
    },
    forum: {
      url:
        profile?.forumHandle &&
        daoData?.socialLinks.forum &&
        config.DAO_FORUM_TYPE
          ? getUserForumUrl(
              profile?.forumHandle,
              config.DAO_FORUM_TYPE,
              config.DAO_FORUM_URL || daoData?.socialLinks.forum
            )
          : '',
      value: profile.forumHandle,
      disabledCondition: !daoData?.forumTopicURL,
    },
    discord: {
      url: `https://discord.com/users/${profile.discordHandle}`,
      value: profile.discordHandle,
    },
  };
  const chosenMedia = medias[media];

  if (chosenMedia.value)
    return (
      <Link
        href={chosenMedia.url}
        isExternal
        color={theme.card.socialMedia}
        opacity="1"
        _hover={{
          transform: 'scale(1.25)',
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSize="6"
        px="0"
        py="0"
        minW="max-content"
      >
        {children}
      </Link>
    );

  const handleClick = () => {
    if (!isSamePerson) return;
    changeTab('handles');
    const onOpens: { [key: string]: () => void } = {
      twitter: twitterOnOpen,
      forum: forumOnOpen,
    };
    if (onOpens[media]) onOpens[media]();
  };

  return (
    <Tooltip
      label={
        isConnected
          ? `Update your ${media} handle now`
          : `Login to update your ${media} handle`
      }
      placement="top"
      hasArrow
    >
      <Button
        onClick={() => handleClick()}
        px="0"
        py="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgColor="transparent"
        _active={{}}
        _focus={{}}
        _focusWithin={{}}
        _focusVisible={{}}
        color={theme.modal.header.title}
        opacity="0.25"
        _hover={{}}
        h="6"
        w="max-content"
        minW="max-content"
        cursor={isSamePerson ? 'pointer' : 'default'}
        isDisabled={chosenMedia?.disabledCondition}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

const DelegateCases: FC<{ status?: string; fullAddress: string }> = ({
  status,
  fullAddress,
}) => {
  const { theme } = useDAO();
  const { address } = useAccount();
  if (fullAddress.toLowerCase() === address?.toLowerCase()) return null;
  if (status === 'withdrawn')
    return (
      <Tooltip
        label="This delegate has indicated that they are no longer accepting delegations."
        bgColor={theme.collapse.bg || theme.card.background}
        color={theme.collapse.text}
      >
        <Flex>
          <DelegateButton
            delegated={fullAddress}
            text="Select as Delegate"
            isDisabled
            disabled
          />
        </Flex>
      </Tooltip>
    );
  return <DelegateButton delegated={fullAddress} text="Select as Delegate" />;
};

interface IUserSection {
  profile: IProfile;
  changeTab: (selectedTab: IActiveTab) => void;
}

const UserSection: FC<IUserSection> = ({ profile, changeTab }) => {
  const { address: fullAddress, ensName, realName } = profile;

  const truncatedAddress = truncateAddress(fullAddress);
  const { isConnected, openConnectModal } = useWallet();
  const { theme, daoData } = useDAO();
  const { profileSelected } = useDelegates();
  const { isEditing, setIsEditing, saveEdit, isEditSaving } =
    useEditStatement();
  const { address } = useAccount();
  const { authenticate, isAuthenticated, isDaoAdmin } = useAuth();
  const { toast } = useToasty();
  const [isConnecting, setConnecting] = useState(false);

  const isSamePerson =
    isConnected &&
    (address?.toLowerCase() === fullAddress?.toLowerCase() || isDaoAdmin);

  const handleAuth = async () => {
    if (!isConnected) {
      openConnectModal?.();
      setConnecting(true);
      return;
    }
    changeTab('statement');
    setConnecting(false);
    if (address?.toLowerCase() !== fullAddress?.toLowerCase() && !isDaoAdmin) {
      toast({
        description: 'You can only edit your own profile.',
        status: 'error',
      });
      return;
    }
    if (
      (address?.toLowerCase() === fullAddress?.toLowerCase() || isDaoAdmin) &&
      isConnected &&
      isAuthenticated
    ) {
      setIsEditing(true);
      return;
    }

    const tryToAuth = await authenticate();

    if (tryToAuth) {
      setIsEditing(true);
    }
  };

  useMemo(() => {
    if (isConnecting && isConnected) {
      handleAuth();
    }
  }, [isConnected]);

  return (
    <Flex
      px={{ base: '1.25rem', lg: '2.5rem' }}
      w="full"
      mt={{ base: '-1.25rem', lg: '-3.5rem' }}
      flexDir="column"
      gap={{ base: '2rem', lg: '0' }}
    >
      <Flex w="full" gap={{ base: '1rem', lg: '1.375rem' }}>
        <ImgWithFallback
          w={{ base: '5.5rem', lg: '8.125rem' }}
          h={{ base: '5.5rem', lg: '8.125rem' }}
          borderRadius="full"
          borderWidth="2px"
          borderStyle="solid"
          borderColor={theme.modal.header.border}
          objectFit="cover"
          src={profile.avatar}
          fallback={profile.address}
        />
        <Flex justifyContent="space-between" w="full" align="flex-end">
          <Flex flexDirection="column" gap="0.5" w="full">
            <Flex
              flexDir="row"
              gap="2"
              align="center"
              width={{ base: '200px', sm: '300px', md: '600px', lg: '340px' }}
            >
              <Text
                fontFamily="body"
                fontWeight="bold"
                fontSize={{ base: 'md', lg: '2xl' }}
                color={theme.modal.header.title}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {realName || ensName || truncatedAddress}
              </Text>
              <Flex flexDir="row" gap="4" ml="4">
                <MediaIcon
                  profile={profile}
                  media="twitter"
                  changeTab={changeTab}
                  isSamePerson={isSamePerson}
                >
                  <TwitterIcon boxSize="6" color={theme.modal.header.title} />
                </MediaIcon>
                {daoData?.forumTopicURL && (
                  <MediaIcon
                    profile={profile}
                    media="forum"
                    changeTab={changeTab}
                    isSamePerson={isSamePerson}
                  >
                    <ForumIcon boxSize="6" color={theme.modal.header.title} />
                  </MediaIcon>
                )}
                {/* <MediaIcon
                  profile={profile}
                  media="discord"
                  changeTab={changeTab}
                >
                  <DiscordIcon boxSize="6" />
                </MediaIcon> */}
              </Flex>
            </Flex>
            <Text
              fontWeight="medium"
              fontSize={{ base: 'sm', lg: 'md' }}
              color={theme.modal.header.subtitle}
            >
              {truncatedAddress}
            </Text>
          </Flex>
          <Flex
            display={{ base: 'none', lg: 'flex' }}
            w="max-content"
            align="center"
          >
            {!isEditing &&
              (profile.address.toLowerCase() === address?.toLowerCase() ||
                isDaoAdmin) && (
                <Button
                  fontWeight="normal"
                  bgColor="transparent"
                  color={theme.modal.header.title}
                  _hover={{}}
                  _active={{}}
                  _focus={{}}
                  _focusVisible={{}}
                  _focusWithin={{}}
                  onClick={() => handleAuth()}
                >
                  Edit profile
                </Button>
              )}

            {isEditing ? (
              <Button
                bgColor={theme.branding}
                px={['4', '6']}
                py={['3', '6']}
                h="10"
                fontSize={['md']}
                fontWeight="medium"
                onClick={saveEdit}
                _hover={{
                  backgroundColor: convertHexToRGBA(theme.branding, 0.8),
                }}
                _focus={{}}
                _active={{}}
                color={theme.buttonText}
              >
                <Flex gap="2" align="center">
                  {isEditSaving && <Spinner />}
                  Save profile
                </Flex>
              </Button>
            ) : (
              <DelegateCases
                fullAddress={fullAddress}
                status={profileSelected?.status}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex
        display={{ base: 'flex', lg: 'none' }}
        w="full"
        align="center"
        justify="center"
      >
        <DelegateCases
          fullAddress={fullAddress}
          status={profileSelected?.status}
        />
      </Flex>
    </Flex>
  );
};

interface IHeader {
  activeTab: IActiveTab;
  changeTab: (selectedTab: IActiveTab) => void;
  profile: IProfile;
}

export const Header: FC<IHeader> = ({ activeTab, changeTab, profile }) => {
  const { theme } = useDAO();
  const { address: fullAddress } = profile;
  const { isConnected } = useWallet();
  const { address } = useAccount();

  const isSamePerson =
    isConnected && address?.toLowerCase() === fullAddress?.toLowerCase();

  const isActiveTab = (section: IActiveTab) => activeTab === section;

  useMemo(() => {
    if (
      (activeTab === 'handles' || activeTab === 'withdraw') &&
      !isSamePerson
    ) {
      changeTab('statement');
    }
  }, [isSamePerson, activeTab]);

  return (
    <Flex
      borderRadius="12px"
      w="full"
      flexDir="column"
      gap="10"
      bgColor="transparent"
    >
      <Flex w="full" flexDir="column">
        <Img
          src="/images/profilenobg.png"
          borderBottom="1px"
          borderStyle="solid"
          borderColor={theme.modal.header.border}
          borderTopRadius="12px"
          w="full"
          h="180"
        />

        <UserSection profile={profile} changeTab={changeTab} />
      </Flex>
      <Flex
        px={{ base: '1.25rem', lg: '2.5rem' }}
        flexDir="column"
        gap="1.5rem"
      >
        <Flex w="full" flexWrap="wrap" justifyContent="flex-start">
          {profile.aboutMe && (
            <NavButton
              isActive={isActiveTab('aboutme')}
              onClick={() => changeTab('aboutme')}
              w="max-content"
            >
              About me
            </NavButton>
          )}
          <NavButton
            isActive={isActiveTab('statement')}
            onClick={() => changeTab('statement')}
            w="max-content"
          >
            Statement
          </NavButton>
          <NavButton
            isActive={isActiveTab('votinghistory')}
            onClick={() => changeTab('votinghistory')}
            w="max-content"
          >
            Voting History
          </NavButton>
          {isSamePerson && (
            <>
              <NavButton
                isActive={isActiveTab('withdraw')}
                onClick={() => changeTab('withdraw')}
                w="max-content"
              >
                Withdraw
              </NavButton>
              <NavButton
                isActive={isActiveTab('handles')}
                onClick={() => changeTab('handles')}
                w="max-content"
              >
                Handles
              </NavButton>
            </>
          )}
        </Flex>
        <Divider bgColor={theme.modal.header.divider} w="full" />
      </Flex>
    </Flex>
  );
};
