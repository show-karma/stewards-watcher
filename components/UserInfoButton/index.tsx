import { Button } from '@chakra-ui/react';
import { HistoryIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { IActiveTab, IDelegate } from 'types';

interface IUserInfoProps {
  onOpen: (profile: IDelegate, tab?: IActiveTab) => void;
  profile: IDelegate;
}

export const UserInfoButton: FC<IUserInfoProps> = ({ onOpen, profile }) => {
  const { theme } = useDAO();

  const router = useRouter();

  const redirectWithoutRefresh = (hash: IActiveTab) => {
    onOpen(profile, hash);

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
  };

  return (
    <Button
      as={Button}
      h={['10', '12']}
      fontSize="sm"
      fontWeight="medium"
      bg="transparent"
      color={theme.buttonTextSec}
      borderStyle="solid"
      _hover={{
        backgroundColor: theme.card.statBg,
        opacity: 0.8,
      }}
      _active={{}}
      _focus={{}}
      _focusVisible={{}}
      _focusWithin={{}}
      fontFamily="heading"
      backgroundColor={theme.card.statBg}
      gap="6px"
      px="2"
      py="3"
      onClick={() => redirectWithoutRefresh('votinghistory')}
    >
      <HistoryIcon boxSize="22px" />
      Vote History
    </Button>
  );
};
