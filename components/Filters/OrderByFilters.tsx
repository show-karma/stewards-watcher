import { Flex, Text } from '@chakra-ui/react';
import { OrderFilter } from './OrderFilter';
import { PeriodFilter } from './PeriodFilter';
import { StatFilter } from './StatFilter';

export const OrderByFilters = () => (
  <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
    <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
      <Text fontFamily="heading">Order by</Text>
      <StatFilter />
    </Flex>
    <OrderFilter />
    <PeriodFilter />
  </Flex>
);
