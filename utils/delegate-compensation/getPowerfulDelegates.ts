import { api } from 'helpers';

export const getPowerfulDelegates = async (
  daoName: string,
  month: number,
  year: number
) => {
  try {
    const response = await api.get(
      `/delegate/${daoName}/incentive-programs-stats`,
      {
        params: {
          // incentiveOptedIn: undefined,
          month: month || undefined,
          year: year || undefined,
        },
      }
    );
    if (!response?.data?.data?.delegates) {
      return 0;
    }
    const responseDelegates = response.data.data.delegates;
    const powerfulDelegates = responseDelegates.filter(
      (delegate: any) => delegate.votingPower >= 50000
    );
    return powerfulDelegates.length;
  } catch (error) {
    return 0;
  }
};
