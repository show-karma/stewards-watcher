/* eslint-disable no-useless-catch */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { useDAO } from 'contexts';

import moment from 'moment';
import { IChainRow } from 'types';
import { VOTING_HISTORY } from 'utils';

const offChainClient = new ApolloClient({
  uri: 'https://hub.snapshot.org/graphql',
  cache: new InMemoryCache(),
});

const concatOffChainProposals = (proposals: any[], votes: any[]) => {
  const array: IChainRow[] = [];

  votes.forEach(vote => {
    const { proposal } = vote;
    array.push({
      voteMethod: 'Off-chain',
      proposal: proposal?.title,
      choice:
        Array.isArray(vote.choice) || Object.keys(vote.choice || {}).length
          ? 'Multiple'
          : proposal.choices[vote.choice - 1],
      reason: vote?.reason,
      executed: moment.unix(proposal.end).format('MMMM D, YYYY'),
      voteId: proposal?.id,
    });
  });

  proposals.forEach(proposal => {
    if (!votes.find(vote => vote.proposal.id === proposal.id))
      array.push({
        voteMethod: 'Off-chain',
        proposal: proposal?.title,
        choice: 'DID NOT VOTE',
        solution: null,
        executed: moment.unix(proposal.end).format('MMMM D, YYYY'),
        voteId: proposal?.id,
      });
  });

  return array;
};

/**
 * Fetch proposals from the subgraph
 * @param daoName
 * @returns array of voted and not voted proposals (not sorted)
 */
async function fetchOffChainProposalVotes(
  daoName: string | string[],
  address: string
) {
  // Assure that the string isn't null or array is also not empty
  if (![daoName].flat().length || !address) return [];
  try {
    const { data: votes } = await offChainClient.query({
      query: VOTING_HISTORY.offChainVotesReq,
      variables: {
        daoname: [daoName].flat(),
        address,
      },
    });
    if (votes && Array.isArray(votes.votes)) {
      const { data: proposals } = await offChainClient.query({
        query: VOTING_HISTORY.offChainProposalsReq,
        variables: {
          daoname: [daoName].flat(),
        },
      });
      return concatOffChainProposals(proposals.proposals, votes.votes);
    }
  } catch (error) {
    throw error;
    //
  }
  return [];
}

const useOffChainVotes = (daoName: string | string[], address: string) => {
  const {
    daoInfo: {
      config: { DAO_EXT_VOTES_PROVIDER },
    },
  } = useDAO();

  return useQuery(['offChainVotes', daoName, address], async () => {
    if (DAO_EXT_VOTES_PROVIDER?.offChain) {
      return DAO_EXT_VOTES_PROVIDER.offChain(daoName, address);
    }
    return fetchOffChainProposalVotes(daoName, address);
  });
};
export { useOffChainVotes, fetchOffChainProposalVotes };
