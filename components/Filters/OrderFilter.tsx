import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
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
    <Menu isLazy id="order-filter">
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
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        gap="1"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        fontSize="md"
        minW="min-content"
        w="full"
        maxW={{ base: 'full', md: 'max-content' }}
        _hover={{
          bg: theme.filters.activeBg,
        }}
        _active={{
          bg: theme.filters.activeBg,
        }}
        px="4"
        py="3"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {selectedOrder}
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        h={{ base: 'max-content' }}
        maxH={{ base: '64' }}
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
            marginX: '4px',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            bgColor: theme.filters.activeBg,
          },
        }}
      >
        {orderOptions.map((option, index) => (
          <MenuItem
            key={+index}
            onClick={() => selectOrder(option.order)}
            bgColor="transparent"
            _hover={{
              bg: theme.filters.activeBg,
            }}
          >
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
