import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { DelegateStatusFilter } from './DelegateStatusFilter';
import { InterestsFilter } from './InterestsFilter';
import { OrderFilter } from './OrderFilter';
import { PeriodFilter } from './PeriodFilter';
import { SortBy } from './SortBy';
import { StatFilter } from './StatFilter';

export const OrderByFilters = () => {
  const { interests } = useDelegates();
  const { theme, daoInfo } = useDAO();

  return (
    <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
      <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
        <Text fontFamily="heading" color={theme.filters.head}>
          Filter by
        </Text>
        <Flex flexDir="row" gap="4" flexWrap="wrap">
          {interests.length > 0 && <InterestsFilter />}
          {daoInfo.config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER && (
            <DelegateStatusFilter />
          )}
          <PeriodFilter />
        </Flex>
      </Flex>
    </Flex>
  );
};
