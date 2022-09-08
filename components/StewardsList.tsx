/* eslint-disable no-nested-ternary */
import { Flex, Spinner } from '@chakra-ui/react';
import { useStewards } from 'contexts';
import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { StewardCard } from './StewardCard';

const loadingArray = Array(3).fill(undefined);

export const StewardsList: FC = () => {
  const { stewards, isLoading, fetchNextStewards, hasMore } = useStewards();

  return (
    <Flex flexDir="column" align="center" px={{ base: '6' }}>
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchNextStewards}
        hasMore={hasMore}
        loader={
          <Flex width="full" py="16" align="center" justify="center">
            <Spinner w="20" h="20" />
          </Flex>
        }
        style={{ width: '100%' }}
      >
        <Flex
          flexWrap="wrap"
          gap="8"
          w="full"
          align="center"
          justify="flex-start"
          my="8"
        >
          {isLoading
            ? stewards.length <= 0
              ? loadingArray.map((_, index) => <StewardCard key={+index} />)
              : stewards.map((item, index) => (
                  <StewardCard key={+index} data={item} />
                ))
            : stewards.length > 0
            ? stewards.map((item, index) => (
                <StewardCard key={+index} data={item} />
              ))
            : undefined}
        </Flex>
      </InfiniteScroll>
    </Flex>
  );
};
