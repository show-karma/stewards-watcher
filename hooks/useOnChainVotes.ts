/* eslint-disable no-useless-catch */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { useDAO } from 'contexts';

import moment from 'moment';
import { IChainRow } from 'types';
import { VOTING_HISTORY } from 'utils';

/**
 * Concat proposal and votes into a common interface
 * @param proposals
 * @param votes
 */
function concatOnChainProposals(proposals: any[], votes: any[]) {
  const array: IChainRow[] = [];

  votes.forEach((vote: any) => {
    const { proposal } = vote;
    array.push({
      voteMethod: 'On-chain',
      proposal: proposal?.description,
      choice: vote?.support,
      solution: vote?.solution,
      reason: vote?.reason,
      executed: moment.unix(proposal.timestamp).format('MMMM D, YYYY'),
      voteId: proposal?.id,
    });
  });

  proposals.forEach(proposal => {
    array.push({
      voteMethod: 'On-chain',
      proposal: proposal?.description,
      choice: -1,
      solution: null,
      executed: moment.unix(proposal.timestamp).format('MMMM D, YYYY'),
      voteId: proposal?.id,
      finished: proposal?.status?.toLowerCase() !== 'active',
    });
  });

  return array;
}

/**
 * Fetch proposals from the subgraph
 * @param daoName
 * @returns array of voted and not voted proposals (not sorted)
 */
async function fetchOnChainProposalVotes(
  daoName: string | string[],
  address: string,
  clientUrl = 'https://api.thegraph.com/subgraphs/name/show-karma/dao-on-chain-voting'
) {
  if (!daoName || !address) return [];
  try {
    const onChainClient = new ApolloClient({
      uri: clientUrl,
      cache: new InMemoryCache(),
    });
    const { data: votes } = await onChainClient.query({
      query: VOTING_HISTORY.onChainVotesReq,
      variables: {
        daoname: [daoName].flat(),
        address,
      },
    });

    if (votes && Array.isArray(votes.votes)) {
      const skipIds = votes.votes.map((vote: any) => vote.proposal.id);
      const { data: proposals } = await onChainClient.query({
        query: VOTING_HISTORY.onChainProposalsReq,
        variables: {
          daoname: [daoName].flat(),
          skipIds,
        },
      });
      return concatOnChainProposals(proposals.proposals, votes.votes);
    }
  } catch (error) {
    throw error;
  }
  return [];
}

const useOnChainVotes = (daoName: string | string[], address: string) => {
  const {
    daoInfo: {
      config: { DAO_EXT_VOTES_PROVIDER },
    },
  } = useDAO();
  return useQuery(['onChainVotes', daoName, address], async () => {
    if (DAO_EXT_VOTES_PROVIDER?.onChain) {
      return DAO_EXT_VOTES_PROVIDER.onChain(daoName, address);
    }
    return fetchOnChainProposalVotes(daoName, address);
  });
};

export { useOnChainVotes, fetchOnChainProposalVotes };
