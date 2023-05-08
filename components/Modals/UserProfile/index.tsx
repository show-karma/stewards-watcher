import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { EditProfileProvider, useDAO, VotesProvider } from 'contexts';
import { useRouter } from 'next/router';
import { FC, useMemo, useState } from 'react';
import { IActiveTab, IProfile } from 'types';
import { useMixpanel } from 'hooks';
import dynamic from 'next/dynamic';
import { Header } from './Header';
import { VotingHistory } from './VotingHistory';

const WithdrawDelegation = dynamic(() =>
  import('components/Modals/UserProfile/WithdrawDelegation').then(
    module => module.WithdrawDelegation
  )
);

const AboutMe = dynamic(() =>
  import('components/Modals/UserProfile/AboutMe').then(module => module.AboutMe)
);

const Statement = dynamic(() =>
  import('components/Modals/UserProfile/Statement').then(
    module => module.Statement
  )
);

const Handles = dynamic(() =>
  import('components/Modals/UserProfile/Handles').then(module => module.Handles)
);

interface ITab {
  activeTab: IActiveTab;
  profile: IProfile;
}
const Tab: FC<ITab> = ({ activeTab, profile }) => {
  if (activeTab === 'aboutme') {
    return <AboutMe profile={profile} />;
  }
  if (activeTab === 'votinghistory') {
    return (
      <VotesProvider profile={profile}>
        <VotingHistory profile={profile} />
      </VotesProvider>
    );
  }
  if (activeTab === 'handles') {
    return <Handles />;
  }
  if (activeTab === 'withdraw') {
    return <WithdrawDelegation />;
  }
  return <Statement />;
};

interface IUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IProfile;
  selectedTab: IActiveTab;
}

export const UserProfile: FC<IUserProfileProps> = props => {
  const { isOpen, onClose, profile, selectedTab } = props;
  const router = useRouter();
  const { theme } = useDAO();
  const { mixpanel } = useMixpanel();
  const [activeTab, setActiveTab] = useState<IActiveTab>(selectedTab);

  useMemo(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const changeTab = (hash: IActiveTab) => {
    mixpanel.reportEvent({
      event: 'viewActivity',
      properties: {
        tab: hash,
      },
    });
    router
      .push(
        {
          pathname: `/profile/${profile.ensName || profile.address}`,
          hash,
        },
        undefined,
        { shallow: true }
      )
      .catch(error => {
        if (!error.cancelled) {
          throw error;
        }
      });
    setActiveTab(hash);
  };

  const onCloseModal = () => {
    router
      .push(
        {
          pathname: '/',
        },
        undefined,
        { shallow: true }
      )
      .catch(error => {
        if (!error.cancelled) {
          throw error;
        }
      });
    onClose();
  };

  return (
    <EditProfileProvider>
      <Modal isOpen={isOpen} onClose={onCloseModal} trapFocus={false}>
        <ModalOverlay
          background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
          backdropFilter="blur(4px)"
        />
        <ModalContent
          w={{ base: 'max-content', lg: 'full' }}
          maxW={{ base: 'max-content', lg: '1100px' }}
          borderRadius="12px"
          border="none"
          bgColor={theme.modal.background}
          mx="1rem"
        >
          <Header
            changeTab={changeTab}
            activeTab={activeTab}
            profile={profile}
          />
          <ModalCloseButton />
          <ModalBody px={{ base: '1.25rem', lg: '2.5rem' }} py="0">
            <Tab activeTab={activeTab} profile={profile} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </EditProfileProvider>
  );
};
