import {
  Button,
  Icon,
  Flex,
  Img,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import {
  DelegateButton,
  ForumIcon,
  TwitterIcon,
  DiscordIcon,
  WebsiteIcon,
  ThreadIcon,
} from 'components';
import { GasfreeButton } from 'components/HeaderHat/GasfreeButton';
import { useDAO, useDelegates, useEditProfile, useWallet } from 'contexts';
import { useAuth } from 'contexts/auth';
import { useToasty } from 'hooks';
import { FC, useMemo, useState } from 'react';
import { IoCopy } from 'react-icons/io5';
import { IActiveTab, IProfile } from 'types';
import { convertHexToRGBA, truncateAddress } from 'utils';
import {
  DelegateProfile,
  DelegateWithProfile,
} from 'utils/delegate-registry/types';
import { useAccount } from 'wagmi';
import { NameEditable, PictureEditable } from '../EditProfile';
import { MediaIcon } from './MediaIcon';
import { NavigatorRow } from './NavigatorRow';

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
        bg={theme.collapse.bg || theme.card.background}
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
  const { theme, daoData, daoInfo } = useDAO();
  const { profileSelected } = useDelegates();
  const { isEditing, setIsEditing, isEditSaving, saveEdit } = useEditProfile();
  const { address } = useAccount();
  const { authenticate, isAuthenticated, isDaoAdmin } = useAuth();
  const { toast } = useToasty();

  const { onCopy } = useClipboard(fullAddress || '');
  const { config } = daoInfo;

  const [isConnecting, setConnecting] = useState(false);

  const isSamePerson =
    isConnected &&
    (address?.toLowerCase() === fullAddress?.toLowerCase() || isDaoAdmin);

  const copyText = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      description: 'Address copied',
      duration: 3000,
    });
  };

  const handleAuth = async () => {
    if (!isConnected) {
      openConnectModal?.();
      setConnecting(true);
      return;
    }
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

  const getDataStatusColor = (status: string) => {
    if (status === 'inactive' || status === 'withdrawn') return '#F4EB0F';
    return '#30E320';
  };

  return (
    <Flex
      px={{ base: '1.25rem', lg: '2.5rem' }}
      w="full"
      mt={{ base: '-1.25rem', lg: '-3.5rem' }}
      flexDir="column"
      gap={{ base: '2rem', lg: '0' }}
      pt="5"
    >
      <Flex w="full" gap={{ base: '1rem', lg: '1.375rem' }}>
        <PictureEditable
          src={
            profileSelected?.profilePicture ||
            `${config.IMAGE_PREFIX_URL}${profileSelected?.address}` ||
            ''
          }
        />
        <Flex justifyContent="space-between" w="full" align="flex-end">
          <Flex flexDirection="column" gap="0.5" w="full">
            <Flex
              flexDir="row"
              gap="2"
              align="center"
              width={{ base: '200px', sm: '300px', md: '600px', lg: '340px' }}
            >
              <NameEditable name={realName || ensName} />
              <Flex flexDir="row" gap="4" ml="4">
                {daoInfo.config.SHOULD_NOT_SHOW !== 'handles' && (
                  <MediaIcon
                    profile={profile}
                    media="twitter"
                    changeTab={changeTab}
                    isSamePerson={isSamePerson}
                  >
                    <TwitterIcon boxSize="6" color={theme.modal.header.title} />
                  </MediaIcon>
                )}
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
                <MediaIcon
                  profile={profile}
                  media="discord"
                  changeTab={changeTab}
                  isSamePerson={isSamePerson}
                >
                  <DiscordIcon boxSize="6" color={theme.modal.header.title} />
                </MediaIcon>
                <MediaIcon
                  profile={profile}
                  media="website"
                  changeTab={changeTab}
                  isSamePerson={isSamePerson}
                >
                  <WebsiteIcon boxSize="6" color={theme.modal.header.title} />
                </MediaIcon>
                <MediaIcon
                  profile={profile}
                  media="thread"
                  changeTab={changeTab}
                  isSamePerson={isSamePerson}
                >
                  <ThreadIcon boxSize="6" color={theme.modal.header.title} />
                </MediaIcon>
              </Flex>
            </Flex>
            <Flex gap="1.5" flexDir="row" align="center">
              <Text
                fontWeight="medium"
                fontSize={{ base: 'sm', lg: 'md' }}
                color={theme.modal.header.subtitle}
              >
                {truncatedAddress}
              </Text>
              <Button
                bg="transparent"
                py="0"
                px="0"
                _hover={{
                  opacity: 0.7,
                }}
                _active={{}}
                _focus={{}}
                onClick={copyText}
                h="max-content"
                w="min-content"
                minW="min-content"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={IoCopy} color={theme.subtitle} boxSize="4" />
              </Button>
            </Flex>
            <Flex gap="2">
              <Text
                fontWeight="medium"
                fontSize={{ base: 'sm', lg: '14px' }}
                color={theme.modal.header.subtitle}
              >
                Status:
              </Text>
              {profileSelected && (
                <Flex gap="1" align="center">
                  <Flex
                    borderRadius="full"
                    w="11px"
                    h="11px"
                    backgroundColor={getDataStatusColor(
                      profileSelected.status || 'active'
                    )}
                  />
                  <Text
                    fontWeight="400"
                    fontSize="14px"
                    color={theme.modal.votingHistory.headline}
                  >
                    {profileSelected.status
                      ? profileSelected.status.charAt(0).toUpperCase() +
                        profileSelected.status.slice(1)
                      : 'Active'}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex
            display={{ base: 'none', lg: 'flex' }}
            w="max-content"
            align="center"
          >
            {!isEditing &&
            (profile.address.toLowerCase() === address?.toLowerCase() ||
              isDaoAdmin) ? (
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
                border="1px solid"
                borderColor={theme.modal.header.title}
              >
                Edit profile
              </Button>
            ) : null}

            {isEditing ? (
              <Button
                background={theme.branding}
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
  const { theme, daoInfo } = useDAO();
  const { address: fullAddress } = profile;
  const { isConnected } = useWallet();
  const { address } = useAccount();
  const { isDaoAdmin, isAuthenticated } = useAuth();

  const isSamePerson =
    isConnected && address?.toLowerCase() === fullAddress?.toLowerCase();

  useMemo(() => {
    if (
      !isDaoAdmin &&
      (((activeTab === 'handles' || activeTab === 'withdraw') &&
        (!isSamePerson || !isAuthenticated)) ||
        (activeTab === 'handles' &&
          daoInfo.config.SHOULD_NOT_SHOW === 'handles'))
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
      <NavigatorRow
        activeTab={activeTab}
        changeTab={changeTab}
        isSamePerson={isSamePerson}
        profile={profile}
      />
    </Flex>
  );
};
