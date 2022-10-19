import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { OrderFilter } from './OrderFilter';
import { PeriodFilter } from './PeriodFilter';
import { StatFilter } from './StatFilter';

export const OrderByFilters = () => {
  const { theme } = useDAO();
  return (
    <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
      <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
        <Text fontFamily="heading" color={theme.filters.head}>
          Order by
        </Text>
        <StatFilter />
      </Flex>
      <OrderFilter />
      <PeriodFilter />
    </Flex>
  );
};
