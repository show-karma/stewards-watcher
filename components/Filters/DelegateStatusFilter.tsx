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
    <Menu isLazy closeOnSelect={false} id="delegate-status-filter">
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

// const orderOptions: IOrderOptions[] = [
//   { title: 'Descending', order: 'desc' },
//   { title: 'Ascending', order: 'asc' },
// ];

// export const OrderFilter = () => {
//   const { order, selectOrder } = useDelegates();
//   const { theme } = useDAO();

//   const selectedOrder = orderOptions.find(
//     option => option.order === order
//   )?.title;
//   return (
//     <Menu isLazy id="order-filter">
//       <MenuButton
//         as={Button}
//         rightIcon={<IoChevronDownOutline />}
//         bgColor={theme.filters.bg}
//         borderWidth="1px"
//         borderColor={theme.filters.border}
//         borderStyle="solid"
//         boxShadow={theme.filters.shadow}
//         color={theme.filters.title}
//         borderRadius="sm"
//         gap="1"
//         fontFamily="heading"
//         fontWeight="normal"
//         textAlign="left"
//         fontSize="md"
//         minW="min-content"
//         maxW="full"
//         flex="1"
//       >
//         {selectedOrder}
//       </MenuButton>
//       <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
//         {orderOptions.map((option, index) => (
//           <MenuItem key={+index} onClick={() => selectOrder(option.order)}>
//             {option.title}
//           </MenuItem>
//         ))}
//       </MenuList>
//     </Menu>
//   );
// };
