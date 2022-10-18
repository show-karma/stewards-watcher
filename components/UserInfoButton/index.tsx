import {
  Button,
  Icon,
  Link,
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
  user?: string;
}

export const UserInfoButton: FC<IUserInfoProps> = ({ user }) => {
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;
  const options = [
    {
      title: 'User Statement',
      link: '/',
    },
    {
      title: 'Voting History',
      link: '/',
    },
    {
      title: 'Voting Thread',
      link: '/',
    },
  ];
  return (
    <Menu placement="top-start">
      <MenuButton
        as={Button}
        h={['10', '12']}
        rightIcon={<GoPlus />}
        fontSize={['sm', 'md']}
        fontWeight="medium"
        bg="transparent"
        borderWidth="2px"
        borderColor="white"
        borderStyle="solid"
        _hover={{}}
        _active={{}}
        _focus={{}}
      >
        User Info
      </MenuButton>
      <MenuList bgColor={theme.branding}>
        {options.map(({ title, link }, index) => (
          <Link
            isExternal
            key={+index}
            href={link}
            _hover={{ textDecor: 'none', opacity: '0.7' }}
          >
            <MenuItem
              justifyContent="space-between"
              textDecor="none"
              fontSize={['sm', 'md']}
            >
              {title} <Icon as={TbExternalLink} />
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
};
