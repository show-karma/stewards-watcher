import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { useRouter } from 'next/router';
import { FC } from 'react';

export const MonthDropdown: FC = () => {
  const router = useRouter();
  const { rootPathname } = useDAO();
  const { theme } = useDAO();
  const { selectedDate, setSelectedDate } = useDelegateCompensation();
  const renderMonthList = () => {
    const supportedDates = [];
    const startYear = 2024;
    const currentDate = new Date();

    for (let year = startYear; year <= currentDate.getFullYear(); year += 1) {
      for (let month = 0; month < 12; month += 1) {
        if ((month === 0 && year === 2024) || (month === 1 && year === 2024)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (
          year === currentDate.getFullYear() &&
          month > currentDate.getMonth()
        ) {
          break;
        }
        if (year > 2024 || (month >= 10 && year === 2024)) {
          break;
        }
        supportedDates.push({
          name: new Date(year, month, 1).toLocaleString('en-US', {
            month: 'long',
          }),
          value: {
            month: month + 1,
            year,
          },
        });
      }
    }

    return supportedDates.map(itemDate => (
      <MenuItem
        key={itemDate.name}
        bg={theme.filters.bg}
        opacity={
          selectedDate?.value.month === itemDate.value.month &&
          selectedDate?.value.year === itemDate.value.year
            ? 0.5
            : 1
        }
        _hover={{ opacity: 0.7 }}
        onClick={() => {
          setSelectedDate({
            name: itemDate.name,
            value: itemDate.value,
          });
          router.push(
            {
              pathname: router.pathname.includes('/admin')
                ? `/${rootPathname}/delegate-compensation/admin`
                : `/${rootPathname}/delegate-compensation`,
              query: {
                month: itemDate.name.toLowerCase(),
                year: itemDate.value.year,
              },
            },
            undefined,
            { shallow: true }
          );
        }}
      >
        {itemDate.name} {itemDate.value.year}
      </MenuItem>
    ));
  };
  return (
    <Menu>
      <MenuButton
        w="max-content"
        bg={theme.filters.activeBg}
        as={Button}
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.card.interests.text}
        rightIcon={
          <DownChevron
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="4"
          />
        }
      >
        {selectedDate?.name} {selectedDate?.value.year}
      </MenuButton>
      <MenuList
        _hover={{
          opacity: 0.7,
        }}
        bg={theme.filters.bg}
        maxH={300}
        overflowY="auto"
      >
        {renderMonthList()}
      </MenuList>
    </Menu>
  );
};
