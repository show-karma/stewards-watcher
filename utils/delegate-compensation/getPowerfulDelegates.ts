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
          incentiveOptedIn: false,
          month: month || undefined,
          year: year || undefined,
        },
      }
    );
    if (!response?.data?.data?.delegates) {
      return 0;
    }
    const responseDelegates = response.data.data.delegates;
    return responseDelegates.length;
  } catch (error) {
    return 0;
  }
};
