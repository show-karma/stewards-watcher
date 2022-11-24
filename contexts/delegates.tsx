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
  searchProfileModal: (
    userToSearch: string,
    tabToOpen?: IActiveTab
  ) => Promise<void>;
  interests: string[];
  interestFilter: string[];
  selectInterests: (index: number) => void;
}

export const DelegatesContext = createContext({} as IDelegateProps);

interface ProviderProps {
  children: React.ReactNode;
}

const statDefaultOptions: IStatOptions[] = [
  { title: 'Voting weight', stat: 'delegatedVotes' },
  { title: 'Forum Activity', stat: 'forumScore' },
  { title: 'Off-chain votes', stat: 'offChainVotesPct' },
  { title: 'On-chain votes', stat: 'onChainVotesPct' },
];

export const DelegatesProvider: React.FC<ProviderProps> = ({ children }) => {
  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  const [delegates, setDelegates] = useState<IDelegate[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasMore, setHasMore] = useState(false);
  const [statOptions, setStatOptions] = useState(statDefaultOptions);
  const [stat, setStat] = useState<IFilterStat>(statOptions[0].stat);
  const [order, setOrder] = useState<IFilterOrder>('desc');
  const [period, setPeriod] = useState<IFilterPeriod>('lifetime');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestFilter, setInterestFilter] = useState<string[]>([]);
  const [userToFind, setUserToFind] = useState('');
  const [voteInfos, setVoteInfos] = useState({} as IVoteInfo);
  const [selectedTab, setSelectedTab] = useState<IActiveTab>('statement');
  const [profileSelected, setProfileSelected] = useState<IDelegate | undefined>(
    {} as IDelegate
  );

  const {
    isOpen: isOpenProfile,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
  } = useDisclosure();

  const isSearchDirty = userToFind !== '';

  useMemo(() => {
    const filteredStats = statOptions.filter(
      option => !config.EXCLUDED_CARD_FIELDS.includes(option.stat)
    );
    setStatOptions(filteredStats);
  }, [config]);

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
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=10${
          userToFind && `name=${userToFind}`
        }&offset=${_offset}&order=${order}&field=${stat}&period=${period}`,
        {
          params: {
            interests: interestFilter.length
              ? interestFilter.join(',')
              : undefined,
          },
        }
      );
      const {
        delegates: fetchedDelegates,
        onChainId,
        snapshotIds,
      } = axiosClient.data.data;
      setVoteInfos({
        onChainId,
        snapshotIds,
      });
      setHasMore(fetchedDelegates.length === 10);
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
          votingWeight: item.stats?.[0]?.voteWeight || 0,
          delegatedVotes: item.delegatedVotes,
          twitterHandle: item.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
        };
      });

      setDelegates(delegatesList);
    } catch (error) {
      setDelegates([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const findDelegate = async () => {
    setLoading(true);
    setHasMore(false);
    setOffset(0);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/find-delegate?dao=${config.DAO_KARMA_ID}&user=${userToFind}`
      );
      const { delegate: fetchedDelegate } = axiosClient.data.data;

      if (!fetchedDelegate) {
        throw new Error('No delegates found');
      }
      const fetchedPeriod = (fetchedDelegate as IDelegateFromAPI).stats.find(
        fetchedStat => fetchedStat.period === period
      );
      setDelegates([
        {
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
          votingWeight: fetchedPeriod?.voteWeight || 0,
          delegatedVotes: fetchedDelegate.delegatedVotes,
          twitterHandle: fetchedDelegate.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt,
        },
      ]);
    } catch (error) {
      console.log(error);
      setDelegates([]);
      return;
    } finally {
      setLoading(false);
    }
  };

  const selectProfile = (profile: IDelegate, tab: IActiveTab = 'statement') => {
    setSelectedTab(tab);
    setProfileSelected(profile);
    onOpenProfile();
  };

  const searchProfileModal = async (
    userToSearch: string,
    tabToOpen?: IActiveTab
  ) => {
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/find-delegate?dao=${config.DAO_KARMA_ID}&user=${userToSearch}`
      );
      const { delegate: fetchedDelegate } = axiosClient.data.data;

      if (!fetchedDelegate) {
        throw new Error('No delegates found');
      }
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
        votingWeight: fetchedPeriod?.voteWeight || 0,
        delegatedVotes: fetchedDelegate.delegatedVotes,
        twitterHandle: fetchedDelegate.twitterHandle,
        updatedAt: fetchedPeriod?.updatedAt,
      };
      selectProfile(userFound, tabToOpen);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNextDelegates = async () => {
    if (isFetchingMore || !hasMore || isSearchDirty) return;
    const newOffset = offset + 1;
    setOffset(newOffset);
    setFetchingMore(true);
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=10&offset=${newOffset}&order=${order}&field=${stat}&period=${period}`,
        {
          params: {
            interests: interestFilter.length
              ? interestFilter.join(',')
              : undefined,
          },
        }
      );
      const { delegates: fetchedDelegates } = axiosClient.data.data;

      setHasMore(fetchedDelegates.length === 10);
      setLastUpdate(fetchedDelegates[0].stats[0].updatedAt);

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
          votingWeight: item.stats?.[0]?.voteWeight || 0,
          delegatedVotes: item.delegatedVotes,
          twitterHandle: item.twitterHandle,
          updatedAt: fetchedPeriod?.updatedAt || '-',
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingMore(false);
    }
  };

  useMemo(() => {
    if (userToFind) {
      findDelegate();
    } else {
      fetchDelegates();
    }
  }, [stat, order, period, userToFind]);

  useEffect(() => {
    fetchInterests();
  }, []);

  useEffect(() => {
    fetchDelegates();
  }, [interestFilter]);

  const getVoteInfos = async () => {
    try {
      const axiosClient = await axiosInstance.get(
        `/dao/delegates?name=${config.DAO_KARMA_ID}&pageSize=10${
          userToFind && `name=${userToFind}`
        }&offset=0&order=desc&field=score&period=lifetime`
      );
      const { onChainId, snapshotIds } = axiosClient.data.data;
      setVoteInfos({
        onChainId,
        snapshotIds,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
  const selectUserToFind = (selectedUser: string) =>
    setUserToFind(selectedUser);

  const selectInterests = (index: number) => {
    if (!interests[index]) return;

    const filterIdx = interestFilter.findIndex(
      filter => filter === interests[index]
    );

    const items = [...interestFilter];

    if (filterIdx >= 0) {
      items.splice(filterIdx, 1);
    } else {
      items.push(interests[index]);
    }

    setInterestFilter(items);
  };

  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  const clearFilters = () => {
    setStat(statOptions[0].stat);
    setOrder('desc');
    setPeriod('lifetime');
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
