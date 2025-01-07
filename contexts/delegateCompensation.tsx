import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { DelegateStatsFromAPI } from 'types';
import { getDelegateInfo } from 'utils/delegate-compensation/getDelegateInfo';
import { useQuery } from 'wagmi';
import { useDAO } from './dao';

interface DelegateCompensationContextType {
  selectedDate: { name: string; value: { month: number; year: number } } | null;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<{
      name: string;
      value: {
        month: number;
        year: number;
      };
    }>
  >;
  delegateAddress: string | undefined;
  changeDelegateAddress: (delegateAddress: string) => void;
  delegateInfo: DelegateStatsFromAPI | undefined;
  isFetchingDelegateInfo: boolean;
  isLoadingDelegateInfo: boolean;
  refreshDelegateInfo: () => void;
}

const DelegateCompensationContext = createContext(
  {} as DelegateCompensationContextType
);

interface ProviderProps {
  children: React.ReactNode;
}
export const COMPENSATION_DATES = {
  OLD_VERSION_MIN: new Date('2024-02-11'),
  OLD_VERSION_MAX: new Date('2024-10-10'),
  NEW_VERSION_MIN: new Date('2024-10-11'),
  NEW_VERSION_MAX: new Date('2024-12-10'),
};

export const DelegateCompensationProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { daoInfo, rootPathname } = useDAO();

  const [selectedDate, setSelectedDate] = useState(() => {
    const DATES = COMPENSATION_DATES;
    const queryString = router.asPath.split('?')[1];
    const monthQuery = queryString?.match(/(?<=month=)[^&]*/i)?.[0];
    const yearQuery = Number(queryString?.match(/(?<=year=)[^&]*/i)?.[0]);

    const isOldVersion = router.asPath.includes('delegate-compensation-old');
    const isAdmin = router.asPath.includes('/admin');
    const isDelegatePages =
      router.asPath.includes('delegate/') ||
      (router.asPath.includes('delegate-compensation') && !isOldVersion);
    const lastPath = router.asPath.split('/')?.at(-1);
    const delegateCompensationPage =
      lastPath?.includes('delegate-compensation') && !isOldVersion;
    let targetDate = new Date();

    // Handle old version path
    if (isOldVersion) {
      targetDate =
        targetDate > DATES.OLD_VERSION_MAX ? DATES.OLD_VERSION_MAX : targetDate;
    }
    // Handle admin path
    else if (isAdmin) {
      targetDate =
        targetDate < DATES.NEW_VERSION_MIN ? DATES.NEW_VERSION_MIN : targetDate;
    }
    // Handle delegate paths
    else if (isDelegatePages) {
      targetDate = DATES.NEW_VERSION_MAX;
    }

    // Handle query params if present
    if (monthQuery || yearQuery) {
      const queryDate = new Date(
        yearQuery || targetDate.getFullYear(),
        monthQuery
          ? new Date(
              `10 ${monthQuery} ${yearQuery || targetDate.getFullYear()}`
            ).getMonth()
          : targetDate.getMonth(),
        10
      );

      if (isOldVersion && queryDate > DATES.OLD_VERSION_MAX) {
        targetDate = DATES.OLD_VERSION_MAX;
        router.push(
          {
            pathname: `${rootPathname}/delegate-compensation-old`,
            query: { month: 'october', year: 2024 },
          },
          undefined,
          { shallow: true }
        );
      } else {
        targetDate = queryDate;
      }
    }

    return {
      name: targetDate.toLocaleString('en-US', { month: 'long' }),
      value: {
        month: targetDate.getMonth() + 1,
        year: targetDate.getFullYear(),
      },
    };
  });
  const [delegateAddress, setDelegateAddress] = useState<string | undefined>(
    () => {
      const queryString = router?.query?.delegateAddress as string;
      return queryString || undefined;
    }
  );

  const changeDelegateAddress = (address: string) => {
    setDelegateAddress(address);
    router.push(
      {
        pathname: `${rootPathname}/delegate-compensation/${
          router.pathname.includes('admin') ? 'admin/delegate' : 'delegate'
        }/${address}${
          router.pathname.includes('forum-activity') ? '/forum-activity' : ''
        }`,
        query: {
          month: selectedDate?.name.toLowerCase(),
          year: selectedDate?.value.year,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const {
    data: delegateInfo,
    isFetching: isFetchingDelegateInfo,
    isLoading: isLoadingDelegateInfo,
    refetch: refetchDelegateInfo,
  } = useQuery(
    [
      'delegate-compensation-delegate-info',
      delegateAddress,
      selectedDate?.value.month,
      selectedDate?.value.year,
    ],
    () =>
      getDelegateInfo(
        daoInfo.config.DAO_KARMA_ID,
        selectedDate?.value.month,
        selectedDate?.value.year,
        [delegateAddress as string]
      ).then(res => res[0]),
    {
      enabled: !!delegateAddress && !!selectedDate,
      refetchOnWindowFocus: false,
    }
  );

  const refreshDelegateInfo = () => {
    queryClient.invalidateQueries({
      queryKey: [
        'delegate-compensation-delegate-info',
        delegateAddress,
        selectedDate?.value.month,
        selectedDate?.value.year,
      ],
    });
    refetchDelegateInfo();
  };

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      delegateAddress,
      changeDelegateAddress,
      delegateInfo,
      isFetchingDelegateInfo,
      isLoadingDelegateInfo,
      refreshDelegateInfo,
    }),
    [
      selectedDate,
      setSelectedDate,
      delegateAddress,
      changeDelegateAddress,
      delegateInfo,
      isFetchingDelegateInfo,
      isLoadingDelegateInfo,
      refreshDelegateInfo,
    ]
  );

  return (
    <DelegateCompensationContext.Provider value={value}>
      {children}
    </DelegateCompensationContext.Provider>
  );
};

export const useDelegateCompensation = () => {
  const context = useContext(DelegateCompensationContext);
  if (context === undefined) {
    throw new Error(
      'useDelegateCompensation must be used within a DelegateCompensationProvider'
    );
  }
  return context;
};
