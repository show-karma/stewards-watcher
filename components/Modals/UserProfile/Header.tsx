import {
  Button,
  ButtonProps,
  Divider,
  Flex,
  Icon,
  Img,
  Link,
  Text,
} from '@chakra-ui/react';
import { DelegateButton } from 'components/DelegateButton';
import { useDAO } from 'contexts';
import { FC, ReactNode, useState } from 'react';
import { BsTwitter } from 'react-icons/bs';
import { IActiveTab } from 'types';

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
  address: string;
  name: string;
  twitter: string;
  avatar: string;
}

const UserSection: FC<IUserSection> = ({ address, name, avatar, twitter }) => {
  const { theme } = useDAO();
  return (
    <Flex top="7.5rem" px="2.5rem" w="full" gap="1.375rem" mt="-3.5rem">
      <Img
        src={avatar}
        w="8.125rem"
        h="8.125rem"
        borderRadius="full"
        borderWidth="2px"
        borderStyle="solid"
        borderColor={theme.modal.header.border}
        objectFit="cover"
      />
      <Flex justifyContent="space-between" w="full" align="flex-end">
        <Flex flexDirection="column" gap="0.5">
          <Flex flexDir="row" gap="2" align="center">
            <Text
              fontFamily="body"
              fontWeight="bold"
              fontSize="2xl"
              color={theme.modal.header.title}
            >
              {address}
            </Text>
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
          </Flex>
          <Text
            fontWeight="medium"
            fontSize="md"
            color={theme.modal.header.subtitle}
          >
            {name}
          </Text>
        </Flex>
        <DelegateButton delegated="0x" text="Select as Delegate" />
      </Flex>
    </Flex>
  );
};

interface IHeader {
  activeTab: IActiveTab;
  changeTab: (selectedTab: IActiveTab) => void;
}

export const Header: FC<IHeader> = ({ activeTab, changeTab }) => {
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
        <Img
          src="/images/profilenobg.png"
          borderBottom="1px"
          borderStyle="solid"
          borderColor={theme.modal.header.border}
          borderTopRadius="12px"
        />

        <UserSection
          address="lindajxie.eth"
          name="John Doe"
          twitter="lindajxie.eth"
          avatar="/images/profilenobg.png"
        />
      </Flex>
      <Flex px="2.5rem" flexDir="column" gap="1.5rem">
        <Flex w="full">
          <NavButton
            isActive={isActiveTab('statement')}
            onClick={() => changeTab('statement')}
          >
            Statement
          </NavButton>
          <NavButton
            isActive={isActiveTab('votingHistory')}
            onClick={() => changeTab('votingHistory')}
          >
            Voting History
          </NavButton>
        </Flex>

        <Divider bgColor={theme.modal.header.divider} w="full" />
      </Flex>
    </Flex>
  );
};
