import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { GoPlus } from 'react-icons/go';
import { TbExternalLink } from 'react-icons/tb';

interface IUserInfoProps {
  onOpen: (tab: 'statement' | 'votingHistory') => void;
}

export const UserInfoButton: FC<IUserInfoProps> = ({ onOpen }) => {
  const { theme } = useDAO();

  const options: { title: string; tab: 'statement' | 'votingHistory' }[] = [
    {
      title: 'User Statement',
      tab: 'statement',
    },
    {
      title: 'Voting History',
      tab: 'votingHistory',
    },
  ];
  return (
    <Menu placement="top-start">
      <MenuButton
        as={Button}
        h={['10', '12']}
        rightIcon={<GoPlus />}
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
        User Info
      </MenuButton>
      <MenuList bgColor={theme.card.background}>
        {options.map(({ title, tab }, index) => (
          <MenuItem
            key={+index}
            justifyContent="space-between"
            textDecor="none"
            fontSize={['sm', 'md']}
            _hover={{ textDecor: 'none', opacity: '0.7' }}
            onClick={() => onOpen(tab)}
          >
            {title} <Icon as={TbExternalLink} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
