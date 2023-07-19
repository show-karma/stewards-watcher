import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { DelegateStatusFilter } from './DelegateStatus';
import { InterestsFilter } from './Interests';
import { PeriodFilter } from './Period';
import { ToAFilter } from './ToA';
import { ToSFilter } from './ToS';
import { TracksFilter } from './Tracks';
import { ClearButton } from './ClearButton';
import { WorkstreamFilter } from './Workstream';

export const OrderByFilters = () => {
  const { interests, workstreams, tracks } = useDelegates();
  const { theme, daoInfo } = useDAO();

  return (
    <Flex align="end" flexDir={['row']} flexWrap="wrap">
      <Flex flexDir="column" w={{ base: 'full', md: 'max-content' }}>
        <Text fontFamily="heading" color={theme.filters.head} pb="5px">
          Filter by
        </Text>
        <Flex flexDir="row" gap="2" flexWrap="wrap">
          {interests.length > 0 && <InterestsFilter />}
          {workstreams.length > 0 &&
          daoInfo.config.DAO_CATEGORIES_TYPE === 'workstreams' ? (
            <WorkstreamFilter />
          ) : null}
          {tracks.length > 0 &&
          daoInfo.config.DAO_CATEGORIES_TYPE === 'tracks' ? (
            <TracksFilter />
          ) : null}
          <DelegateStatusFilter />
          <PeriodFilter />
          {/* {daoInfo.config.TOS_URL ? <ToSFilter /> : null} */}
          {daoInfo.config.DAO_SUPPORTS_TOA ? <ToAFilter /> : null}
          <ClearButton />
        </Flex>
      </Flex>
    </Flex>
  );
};
