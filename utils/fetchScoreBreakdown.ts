import { ScoreBreakdownCalc } from 'karma-score';
import { api } from 'helpers';

type ScoreBreakdownRes = {
  breakdown: ScoreBreakdownCalc;
  score: number;
  asString: string;
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
  const { data: breakdown } = await api.get<{
    data: ScoreBreakdownRes;
  }>(`user/${publicAddress}/${daoName}/score-descriptor`, {
    params: {
      type,
      period,
    },
  });
  return breakdown.data;
}
