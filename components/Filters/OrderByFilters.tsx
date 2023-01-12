import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { DelegateStatusFilter } from './DelegateStatusFilter';
import { InterestsFilter } from './InterestsFilter';
import { OrderFilter } from './OrderFilter';
import { PeriodFilter } from './PeriodFilter';
import { StatFilter } from './StatFilter';

export const OrderByFilters = () => {
  const { interests } = useDelegates();
  const { theme, daoInfo } = useDAO();
  const haveFilter =
    interests.length > 0 || daoInfo.config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER;
  return (
    <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
      {haveFilter && (
        <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
          <Text fontFamily="heading" color={theme.filters.head}>
            Filter by
          </Text>
          <Flex flexDir="row" gap="4">
            {interests.length > 0 && <InterestsFilter />}
            {daoInfo.config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER && (
              <DelegateStatusFilter />
            )}
          </Flex>
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
