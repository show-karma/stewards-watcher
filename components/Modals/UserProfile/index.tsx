import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, useMemo, useState } from 'react';
import { IActiveTab, IProfile } from 'types';
import { Header } from './Header';
import { Statement } from './Statement';
import { VotingHistory } from './VotingHistory';

interface ITab {
  activeTab: IActiveTab;
  profile: IProfile;
}
const Tab: FC<ITab> = ({ activeTab, profile }) => {
  if (activeTab === 'votingHistory') return <VotingHistory profile={profile} />;
  return <Statement profile={profile} />;
};

interface IUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IProfile;
  selectedTab: 'statement' | 'votingHistory';
}

export const UserProfile: FC<IUserProfileProps> = props => {
  const { isOpen, onClose, profile, selectedTab } = props;
  const { theme } = useDAO();

  const [activeTab, setActiveTab] = useState<IActiveTab>(selectedTab);

  useMemo(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const changeTab = (chosenTab: IActiveTab) => setActiveTab(chosenTab);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        w={{ base: 'max-content', lg: '920' }}
        maxW={{ base: 'max-content', lg: '920' }}
        borderRadius="12px"
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.modal.header.border}
        bgColor={theme.modal.background}
        mx="1rem"
      >
        <Header changeTab={changeTab} activeTab={activeTab} profile={profile} />
        <ModalCloseButton />
        <ModalBody px={{ base: '1.25rem', lg: '2.5rem' }}>
          <Tab activeTab={activeTab} profile={profile} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
