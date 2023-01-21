import { ScoreBreakdownCalc } from 'karma-score';
import { axiosInstance } from './axiosInstance';

type ScoreBreakdownRes = {
  breakdown: ScoreBreakdownCalc;
  score: number;
};

export async function fetchScoreBreakdown(
  publicAddress: string,
  daoName: string,
  type:
    | 'gitcoinHealthScore'
    | 'forumScore'
    | 'karmaScore' = 'gitcoinHealthScore',
  period: 'lifetime' | '180d' | '30d' = 'lifetime'
): Promise<ScoreBreakdownRes> {
  const { data: breakdown } = await axiosInstance.get<{
    data: ScoreBreakdownRes;
  }>(`user/${publicAddress}/${daoName}/score-descriptor`, {
    params: {
      type,
      period,
    },
  });
  return breakdown.data;
}
