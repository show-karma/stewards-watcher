/* eslint-disable no-nested-ternary */
import { Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { FC, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { IDelegate } from 'types';
import { DelegateCard } from './DelegateCard';

const loadingArray = Array(3).fill(undefined);

interface IDelegatesList {
  pathUser?: string;
}

const EmptyStates = () => {
  const { theme } = useDAO();
  const { isSearchDirty, isFiltering } = useDelegates();

  const isSearchingOrFiltering = isSearchDirty || isFiltering;

  return (
    <Text as="p" color={theme.title} w="full" align="center">
      {isSearchingOrFiltering
        ? `We couldn't find any contributors matching that criteria`
        : `We couldn't find any contributor info`}
    </Text>
  );
};

interface IDelegatesCasesProps {
  delegates: IDelegate[];
  isLoading: boolean;
}

const DelegatesCases: FC<IDelegatesCasesProps> = ({ delegates, isLoading }) => {
  if (isLoading) {
    if (delegates.length <= 0) {
      return (
        <>
          {loadingArray.map((_, index) => (
            <DelegateCard key={+index} />
          ))}
        </>
      );
    }
    return (
      <>
        {delegates.map(item => (
          <DelegateCard key={`${JSON.stringify(item)}`} data={item} />
        ))}
      </>
    );
  }
  return (
    <>
      {delegates.map(item => (
        <DelegateCard key={`${JSON.stringify(item)}`} data={item} />
      ))}
    </>
  );
};

export const DelegatesList: FC<IDelegatesList> = ({ pathUser }) => {
  const {
    isLoading,
    fetchNextDelegates,
    hasMore,
    searchProfileModal,
    interestFilter,
    delegates,
  } = useDelegates();

  const searchProfileSelected = async (userToSearch: string) => {
    await searchProfileModal(userToSearch);
  };

  useMemo(() => {
    if (pathUser) searchProfileSelected(pathUser);
  }, [pathUser]);

  return (
    <Flex flexDir="column" align="center" w="full" maxW="1360px">
      {!!interestFilter.length && (
        <Flex textAlign="start" w={{ base: 'full' }} fontSize={12} mb={4}>
          <Text as="span">
            <Text as="b">Delegate Interests: </Text>
            {interestFilter.join(', ')}
          </Text>
        </Flex>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          if (delegates.length && !isLoading && delegates.length >= 10)
            fetchNextDelegates();
        }}
        hasMore={hasMore}
        loader={
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <div key="spinner">
            {isLoading && delegates.length > 0 && (
              <Flex
                width="full"
                py="16"
                align="center"
                justify="center"
                key="loading-spinner"
              >
                <Spinner w="20" h="20" />
              </Flex>
            )}
          </div>
        }
        style={{ width: '100%' }}
      >
        <Grid
          flexWrap="wrap"
          rowGap={{ base: '2', md: '10' }}
          columnGap={{ base: '6', md: '6' }}
          w="full"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          alignItems="center"
          justifyItems="center"
          mb="8"
          px={{ base: '4', lg: '0' }}
        >
          <DelegatesCases delegates={delegates} isLoading={isLoading} />
        </Grid>
      </InfiniteScroll>
      {!isLoading && !delegates.length && <EmptyStates />}
    </Flex>
  );
};
