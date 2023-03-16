import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { DelegateStatusFilter } from './DelegateStatusFilter';
import { InterestsFilter } from './InterestsFilter';
import { PeriodFilter } from './PeriodFilter';
import { WorkstreamFilter } from './WorkstreamFilter';

export const OrderByFilters = () => {
  const { interests, workstreams } = useDelegates();
  const { theme, daoInfo } = useDAO();

  return (
    <Flex align="end" flexDir={['row']} flexWrap="wrap">
      <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
        <Text fontFamily="heading" color={theme.filters.head} pb="5px">
          Filter by
        </Text>
        <Flex flexDir="row" gap="4" flexWrap="wrap">
          {interests.length > 0 && <InterestsFilter />}
          {workstreams.length > 0 && <WorkstreamFilter />}
          <DelegateStatusFilter />
          <PeriodFilter />
        </Flex>
      </Flex>
    </Flex>
  );
};
