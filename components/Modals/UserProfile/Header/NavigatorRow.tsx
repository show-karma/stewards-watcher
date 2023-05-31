import { Flex } from '@chakra-ui/react';
import { useAuth, useDAO } from 'contexts';
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
  const { theme, daoInfo } = useDAO();
  const { isDaoAdmin } = useAuth();
  const isActiveTab = (section: IActiveTab) => activeTab === section;

  return (
    <Flex
      px={{ base: '1.25rem', lg: '2.5rem' }}
      flexDir="column"
      gap="0"
      w="full"
    >
      <Flex
        w="full"
        justifyContent="flex-start"
        gap="1px"
        borderTopRadius="5px"
        maxW="588px"
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
        {daoInfo.config.DAO_SUPPORTS_TOA ? (
          <NavButton
            isActive={isActiveTab('toa')}
            onClick={() => changeTab('toa')}
            borderTopRightRadius={isSamePerson || isDaoAdmin ? '0' : '5px'}
            minW="max-content"
          >
            Delegation Agreement
          </NavButton>
        ) : null}
        <NavButton
          isActive={isActiveTab('votinghistory')}
          onClick={() => changeTab('votinghistory')}
          borderTopRightRadius={isSamePerson || isDaoAdmin ? '0' : '5px'}
        >
          Voting History
        </NavButton>

        {isSamePerson && (
          <NavButton
            isActive={isActiveTab('withdraw')}
            onClick={() => changeTab('withdraw')}
            borderTopRightRadius={isSamePerson ? '0' : '5px'}
            w="max-content"
          >
            Withdraw
          </NavButton>
        )}

        {(isSamePerson || isDaoAdmin) &&
        daoInfo.config.SHOULD_NOT_SHOW !== 'handles' ? (
          <NavButton
            isActive={isActiveTab('handles')}
            onClick={() => changeTab('handles')}
            borderTopRightRadius={isSamePerson ? '0' : '5px'}
            w="max-content"
          >
            Handles
          </NavButton>
        ) : (
          <Flex
            borderBottomWidth="1px"
            borderBottomStyle="solid"
            borderBottomColor={`${theme.modal.buttons.navBorder}0D`}
            h="full"
            minH="52px"
            flex="1"
            ml="-1px"
            sx={{
              '@media(max-width: 1116px)': {
                display: 'none',
              },
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};
