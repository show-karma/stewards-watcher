import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';
import { IFilterOrder } from 'types';

interface IOrderOptions {
  title: string;
  order: IFilterOrder;
}

const orderOptions: IOrderOptions[] = [
  { title: 'Descending', order: 'desc' },
  { title: 'Ascending', order: 'asc' },
];

export const OrderFilter = () => {
  const { order, selectOrder } = useDelegates();
  const { theme } = useDAO();

  const selectedOrder = orderOptions.find(
    option => option.order === order
  )?.title;
  return (
    <Menu>
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
        gap="1"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        fontSize="md"
        minW="min-content"
        maxW="full"
        flex="1"
      >
        {selectedOrder}
      </MenuButton>
      <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
        {orderOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectOrder(option.order)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
