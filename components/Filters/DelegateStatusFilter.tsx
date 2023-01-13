import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
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
    <Menu isLazy closeOnSelect={false} id="delegate-status-filter">
      <MenuButton
        as={Button}
        rightIcon={
          <DownChevron
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="5"
          />
        }
        bgColor={theme.filters.bg}
        borderWidth="1px"
        borderColor={theme.filters.border}
        borderStyle="solid"
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
        maxW="full"
        _hover={{
          bg: theme.filters.activeBg,
        }}
        _active={{
          bg: theme.filters.activeBg,
        }}
        px="4"
        py="5"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {defaultStatuses.find(item => item.value === statuses)?.label}
      </MenuButton>
      <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
        <MenuOptionGroup value={statuses}>
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
