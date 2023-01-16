import { Button } from '@chakra-ui/react';
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
      fontSize={['md']}
      fontWeight="medium"
      bg="transparent"
      color={theme.buttonTextSec}
      borderStyle="solid"
      _hover={{
        textDecoration: 'underline',
        cursor: 'pointer',
        bg: 'transparent',
      }}
      _active={{}}
      _focus={{}}
      _focusVisible={{}}
      _focusWithin={{}}
      onClick={() => redirectWithoutRefresh('votinghistory')}
    >
      Activity
    </Button>
  );
};
