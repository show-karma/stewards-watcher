import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { InterestsFilter } from './InterestsFilter';
import { OrderFilter } from './OrderFilter';
import { PeriodFilter } from './PeriodFilter';
import { StatFilter } from './StatFilter';

export const OrderByFilters = () => {
  const { interests } = useDelegates();
  const { theme } = useDAO();
  return (
    <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
      {interests.length > 0 && (
        <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
          <Text fontFamily="heading" color={theme.filters.head}>
            Filter by
          </Text>
          <InterestsFilter />
        </Flex>
      )}
      <Flex align="flex-end" justify="center" gap={{ base: '1', sm: '2' }}>
        <Flex
          flexDir={{ base: 'column' }}
          w={{ base: 'full', md: 'max-content' }}
        >
          <Text fontFamily="heading" color={theme.filters.head}>
            Order by
          </Text>
          <Flex
            flexDir="row"
            gap={{ base: '1', sm: '2' }}
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
          >
            <StatFilter />
            <Flex gap={{ base: '1', sm: '2' }} w="full">
              <OrderFilter />
              <PeriodFilter />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
