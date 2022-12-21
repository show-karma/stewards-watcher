import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';
import { IFilterPeriod } from 'types';

interface IPeriodOptions {
  title: string;
  period: IFilterPeriod;
}

const periodOptions: IPeriodOptions[] = [
  { title: 'Lifetime', period: 'lifetime' },
  { title: '30 days', period: '30d' },
  { title: '180 days', period: '180d' },
];

export const PeriodFilter = () => {
  const { period, selectPeriod } = useDelegates();
  const { theme } = useDAO();

  const selectedPeriod = periodOptions.find(
    option => option.period === period
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
        {selectedPeriod}
      </MenuButton>
      <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
        {periodOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectPeriod(option.period)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
