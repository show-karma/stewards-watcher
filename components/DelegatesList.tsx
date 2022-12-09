/* eslint-disable no-nested-ternary */
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { IActiveTab } from 'types';
import { DelegateCard } from './DelegateCard';
import { UserProfile } from './Modals';

const loadingArray = Array(3).fill(undefined);

interface IDelegatesList {
  pathUser?: string;
}

export const DelegatesList: FC<IDelegatesList> = ({ pathUser }) => {
  const {
    delegates,
    isLoading,
    fetchNextDelegates,
    hasMore,
    isOpenProfile,
    onCloseProfile,
    profileSelected,
    selectedTab,
    searchProfileModal,
    interestFilter,
  } = useDelegates();
  const { daoInfo } = useDAO();
  const { config } = daoInfo;
  const router = useRouter();
  const { asPath } = router;

  const searchProfileSelected = async (userToSearch: string) => {
    const getTab = asPath && (asPath as string).split('#');
    const tabs = ['votinghistory', 'statement', 'aboutMe'];
    const checkTab = tabs.includes(getTab[1]);
    await searchProfileModal(
      userToSearch,
      checkTab ? (getTab[1] as IActiveTab) : undefined
    );
  };

  useMemo(() => {
    if (pathUser) searchProfileSelected(pathUser);
  }, [pathUser]);

  return (
    <>
      {profileSelected && (
        <UserProfile
          isOpen={isOpenProfile}
          onClose={onCloseProfile}
          profile={{
            address: profileSelected.address,
            avatar:
              profileSelected.profilePicture ||
              `${config.IMAGE_PREFIX_URL}${profileSelected.address}`,
            ensName: profileSelected.ensName,
            twitter: profileSelected.twitterHandle,
            aboutMe: profileSelected.aboutMe,
            realName: profileSelected.realName,
          }}
          selectedTab={selectedTab}
        />
      )}
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
            columnGap="8"
            w="full"
            align="center"
            justify="flex-start"
            mb="8"
            px={{ base: '6', lg: '0' }}
          >
            {isLoading
              ? delegates.length <= 0
                ? loadingArray.map((_, index) => <DelegateCard key={+index} />)
                : delegates.map(item => (
                    <DelegateCard key={`${JSON.stringify(item)}`} data={item} />
                  ))
              : delegates.length > 0
              ? delegates.map(item => (
                  <DelegateCard key={`${JSON.stringify(item)}`} data={item} />
                ))
              : undefined}
          </Flex>
        </InfiniteScroll>
      </Flex>
    </>
  );
};
