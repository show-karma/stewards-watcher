/* eslint-disable no-nested-ternary */
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { THEME } from 'configs';
import { useStewards } from 'contexts';
import { FC } from 'react';
// import InfiniteScroll from 'react-infinite-scroller';
import { StewardCard } from './StewardCard';

const loadingArray = Array(3).fill(undefined);

export const StewardsList: FC = () => {
  const { stewards, isLoading, fetchNextStewards, hasMore } = useStewards();

  return (
    <Flex flexDir="column" align="center" px={{ base: '6' }}>
      <Flex
        flexWrap="wrap"
        gap="8"
        w="full"
        align="center"
        justify="flex-start"
        my="8"
      >
        {isLoading ? (
          loadingArray.map((_, index) => <StewardCard key={+index} />)
        ) : stewards.length > 0 ? (
          stewards.map((item, index) => (
            <StewardCard key={+index} data={item} />
          ))
        ) : (
          <Text align="center" textAlign="center">
            No results found.
          </Text>
        )}
      </Flex>
      {!isLoading && hasMore && (
        <Button
          w="max-content"
          my="8"
          fontSize="xl"
          px="8"
          py="6"
          bgColor={THEME.card}
          _hover={{}}
          _active={{}}
          onClick={() => fetchNextStewards()}
        >
          Load more
        </Button>
      )}
    </Flex>
  );
};
