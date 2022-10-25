import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, useState } from 'react';
import { IActiveTab } from 'types';
import { Header } from './Header';
import { Statement } from './Statement';
import { VotingHistory } from './VotingHistory';

interface ITab {
  activeTab: IActiveTab;
}
const Tab: FC<ITab> = ({ activeTab }) => {
  if (activeTab === 'votingHistory') return <VotingHistory />;
  return <Statement />;
};

interface IUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
export const UserProfile: FC<IUserProfileProps> = props => {
  const { isOpen, onClose } = props;
  const { theme } = useDAO();

  const [activeTab, setActiveTab] = useState<IActiveTab>('statement');

  const changeTab = (selectedTab: IActiveTab) => setActiveTab(selectedTab);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        w="max-content"
        maxW="max-content"
        borderRadius="12px"
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.modal.header.border}
        bgColor={theme.modal.background}
      >
        <Header changeTab={changeTab} activeTab={activeTab} />
        <ModalCloseButton />
        <ModalBody px="2.5rem">
          <Tab activeTab={activeTab} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
