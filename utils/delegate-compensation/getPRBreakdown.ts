/* eslint-disable no-param-reassign */
import { AxiosResponse } from 'axios';
import { api } from 'helpers';
import {
  ParticipationRateProposals,
  ParticipationRateRows,
  ParticipationRateVotes,
} from 'types/delegate-compensation/votingHistory';

export const getPRBreakdown = async (
  address?: string,
  daoName?: string,
  period = 'arbitrum-incentive'
) => {
  if (!address || !daoName) return { proposals: [], votes: [], rows: [] };
  try {
    const response: AxiosResponse<{
      data: {
        proposals: ParticipationRateProposals[];
        votes: ParticipationRateVotes[];
      };
    }> = await api.get(
      `/delegate/${daoName}/${address}/voting-history?period=${period}`
    );
    const proposals = response?.data?.data?.proposals;
    if (!proposals) throw new Error('No proposals');
    const votes = response?.data?.data?.votes;
    const rows: ParticipationRateRows[] = [];
    proposals.forEach(proposal => {
      const voteFound = votes.find(
        vote => vote.proposal.id.toLowerCase() === proposal.id.toLowerCase()
      );
      rows.push({
        id: proposal.id,
        discussion: proposal.discussion,
        votedOn: voteFound?.proposal.timestamp || undefined,
        link: undefined,
      });
    });

    const orderRows = rows
      .sort((first, second) => {
        if (!first.votedOn) return 1;
        if (!second.votedOn) return -1;
        return +second.votedOn * 1000 - +first.votedOn * 1000;
      })
      .map(item => ({
        ...item,
        votedOn: item.votedOn
          ? new Date(+item.votedOn * 1000).toString()
          : undefined,
      }));
    return { proposals, votes, rows: orderRows };
  } catch (error) {
    console.error(error);
    return { proposals: [], votes: [], rows: [] };
  }
};
