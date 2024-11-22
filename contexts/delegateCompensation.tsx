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

export const DelegateCompensationProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { daoInfo, rootPathname } = useDAO();

  const [selectedDate, setSelectedDate] = useState(() => {
    const queryString = router.asPath.split('?')[1];
    const monthQuery = queryString?.match(/(?<=month=)[^&]*/i)?.[0];
    const yearQuery = Number(queryString?.match(/(?<=year=)[^&]*/i)?.[0]);
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const isOldVersion = router.asPath.includes('delegate-compensation-old');
    const isAdmin = router.asPath.includes('/admin');
    let date = new Date(
      currentDate.getFullYear(),
      currentDay >= 10 ? currentDate.getMonth() : currentDate.getMonth() - 1,
      10
    );

    if (isOldVersion || !monthQuery) {
      if (date >= new Date('2024-10-10')) {
        date = new Date('2024-10-10');
      }
    }
    if (isAdmin && date <= new Date('2024-11-11')) {
      date = new Date('2024-11-11');
    }

    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const startYear = 2024;
    const lastPath = router.asPath.split('/')?.at(-1);
    if (monthQuery || yearQuery) {
      let year = yearQuery || currentYear;
      let month = monthQuery
        ? new Date(`${monthQuery} 1, ${year}`).getMonth()
        : currentMonth;
      if (lastPath?.includes('delegate-compensation')) {
        if (year > 2024 || (year === 2024 && month >= 10)) {
          if (isOldVersion) {
            router.push(
              {
                pathname: `${rootPathname}/delegate-compensation-old`,
                query: {
                  month: 'october',
                  year: 2024,
                },
              },
              undefined,
              { shallow: true }
            );
            month = 9;
            year = 2024;
          }
        } else if (!isOldVersion && !isAdmin) {
          router.push(
            {
              pathname: `${rootPathname}/delegate-compensation`,
              query: {
                month: 'november',
                year: 2024,
              },
            },
            undefined,
            { shallow: true }
          );
          month = 10;
          year = 2024;
        }
      }

      let correctMonth = month > currentMonth ? currentMonth : month + 1;
      let correctYear =
        year > currentYear || year < startYear ? currentYear : year;
      if (year > currentYear || year < startYear) {
        // get last available month of the year
        const lastAvailableMonth = currentMonth === 12 ? 12 : currentMonth;
        return {
          name: new Date(correctYear, lastAvailableMonth - 1, 1).toLocaleString(
            'en-US',
            {
              month: 'long',
            }
          ),
          value: {
            month: lastAvailableMonth,
            year: correctYear,
          },
        };
      }

      if (isAdmin) {
        if ((correctMonth < 11 && correctYear === 2024) || correctYear < 2024) {
          correctYear = 2024;
          correctMonth = 11;
        }
      }

      return {
        name: new Date(correctYear, correctMonth - 1, 1).toLocaleString(
          'en-US',
          {
            month: 'long',
          }
        ),
        value: {
          month: correctMonth,
          year: correctYear,
        },
      };
    }
    return {
      name: date.toLocaleString('en-US', { month: 'long' }),
      value: {
        month: currentMonth,
        year: currentYear,
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
