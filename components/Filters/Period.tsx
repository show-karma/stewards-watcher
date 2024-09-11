import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { IFilterPeriod } from 'types';

interface IPeriodOptions {
  title: string;
  period: IFilterPeriod;
}

const periodOptions: IPeriodOptions[] = [
  { title: 'Lifetime', period: 'lifetime' },
  { title: '30 days', period: '30d' },
  { title: '90 days', period: '90d' },
  { title: '180 days', period: '180d' },
];

export const PeriodFilter = () => {
  const { period, selectPeriod, setupFilteringUrl } = useDelegates();
  const {
    theme,
    daoInfo: { config },
  } = useDAO();

  const selectedPeriod = periodOptions.find(
    option => option.period === period
  )?.title;

  const handleSelectPeriod = async (option: IFilterPeriod) => {
    selectPeriod(option);
    setupFilteringUrl('period', option);
  };

  const defaultState =
    period === (config.DAO_DEFAULT_SETTINGS?.TIMEPERIOD || 'lifetime');

  return (
    <Menu isLazy id="period-filter">
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
        bg={defaultState ? theme.filters.bg : theme.branding}
        color={defaultState ? theme.filters.title : theme.buttonText}
        _hover={{
          opacity: 0.8,
        }}
        _active={{
          opacity: 0.8,
        }}
        borderWidth="1px"
        borderColor={theme.filters.border}
        borderStyle="solid"
        boxShadow={theme.filters.shadow}
        gap="1"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        fontSize="md"
        minW="min-content"
        w={{ base: 'full', md: 'max-content' }}
        maxW="full"
        px="4"
        py="5"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {selectedPeriod}
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
        {periodOptions.map((option, index) => (
          <MenuItem
            key={+index}
            onClick={() => handleSelectPeriod(option.period)}
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
