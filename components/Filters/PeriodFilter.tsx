import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { THEME } from 'configs';
import { useDelegates } from 'contexts';
import { HiChevronDown } from 'react-icons/hi';
import { IFilterPeriod } from 'types';

interface IPeriodOptions {
  title: string;
  period: IFilterPeriod;
}

const periodOptions: IPeriodOptions[] = [
  { title: 'Lifetime', period: 'lifetime' },
  { title: '30 days', period: '30d' },
];

export const PeriodFilter = () => {
  const { period, selectPeriod } = useDelegates();

  const selectedPeriod = periodOptions.find(
    option => option.period === period
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
        {selectedPeriod}
      </MenuButton>
      <MenuList>
        {periodOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectPeriod(option.period)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
