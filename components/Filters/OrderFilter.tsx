import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { THEME } from 'configs';
import { useStewards } from 'contexts';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
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
  const { order, selectOrder } = useStewards();

  const selectedOrder = orderOptions.find(
    option => option.order === order
  )?.title;
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<HiChevronDown />}
        bgColor={THEME.background}
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
      >
        {selectedOrder}
      </MenuButton>
      <MenuList>
        {orderOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectOrder(option.order)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
