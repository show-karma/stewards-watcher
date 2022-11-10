import {
  Button,
  ButtonProps,
  Divider,
  Flex,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react';
import { ImgWithFallback, DelegateButton } from 'components';
import { useDAO } from 'contexts';
import { FC, ReactNode } from 'react';
import { BsTwitter } from 'react-icons/bs';
import { IActiveTab, IProfile } from 'types';
import { truncateAddress } from 'utils';

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

interface IUserSection {
  profile: IProfile;
}

const UserSection: FC<IUserSection> = ({ profile }) => {
  const { address: fullAddress, ensName, twitter } = profile;
  const address = truncateAddress(fullAddress);
  const { theme } = useDAO();

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
              width={{ base: '200px', sm: '300px', md: '600px', lg: '440px' }}
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
                {ensName || address}
              </Text>
              {twitter && (
                <Link href={`https://twitter.com/${twitter}`} isExternal>
                  <Icon
                    as={BsTwitter}
                    color={theme.modal.header.twitter}
                    w="1.375rem"
                    h="1.03rem"
                    _hover={{
                      color: 'blue.400',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  />
                </Link>
              )}
            </Flex>
            <Text
              fontWeight="medium"
              fontSize={{ base: 'sm', lg: 'md' }}
              color={theme.modal.header.subtitle}
            >
              {address}
            </Text>
          </Flex>
          <Flex display={{ base: 'none', lg: 'flex' }} w="max-content">
            <DelegateButton delegated={fullAddress} text="Select as Delegate" />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        display={{ base: 'flex', lg: 'none' }}
        w="full"
        align="center"
        justify="center"
      >
        <DelegateButton delegated={fullAddress} text="Select as Delegate" />
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

  const isActiveTab = (section: IActiveTab) => activeTab === section;

  return (
    <Flex
      borderRadius="12px"
      w="full"
      flexDir="column"
      gap="10"
      bgColor="transparent"
    >
      <Flex w="full" flexDir="column">
        <ImgWithFallback
          src="/images/profilenobg.png"
          borderBottom="1px"
          borderStyle="solid"
          borderColor={theme.modal.header.border}
          borderTopRadius="12px"
          w="full"
          h="180"
        />

        <UserSection profile={profile} />
      </Flex>
      <Flex
        px={{ base: '1.25rem', lg: '2.5rem' }}
        flexDir="column"
        gap="1.5rem"
      >
        <Flex w="full">
          <NavButton
            isActive={isActiveTab('statement')}
            onClick={() => changeTab('statement')}
          >
            Statement
          </NavButton>
          <NavButton
            isActive={isActiveTab('votinghistory')}
            onClick={() => changeTab('votinghistory')}
          >
            Voting History
          </NavButton>
        </Flex>

        <Divider bgColor={theme.modal.header.divider} w="full" />
      </Flex>
    </Flex>
  );
};
