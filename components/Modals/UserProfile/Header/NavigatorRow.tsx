import { Divider, Flex } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { IActiveTab, IProfile } from 'types';
import { NavButton } from './NavButton';

interface INavigatorRow {
  profile: IProfile;
  isSamePerson: boolean;
  activeTab: IActiveTab;
  changeTab: (selectedTab: IActiveTab) => void;
}

export const NavigatorRow: FC<INavigatorRow> = ({
  profile,
  isSamePerson,
  activeTab,
  changeTab,
}) => {
  const { theme } = useDAO();
  const isActiveTab = (section: IActiveTab) => activeTab === section;
  return (
    <Flex
      px={{ base: '1.25rem', lg: '2.5rem' }}
      flexDir="column"
      gap="0"
      w="max-content"
    >
      <Flex
        w="full"
        justifyContent="flex-start"
        gap="1px"
        borderTopRadius="5px"
        maxW="512px"
      >
        {profile.aboutMe && (
          <NavButton
            isActive={isActiveTab('aboutme')}
            onClick={() => changeTab('aboutme')}
            w="max-content"
            borderTopLeftRadius={profile.aboutMe ? '5px' : '0'}
          >
            About me
          </NavButton>
        )}
        <NavButton
          isActive={isActiveTab('statement')}
          onClick={() => changeTab('statement')}
          borderTopLeftRadius={profile.aboutMe ? '0' : '5px'}
        >
          Statement
        </NavButton>
        <NavButton
          isActive={isActiveTab('votinghistory')}
          onClick={() => changeTab('votinghistory')}
          borderTopRightRadius={isSamePerson ? '0' : '5px'}
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
              borderTopRightRadius={isSamePerson ? '5px' : '0'}
            >
              Handles
            </NavButton>
          </>
        )}
      </Flex>
      <Divider bgColor={`${theme.modal.header.divider}0D`} w="full" />
    </Flex>
  );
};
