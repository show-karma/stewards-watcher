import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { OrderFilter } from './OrderFilter';
import { PeriodFilter } from './PeriodFilter';
import { StatFilter } from './StatFilter';

export const OrderByFilters = () => {
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;
  return (
    <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
      <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
        <Text fontFamily="heading" color={theme.title}>
          Order by
        </Text>
        <StatFilter />
      </Flex>
      <OrderFilter />
      <PeriodFilter />
    </Flex>
  );
};
