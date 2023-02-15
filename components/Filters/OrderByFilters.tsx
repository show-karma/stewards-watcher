import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { DelegateStatusFilter } from './DelegateStatusFilter';
import { InterestsFilter } from './InterestsFilter';
import { PeriodFilter } from './PeriodFilter';
import { RangePickerFilter } from './RangePickerFilter';
import { WorkstreamFilter } from './WorkstreamFilter';

export const OrderByFilters = () => {
  const { interests, workstreams, period } = useDelegates();
  const { theme, daoInfo } = useDAO();

  return (
    <Flex gap="4" align="end" flexDir={['row']} flexWrap="wrap">
      <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
        <Text fontFamily="heading" color={theme.filters.head}>
          Filter by
        </Text>
        <Flex flexDir="row" gap="4" flexWrap="wrap">
          {interests.length > 0 && <InterestsFilter />}
          {workstreams.length > 0 && <WorkstreamFilter />}
          {daoInfo.config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER?.SHOW && (
            <DelegateStatusFilter />
          )}
          <PeriodFilter />
          {period === 'custom' && <RangePickerFilter />}
        </Flex>
      </Flex>
    </Flex>
  );
};
