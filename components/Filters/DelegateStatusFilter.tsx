import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';
import { IStatusOptions } from 'types';

const defaultStatuses: {
  label: string;
  value: IStatusOptions;
}[] = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Withdrawn',
    value: 'withdrawn',
  },
  {
    label: 'Recognized',
    value: 'recognized',
  },
];

export const DelegateStatusFilter = () => {
  const { selectStatus, statuses } = useDelegates();
  const { theme } = useDAO();

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<IoChevronDownOutline />}
        bgColor={theme.filters.bg}
        borderWidth="1px"
        borderColor={theme.filters.border}
        borderStyle="solid"
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        borderRadius="sm"
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
      >
        Delegate Status
      </MenuButton>
      <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
        <MenuOptionGroup type="checkbox" value={statuses}>
          {defaultStatuses.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option.value}
              onClick={() => selectStatus(option.value)}
            >
              {option.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
