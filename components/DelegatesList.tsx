/* eslint-disable no-nested-ternary */
import { Flex, Spinner } from '@chakra-ui/react';
import { useDelegates } from 'contexts';
import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { DelegateCard } from './DelegateCard';

const loadingArray = Array(3).fill(undefined);

export const DelegatesList: FC = () => {
  const { delegates, isLoading, fetchNextDelegates, hasMore } = useDelegates();

  return (
    <Flex flexDir="column" align="center">
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchNextDelegates}
        hasMore={hasMore}
        loader={
          <Flex
            width="full"
            py="16"
            align="center"
            justify="center"
            key="loading-spinner"
          >
            <Spinner w="20" h="20" />
          </Flex>
        }
        style={{ width: '100%' }}
      >
        <Flex
          flexWrap="wrap"
          rowGap="10"
          columnGap="2"
          w={{ base: 'full', '2xl': '1360px' }}
          align="center"
          justify="flex-start"
          my="8"
          px={{ base: '6', lg: '0' }}
        >
          {isLoading
            ? delegates.length <= 0
              ? loadingArray.map((_, index) => <DelegateCard key={+index} />)
              : delegates.map((item, index) => (
                  <DelegateCard
                    key={`${item.address} + ${+index}`}
                    data={item}
                  />
                ))
            : delegates.length > 0
            ? delegates.map((item, index) => (
                <DelegateCard key={`${item.address} + ${+index}`} data={item} />
              ))
            : undefined}
        </Flex>
      </InfiniteScroll>
    </Flex>
  );
};
