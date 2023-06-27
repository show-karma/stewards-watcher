import {
  Button,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuListProps,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { BiChevronDown } from 'react-icons/bi';

interface IConvictionMenu {
  selectConviction: (selectedConviction: number) => void;
  conviction?: number;
  menuButtonStyle?: MenuButtonProps;
  menuListStyle?: MenuListProps;
  menuItemStyle?: MenuItemProps;
}

export const ConvictionMenu: FC<IConvictionMenu> = ({
  selectConviction,
  conviction,
  menuButtonStyle,
  menuListStyle,
  menuItemStyle,
}) => {
  const { daoInfo } = useDAO();
  const { DELEGATION_CONVICTION_OPTIONS: options } = daoInfo.config;

  if (!options) return null;

  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        rightIcon={<BiChevronDown />}
        color="black"
        w="max-content"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="black"
        fontSize="sm"
        {...menuButtonStyle}
      >
        {conviction !== undefined
          ? options.find(opt => opt.value === conviction)?.locktime
          : 'Conviction'}
      </MenuButton>
      <MenuList
        background="white"
        w="max-content"
        minW="max-content"
        {...menuListStyle}
      >
        {options.map((option, index) => (
          <MenuItem
            key={+index}
            bg="transparent"
            color="black"
            minW="36"
            _hover={{
              opacity: 0.6,
            }}
            onClick={() => selectConviction(option.value)}
            {...menuItemStyle}
          >
            {option.locktime}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
