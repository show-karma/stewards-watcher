import { api } from 'helpers';
import { DelegateCompensationStats, DelegateStatsFromAPI } from 'types';
import { formatSimpleNumber } from 'utils/formatNumber';

export const fetchDelegates = async (
  daoName: string,
  onlyOptIn: boolean,
  month: number,
  year: number,
  simplified = false
) => {
  try {
    const response = await api.get(
      `/delegate/${daoName}/incentive-programs-stats`,
      {
        params: {
          incentiveOptedIn: onlyOptIn || undefined,
          month: month || undefined,
          year: year || undefined,
        },
      }
    );
    if (!response.data.data.delegates)
      throw new Error('Error fetching delegates');
    const responseDelegates = response.data.data.delegates;

    if (responseDelegates.length === 0) {
      return [];
    }
    if (simplified) {
      return responseDelegates;
    }

    const orderDelegates = responseDelegates.sort(
      (itemA: DelegateStatsFromAPI, itemB: DelegateStatsFromAPI) =>
        +itemB.stats.totalParticipation - +itemA.stats.totalParticipation
    );

    const parsedDelegates: DelegateCompensationStats[] = orderDelegates.map(
      (delegate: DelegateStatsFromAPI, index: number) => {
        const snapshotVoting = {
          rn: formatSimpleNumber(delegate.stats.snapshotVoting.rn.toString()),
          tn: formatSimpleNumber(delegate.stats.snapshotVoting.tn.toString()),
          score: formatSimpleNumber(
            delegate.stats.snapshotVoting.score.toString()
          ),
        };
        const onChainVoting = {
          rn: formatSimpleNumber(delegate.stats.onChainVoting.rn.toString()),
          tn: formatSimpleNumber(delegate.stats.onChainVoting.tn.toString()),
          score: formatSimpleNumber(
            delegate.stats.onChainVoting.score.toString()
          ),
        };
        const communicatingRationale = {
          rn: formatSimpleNumber(
            delegate.stats.communicatingRationale.rn.toString()
          ),
          tn: formatSimpleNumber(
            delegate.stats.communicatingRationale.tn.toString()
          ),
          score: formatSimpleNumber(
            delegate.stats.communicatingRationale.score.toString()
          ),
          breakdown: delegate.stats.communicatingRationale.breakdown,
        };

        const commentingProposal = {
          rn: formatSimpleNumber(
            delegate.stats.commentingProposal.rn.toString()
          ),
          tn: formatSimpleNumber(
            delegate.stats.commentingProposal.tn.toString()
          ),
          score: formatSimpleNumber(
            delegate.stats.commentingProposal.score.toString()
          ),
        };

        const delegateFeedback = {
          score: formatSimpleNumber(
            delegate.stats?.delegateFeedback?.finalScore?.toString() || '0'
          ),
        };

        return {
          id: delegate.id,
          delegate: {
            publicAddress: delegate.publicAddress as `0x${string}`,
            name: delegate.name,
            profilePicture: delegate.profilePicture,
            shouldUse:
              delegate.name || delegate.ensName || delegate.publicAddress,
          },
          incentiveOptedIn: delegate.incentiveOptedIn,
          delegateImage: delegate.profilePicture,
          ranking: index + 1 <= 50 ? index + 1 : null,
          participationRatePercent: +delegate.stats.participationRatePercent,
          fundsARB: 5000,
          votingPower: +delegate.votingPower,
          participationRate: delegate.stats.participationRate,
          snapshotVoting,
          onChainVoting,
          communicatingRationale,
          commentingProposal,
          delegateFeedback,
          totalParticipation: delegate.stats.totalParticipation,
          payment: formatSimpleNumber(delegate.stats.payment),
          bonusPoint: delegate.stats.bonusPoint.toString(),
          stats: delegate.stats,
        } as DelegateCompensationStats;
      }
    );

    return parsedDelegates;
  } catch (error) {
    console.log(error);
    return [];
  }
};
