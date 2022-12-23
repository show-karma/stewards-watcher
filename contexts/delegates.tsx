// eslint-disable-next-line import/no-extraneous-dependencies
import { DebouncedFunc } from 'lodash';
import { useDisclosure } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import {
  IDelegate,
  IFilterStat,
  IFilterOrder,
  IFilterPeriod,
  IDelegateFromAPI,
  IStatOptions,
  IVoteInfo,
  IActiveTab,
} from 'types';
import { axiosInstance } from 'utils';
import { useToasty } from 'hooks';
import { useDAO } from './dao';

interface IDelegateProps {
  delegates: IDelegate[];
  isLoading: boolean;
  userToFind: string;
  lastUpdate: Date;
  hasMore: boolean;
  fetchNextDelegates: () => Promise<void>;
  findDelegate: () => Promise<void>;
  fetchDelegates: (_offset?: number) => Promise<void>;
  handleSearch: DebouncedFunc<(text: any) => void>;
  isSearchDirty: boolean;
  selectStat: (_selectedStat: IFilterStat) => void;
  selectOrder: (selectedOrder: IFilterOrder) => void;
  selectPeriod: (selectedPeriod: IFilterPeriod) => void;
  selectUserToFind: (selectedUserToFind: string) => void;
  statOptions: IStatOptions[];
  stat: IFilterStat;
  order: IFilterOrder;
  period: IFilterPeriod;
  clearFilters: () => void;
  voteInfos: IVoteInfo;
  isOpenProfile: boolean;
  onCloseProfile: () => void;
  profileSelected?: IDelegate;
  selectProfile: (profile: IDelegate, tab?: IActiveTab) => void;
  selectedTab: IActiveTab;
  searchProfileModal: (userToSearch: string) => Promise<void>;
  interests: string[];
  interestFilter: string[];
  selectInterests: (index: number) => void;
  delegateCount: number;
}

export const DelegatesContext = createContext({} as IDelegateProps);

interface ProviderProps {
  children: React.ReactNode;
}

const statDefaultOptions: IStatOptions[] = [
  { title: 'Voting weight', stat: 'delegatedVotes' },
  { title: 'Forum score', stat: 'forumScore' },
  { title: 'Off-chain votes', stat: 'offChainVotesPct' },
  { title: 'On-chain votes', stat: 'onChainVotesPct' },
  { title: 'Health', stat: 'healthScore' },
];

export const DelegatesProvider: React.FC<ProviderProps> = ({ children }) => {
  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  const defaultTimePeriod =
    config.DAO_DEFAULT_SETTINGS?.TIMEPERIOD || 'lifetime';
  const [delegates, setDelegates] = useState<IDelegate[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasMore, setHasMore] = useState(false);

  const prepareStatOptions = () => {
    const sortedDefaultOptions = statDefaultOptions.sort(element =>
      element.stat === config.DAO_DEFAULT_SETTINGS?.ORDERSTAT ? -1 : 1
    );
    const filteredStats = sortedDefaultOptions.filter(
      option => !config.EXCLUDED_CARD_FIELDS.includes(option.stat)
    );
    return filteredStats;
  };
  const statOptions = prepareStatOptions();

  const [stat, setStat] = useState<IFilterStat>(statOptions[0].stat);
  const [order, setOrder] = useState<IFilterOrder>('desc');
  const [period, setPeriod] = useState<IFilterPeriod>(defaultTimePeriod);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestFilter, setInterestFilter] = useState<string[]>([]);
  const [userToFind, setUserToFind] = useState<string>('');
  const [voteInfos, setVoteInfos] = useState({} as IVoteInfo);
  const [selectedTab, setSelectedTab] = useState<IActiveTab>('statement');
  const [profileSelected, setProfileSelected] = useState<IDelegate | undefined>(
    {} as IDelegate
  );
  const [delegateCount, setDelegateCount] = useState(0);
  const { toast } = useToasty();

  const router = useRouter();
  const { asPath } = router;

  const {
    isOpen: isOpenProfile,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
  } = useDisclosure();

  const isSearchDirty = userToFind !== '';

  const fetchInterests = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/dao/interests/${config.DAO_KARMA_ID}`
      );
      if (Array.isArray(data?.data?.interests)) {
        setInterests(data.data.interests);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDelegates = async (_offset = offset) => {
    setLoading(true);
    try {
      const axiosClient = await axiosInstance.get(`/dao/delegates`, {
        params: {
          interests: interestFilter.length
            ? interestFilter.join(',')
            : undefined,
          name: config.DAO_KARMA_ID,
          offset: _offset,
          order,
          field: stat,
          period,
          pageSize: 10,
          workstreamId:
            config.DAO_KARMA_ID === 'gitcoin' ? '6,4,3,7,1,2,5' : undefined,
        },
      });

      const { data } = axiosClient.data;
      const {
        delegates: fetchedDelegates,
        onChainId,
        snapshotIds,
        count,
      } = data;

      setVoteInfos({
        onChainId,
        snapshotIds,
      });
      setLastUpdate(fetchedDelegates[0].stats[0].updatedAt);

      const delegatesList = fetchedDelegates.map((item: IDelegateFromAPI) => {
        const fetchedPeriod = item.stats.find(
          fetchedStat => fetchedStat.period === period
        );

        return {
          address: item.publicAddress,
          ensName: item.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          delegateSince: item.joinDateAt || item.firstTokenDelegatedAt,
          delegators: item.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          gitcoinHealthScore: fetchedPeriod?.gitcoinHealthScore || 0,
          votingWeight: item.voteWeight,
          delegatedVotes: item.delegatedVotes || item.snapshotDelegatedVotes,
          twitterHandle: item.twitterHandle,
          discourseHandle: item.discourseHandle,
          updatedAt: fetchedPeriod?.updatedAt,
          karmaScore: fetchedPeriod?.karmaScore || 0,
          aboutMe: item.aboutMe,
          realName: item.realName,
          profilePicture: item.profilePicture,
          workstreams: item.workstreams,
        };
      });

      setDelegates(delegatesList);
      setDelegateCount(count || 0);
    } catch (error) {
      setDelegates([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMore(delegates.length < delegateCount);
  }, [delegates.length, delegateCount]);

  const findDelegate = async () => {
    if (isFetchingMore) return;
    setFetchingMore(true);
    setLoading(true);
    try {
      const axiosClient = await axiosInstance.get(`/dao/search-delegate`, {
        params: {
          user: userToFind,
          pageSize: 10,
          offset,
          period,
          order,
          dao: config.DAO_KARMA_ID,
        },
      });
      const { data } = axiosClient.data;

      const { delegates: fetchedDelegates, count } = data;

      if (!fetchedDelegates) {
        throw new Error('No delegates found');
      }
      const delegatesList = fetchedDelegates.map((item: IDelegateFromAPI) => {
        const fetchedPeriod = item.stats.find(
          fetchedStat => fetchedStat.period === period
        );

        return {
          address: item.publicAddress,
          ensName: item.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          delegateSince: item.joinDateAt || item.firstTokenDelegatedAt,
          delegators: item.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          discourseHandle: item.discourseHandle,
          votingWeight: item.voteWeight,
          delegatedVotes: item.delegatedVotes || item.snapshotDelegatedVotes,
          gitcoinHealthScore: fetchedPeriod?.gitcoinHealthScore || 0,
          twitterHandle: item.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
          karmaScore: fetchedPeriod?.karmaScore || 0,
          aboutMe: item.aboutMe,
          realName: item.realName,
          profilePicture: item.profilePicture,
          workstreams: item.workstreams,
        };
      });
      setDelegates(delegatesList);

      setDelegateCount(count || 0);
    } catch (error) {
      console.log(error);
      setDelegates([]);
      return;
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const selectProfile = (profile: IDelegate, tab: IActiveTab = 'statement') => {
    setSelectedTab(tab);
    setProfileSelected(profile);
    onOpenProfile();
  };

  const searchProfileModal = async (userToSearch: string) => {
    try {
      const axiosClient = await axiosInstance.get(`/dao/find-delegate`, {
        params: {
          dao: config.DAO_KARMA_ID,
          user: userToSearch,
        },
      });
      const { data } = axiosClient.data;
      const { delegate: fetchedDelegate } = data;

      const fetchedPeriod = (fetchedDelegate as IDelegateFromAPI).stats.find(
        fetchedStat => fetchedStat.period === period
      );
      const userFound: IDelegate = {
        address: fetchedDelegate.publicAddress,
        ensName: fetchedDelegate.ensName,
        forumActivity: fetchedPeriod?.forumActivityScore || 0,
        delegateSince:
          fetchedDelegate.joinDateAt || fetchedDelegate.firstTokenDelegatedAt,
        delegators: fetchedDelegate.delegatorCount,
        voteParticipation: {
          onChain: fetchedPeriod?.onChainVotesPct || 0,
          offChain: fetchedPeriod?.offChainVotesPct || 0,
        },
        votingWeight: fetchedDelegate.voteWeight,
        delegatedVotes:
          fetchedDelegate.delegatedVotes ||
          fetchedDelegate.snapshotDelegatedVotes,
        gitcoinHealthScore: fetchedPeriod?.gitcoinHealthScore || 0,
        twitterHandle: fetchedDelegate.twitterHandle,
        discourseHandle: fetchedDelegate.discourseHandle,
        updatedAt: fetchedPeriod?.updatedAt,
        karmaScore: fetchedPeriod?.karmaScore || 0,
        aboutMe: fetchedDelegate.aboutMe,
        realName: fetchedDelegate.realName,
        profilePicture: fetchedDelegate.profilePicture,
        workstreams: fetchedDelegate.workstreams,
      };
      const getTab = asPath.split('#');
      const tabs = ['votinghistory', 'statement'];
      if (userFound.aboutMe) tabs.push('aboutme');
      const checkTab = tabs.includes(getTab[1]);
      selectProfile(
        userFound,
        checkTab ? (getTab[1] as IActiveTab) : undefined
      );
    } catch (error) {
      toast({
        title: `We couldn't find the contributor page`,
      });
    }
  };

  const fetchNextDelegates = async () => {
    if (isSearchDirty) {
      findDelegate();
      return;
    }

    if (isFetchingMore || !hasMore) return;
    const newOffset = offset + 1;

    if (delegates.length) {
      setOffset(newOffset);
    }

    setLoading(true);
    setFetchingMore(true);
    try {
      const axiosClient = await axiosInstance.get(`/dao/delegates`, {
        params: {
          interests: interestFilter.length
            ? interestFilter.join(',')
            : undefined,
          name: config.DAO_KARMA_ID,
          pageSize: 10,
          offset: newOffset,
          order,
          field: stat,
          period,
        },
      });
      const { data } = axiosClient.data;
      const { delegates: fetchedDelegates } = data;

      if (fetchedDelegates.length) {
        setLastUpdate(fetchedDelegates[0].stats[0].updatedAt);
      }

      fetchedDelegates.forEach((item: IDelegateFromAPI) => {
        const fetchedPeriod = item.stats.find(
          fetchedStat => fetchedStat.period === period
        );

        delegates.push({
          address: item.publicAddress,
          ensName: item.ensName,
          forumActivity: fetchedPeriod?.forumActivityScore || 0,
          delegateSince: item.joinDateAt || item.firstTokenDelegatedAt,
          delegators: item.delegatorCount,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          votingWeight: item?.voteWeight,
          delegatedVotes: item.delegatedVotes || item.snapshotDelegatedVotes,
          twitterHandle: item.twitterHandle,
          discourseHandle: item.discourseHandle,
          updatedAt: fetchedPeriod?.updatedAt || '-',
          karmaScore: fetchedPeriod?.karmaScore || 0,
          aboutMe: item.aboutMe,
          realName: item.realName,
          profilePicture: item.profilePicture,
          workstreams: item.workstreams,
        });
      });
    } catch (error) {
      setDelegates([]);
      console.log(error);
    } finally {
      setFetchingMore(false);
      setLoading(false);
    }
  };

  useMemo(() => {
    setOffset(0);
    if (userToFind) {
      findDelegate();
    } else {
      fetchDelegates(0);
    }
  }, [stat, order, period, userToFind]);

  useEffect(() => {
    fetchInterests();
  }, []);

  // Fetch delegates when interest filter change
  useEffect(() => {
    fetchDelegates(0);
  }, [interestFilter]);

  // Fetch vote infos
  const getVoteInfos = async () => {
    try {
      const axiosClient = await axiosInstance.get(`/dao/delegates`, {
        params: {
          name: config.DAO_KARMA_ID,
          pageSize: 10,
          offset: 0,
          order: 'desc',
          field: 'score',
          period: 'lifetime',
        },
      });
      const { onChainId, snapshotIds } = axiosClient.data.data;
      setVoteInfos({
        onChainId,
        snapshotIds,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch vote infos if there are delegates
  useMemo(() => {
    if (
      delegates.length &&
      !voteInfos?.onChainId &&
      !voteInfos?.snapshotIds?.length
    ) {
      getVoteInfos();
    }
  }, [delegates]);

  const selectStat = (_selectedStat: IFilterStat) => setStat(_selectedStat);
  const selectOrder = (selectedOrder: IFilterOrder) => setOrder(selectedOrder);
  const selectPeriod = (selectedPeriod: IFilterPeriod) =>
    setPeriod(selectedPeriod);

  const selectUserToFind = (selectedUser: string) => {
    setOffset(0);
    setUserToFind(selectedUser);
  };

  const selectInterests = (index: number) => {
    if (!interests[index]) return;

    // search for the interest in the interestFilter array
    const filterIdx = interestFilter.findIndex(
      filter => filter === interests[index]
    );

    // clone the interestFilter array
    const items = [...interestFilter];

    // if the interest is already in the interestFilter array, remove it
    if (filterIdx >= 0) {
      items.splice(filterIdx, 1);
    } else {
      items.push(interests[index]);
    }

    // set the new interestFilter array
    setInterestFilter(items);
  };

  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  /**
   * @description This function is used to clear all filters
   */
  const clearFilters = () => {
    setStat(statOptions[0].stat);
    setOrder('desc');
    setPeriod(defaultTimePeriod);
    setUserToFind('');
  };

  const providerValue = useMemo(
    () => ({
      delegates,
      isLoading,
      lastUpdate,
      hasMore,
      fetchNextDelegates,
      findDelegate,
      fetchDelegates,
      handleSearch,
      isSearchDirty,
      statOptions,
      stat,
      order,
      period,
      selectStat,
      selectOrder,
      selectPeriod,
      selectUserToFind,
      userToFind,
      clearFilters,
      voteInfos,
      isOpenProfile,
      onCloseProfile,
      profileSelected,
      selectProfile,
      selectedTab,
      searchProfileModal,
      interests,
      interestFilter,
      selectInterests,
      delegateCount,
    }),
    [
      profileSelected,
      isOpenProfile,
      delegates,
      isLoading,
      lastUpdate,
      hasMore,
      isFetchingMore,
      offset,
      isSearchDirty,
      statOptions,
      stat,
      order,
      period,
      userToFind,
      voteInfos,
      selectedTab,
      interests,
    ]
  );

  return (
    <DelegatesContext.Provider value={providerValue}>
      {children}
    </DelegatesContext.Provider>
  );
};

export const useDelegates = () => useContext(DelegatesContext);
