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
  IFilterOrder,
  IFilterPeriod,
  IDelegateFromAPI,
  IStatOptions,
  IVoteInfo,
  IActiveTab,
  IStatusOptions,
  IWorkstream,
  IStatsID,
} from 'types';
import { useMixpanel, useToasty } from 'hooks';
import { api } from 'helpers';
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
  selectStat: (_selectedStat: IStatsID) => void;
  selectOrder: (selectedOrder: IFilterOrder) => void;
  selectPeriod: (selectedPeriod: IFilterPeriod) => void;
  selectUserToFind: (selectedUserToFind: string) => void;
  statOptions: IStatOptions[];
  stat: IStatsID;
  order: IFilterOrder;
  period: IFilterPeriod;
  clearFilters: () => void;
  voteInfos: IVoteInfo;
  isOpenProfile: boolean;
  onCloseProfile: () => void;
  profileSelected?: IDelegate;
  selectProfile: (profile: IDelegate, tab?: IActiveTab) => void;
  selectedTab: IActiveTab;
  searchProfileModal: (
    userToSearch: string,
    defaultTab?: IActiveTab | undefined
  ) => Promise<void>;
  interests: string[];
  interestFilter: string[];
  selectInterests: (index: number) => void;
  delegateCount: number;
  selectStatus: (selectedStatus: number) => void;
  statuses: IStatusOptions[];
  isFiltering: boolean;
  workstreams: IWorkstream[];
  workstreamsFilter: string[];
  statusesOptions: IStatusOptions[];
  selectWorkstream: (index: number) => void;
  setSelectedProfileData: (selected: IDelegate) => void;
}

export const DelegatesContext = createContext({} as IDelegateProps);

interface ProviderProps {
  children: React.ReactNode;
}

const statDefaultOptions: IStatOptions[] = [
  { title: 'Voting weight', id: 'delegatedVotes', stat: 'delegatedVotes' },
  { title: 'Forum score', id: 'forumScore', stat: 'forumScore' },
  { title: 'Snapshot votes', id: 'offChainVotesPct', stat: 'offChainVotesPct' },
  { title: 'On-chain votes', id: 'onChainVotesPct', stat: 'onChainVotesPct' },
  { title: 'Score', id: 'score', stat: 'karmaScore' },
  { title: 'Health', id: 'healthScore', stat: 'healthScore' },
];

const defaultStatuses: IStatusOptions[] = [
  'active',
  'inactive',
  'withdrawn',
  'recognized',
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

  const [statuses, setStatuses] = useState<IStatusOptions[]>(
    config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER?.DEFAULT_STATUSES ||
      defaultStatuses
  );

  const [statusesOptions] = useState<IStatusOptions[]>(defaultStatuses);

  const statOptions = prepareStatOptions();

  const [stat, setStat] = useState<IStatsID>(statOptions[0].id);
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
  const [workstreams, setWorkstreams] = useState<IWorkstream[]>([]);
  const [workstreamsFilter, setWorkstreamsFilter] = useState<string[]>([]);

  const { mixpanel } = useMixpanel();
  const { toast } = useToasty();
  const router = useRouter();
  const { asPath } = router;

  const {
    isOpen: isOpenProfile,
    onOpen: onOpenProfile,
    onClose: closeModalProfile,
  } = useDisclosure();

  const isSearchDirty = userToFind !== '';
  const isFiltering =
    interests.length > 0 ||
    (config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER?.SHOW
      ? Boolean(statuses)
      : false);

  const fetchInterests = async () => {
    try {
      const { data } = await api.get(`/dao/interests/${config.DAO_KARMA_ID}`);
      if (Array.isArray(data?.data?.interests)) {
        const orderedInterests = data.data.interests.sort(
          (interestA: string, interestB: string) =>
            interestA.toLowerCase() > interestB.toLowerCase() ? 1 : -1
        );
        setInterests(orderedInterests);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkstreams = async () => {
    try {
      const { data } = await api.get(
        `/workstream/list?dao=${config.DAO_KARMA_ID}`
      );
      if (Array.isArray(data.data.workstreams)) {
        setWorkstreams(data.data.workstreams);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setSelectedProfileData = (selected: IDelegate) => {
    setProfileSelected(selected);
  };

  const getWorkstreams = () => {
    if (workstreamsFilter.length === 0 && config.DAO_KARMA_ID === 'gitcoin')
      return '6,4,3,7,1,2,5,12';
    if (workstreamsFilter.length) return workstreamsFilter.join(',');
    return undefined;
  };

  const fetchDelegates = async (_offset = offset) => {
    setLoading(true);
    try {
      const axiosClient = await api.get(`/dao/delegates`, {
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
          workstreamId: getWorkstreams(),
          statuses: statuses.length
            ? statuses.join(',')
            : config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER?.DEFAULT_STATUSES?.join(
                ','
              ) || defaultStatuses.join(','),
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
          delegators: item.delegatorCount || 0,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          delegatePitch: item.delegatePitch,
          gitcoinHealthScore: fetchedPeriod?.gitcoinHealthScore || 0,
          votingWeight: item.voteWeight,
          delegatedVotes: item.delegatedVotes || item.snapshotDelegatedVotes,
          twitterHandle: item.twitterHandle,
          discourseHandle: item.discourseHandle,
          updatedAt: fetchedPeriod?.updatedAt,
          karmaScore: fetchedPeriod?.karmaScore || 0,
          aboutMe: item.aboutMe,
          realName: item.realName,
          status: item.status,
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
      const axiosClient = await api.get(`/dao/search-delegate`, {
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
          delegators: item.delegatorCount || 0,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          discourseHandle: item.discourseHandle,
          votingWeight: item.voteWeight,
          delegatePitch: item.delegatePitch,
          delegatedVotes: item.delegatedVotes || item.snapshotDelegatedVotes,
          gitcoinHealthScore: fetchedPeriod?.gitcoinHealthScore || 0,
          twitterHandle: item.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
          karmaScore: fetchedPeriod?.karmaScore || 0,
          aboutMe: item.aboutMe,
          realName: item.realName,
          profilePicture: item.profilePicture,
          workstreams: item.workstreams,
          status: item.status,
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
    mixpanel.reportEvent({
      event: 'viewActivity',
      properties: {
        tab,
      },
    });
    setSelectedTab(tab);
    setProfileSelected(profile);
    onOpenProfile();
    router
      .push(
        {
          pathname: `/profile/${profile.ensName || profile.address}`,
          hash: tab,
        },
        undefined,
        { shallow: true }
      )
      .catch(error => {
        if (!error.cancelled) {
          throw error;
        }
      });
  };

  const searchProfileModal = async (
    userToSearch: string,
    defaultTab?: IActiveTab
  ) => {
    try {
      const axiosClient = await api.get(`/dao/find-delegate`, {
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
        delegators: fetchedDelegate.delegatorCount || 0,
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
        delegatePitch: fetchedDelegate.delegatePitch,
        aboutMe: fetchedDelegate.aboutMe,
        realName: fetchedDelegate.realName,
        profilePicture: fetchedDelegate.profilePicture,
        workstreams: fetchedDelegate.workstreams,
        status: fetchedDelegate.status,
      };

      const getTab = asPath.split('#');
      const tabs: IActiveTab[] = [
        'votinghistory',
        'statement',
        'handles',
        'withdraw',
      ];
      if (userFound.aboutMe) tabs.push('aboutme');
      const checkTab = tabs.includes(getTab[1] as IActiveTab);
      const shouldOpenTab = defaultTab || (getTab[1] as IActiveTab);
      selectProfile(userFound, checkTab ? shouldOpenTab : undefined);
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
      const axiosClient = await api.get(`/dao/delegates`, {
        params: {
          interests: interestFilter.length
            ? interestFilter.join(',')
            : undefined,
          name: config.DAO_KARMA_ID,
          offset: newOffset,
          order,
          field: stat,
          period,
          pageSize: 10,
          workstreamId: getWorkstreams(),
          statuses: statuses.length
            ? statuses.join(',')
            : config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER?.DEFAULT_STATUSES?.join(
                ','
              ) || defaultStatuses.join(','),
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
          delegators: item.delegatorCount || 0,
          voteParticipation: {
            onChain: fetchedPeriod?.onChainVotesPct || 0,
            offChain: fetchedPeriod?.offChainVotesPct || 0,
          },
          votingWeight: item?.voteWeight,
          delegatedVotes: item.delegatedVotes || item.snapshotDelegatedVotes,
          twitterHandle: item.twitterHandle,
          discourseHandle: item.discourseHandle,
          delegatePitch: item.delegatePitch,
          updatedAt: fetchedPeriod?.updatedAt || '-',
          karmaScore: fetchedPeriod?.karmaScore || 0,
          aboutMe: item.aboutMe,
          realName: item.realName,
          profilePicture: item.profilePicture,
          workstreams: item.workstreams,
          gitcoinHealthScore: fetchedPeriod?.gitcoinHealthScore || 0,
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
  }, [
    stat,
    order,
    period,
    userToFind,
    statuses,
    interestFilter,
    workstreamsFilter,
  ]);

  useEffect(() => {
    fetchInterests();
    fetchWorkstreams();
  }, []);

  // Fetch vote infos
  const getVoteInfos = async () => {
    try {
      const axiosClient = await api.get(`/dao/delegates`, {
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

  const selectStat = (_selectedStat: IStatsID) => setStat(_selectedStat);
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

  const selectWorkstream = (index: number) => {
    if (!workstreams[index]) return;

    // search for the index in the workstreamsFilter array
    const filterIdx = workstreamsFilter.findIndex(
      filter => filter === workstreams[index].id.toString()
    );

    // clone the workstreamsFilter array
    const items = [...workstreamsFilter];

    // if the workstreams is already in the workstreamsFilter array, remove it
    if (filterIdx >= 0) {
      items.splice(filterIdx, 1);
    } else {
      items.push(workstreams[index].id.toString());
    }

    // set the new workstreamsFilter array
    setWorkstreamsFilter(items);
  };

  const selectStatus = (index: number) => {
    if (!statusesOptions[index]) return;

    // search for the index in the statuses array
    const filterIdx = statuses.findIndex(
      filter => filter === statusesOptions[index]
    );

    // clone the statuses array
    const items = [...statuses];

    // if the status is already in the statusesOptions array, remove it
    if (filterIdx >= 0) {
      items.splice(filterIdx, 1);
    } else {
      items.push(statusesOptions[index]);
    }

    // set the new statuses array
    setStatuses(items);
  };

  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  /**
   * @description This function is used to clear all filters
   */
  const clearFilters = () => {
    setStat(statOptions[0].id);
    setOrder('desc');
    setPeriod(defaultTimePeriod);
    setUserToFind('');
  };

  const onCloseProfile = () => {
    closeModalProfile();
    setProfileSelected(undefined);
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
      selectStatus,
      statuses,
      isFiltering,
      workstreams,
      selectWorkstream,
      workstreamsFilter,
      statusesOptions,
      setSelectedProfileData,
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
      statuses,
      isFiltering,
      workstreams,
      workstreamsFilter,
      statusesOptions,
      setSelectedProfileData,
    ]
  );

  return (
    <DelegatesContext.Provider value={providerValue}>
      {children}
    </DelegatesContext.Provider>
  );
};

export const useDelegates = () => useContext(DelegatesContext);
