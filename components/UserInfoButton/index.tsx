import { Button, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { LINKS } from 'helpers';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { IActiveTab, IDelegate } from 'types';

interface IUserInfoProps {
  onOpen: (profile: IDelegate, tab?: IActiveTab) => void;
  profile: IDelegate;
}

export const UserInfoButton: FC<IUserInfoProps> = ({ onOpen, profile }) => {
  const { theme, rootPathname } = useDAO();

  const router = useRouter();

  const redirectWithoutRefresh = (hash: IActiveTab) => {
    onOpen(profile, hash);

    router
      .push(
        {
          pathname: LINKS.PROFILE(
            rootPathname,
            profile.ensName || profile.address
          ),
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
      fontSize={['sm', 'md']}
      fontWeight="medium"
      color={theme.buttonTextSec}
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
      h="10"
      px="3"
      py="6"
      onClick={() => redirectWithoutRefresh('overview')}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* <HistoryIcon boxSize="17px" /> */}
      <Text h="max-content">Overview</Text>
    </Button>
  );
};
