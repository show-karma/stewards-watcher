import { AxiosResponse } from 'axios';
import { api } from 'helpers';
import { DelegateStatsFromAPI } from 'types';

export const getDelegateInfo = async (
  daoId: string,
  month?: string | number,
  year?: string | number,
  addresses?: string[]
) => {
  try {
    const response: AxiosResponse<{
      data: { delegates: DelegateStatsFromAPI[] };
    }> = await api.get(`/delegate/${daoId}/incentive-programs-stats`, {
      params: {
        month: month || undefined,
        year: year || undefined,
        addresses: addresses?.join(',') || undefined,
      },
    });
    const delegates = response?.data?.data?.delegates;
    if (!delegates) throw new Error('No delegates');
    return delegates;
  } catch (error) {
    console.error(error);
    return [];
  }
};
