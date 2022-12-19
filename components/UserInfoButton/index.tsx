import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useMixpanel } from 'hooks';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { TbExternalLink } from 'react-icons/tb';
import { IActiveTab, IDelegate } from 'types';

interface IUserInfoProps {
  onOpen: (profile: IDelegate, tab?: IActiveTab) => void;
  profile: IDelegate;
}

export const UserInfoButton: FC<IUserInfoProps> = ({ onOpen, profile }) => {
  const { theme } = useDAO();
  const { mixpanel } = useMixpanel();
  const router = useRouter();
  const options: { title: string; tab: IActiveTab }[] = [
    {
      title: 'About me',
      tab: 'aboutMe',
    },
    {
      title: 'User Statement',
      tab: 'statement',
    },
    {
      title: 'Voting History',
      tab: 'votinghistory',
    },
  ];

  const redirectWithoutRefresh = (hash: IActiveTab) => {
    onOpen(profile, hash);
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
  };

  return (
    <Menu placement="top-start">
      <MenuButton
        as={Button}
        h={['10', '12']}
        fontSize={['md']}
        fontWeight="medium"
        bg="transparent"
        borderWidth="2px"
        borderColor={theme.buttonTextSec}
        color={theme.buttonTextSec}
        borderStyle="solid"
        _hover={{}}
        _active={{}}
        _focus={{}}
      >
        Show Activity
      </MenuButton>
      <MenuList bgColor={theme.card.background}>
        {options.map(({ title, tab }, index) => (
          <MenuItem
            key={+index}
            justifyContent="space-between"
            textDecor="none"
            fontSize={['sm', 'md']}
            _hover={{ textDecor: 'none', opacity: '0.7' }}
            onClick={() => redirectWithoutRefresh(tab)}
          >
            {title} <Icon as={TbExternalLink} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
