/* eslint-disable no-useless-catch */
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { useDAO } from 'contexts';

import moment from 'moment';
import { IChainRow } from 'types';

const VOTING_HISTORY = {
  onChainProposalsReq: gql`
    query Proposals($skipIds: [String!]!) {
      proposals(
        where: { organization: "optimism.eth", id_not_in: $skipIds }
        orderBy: "timestamp"
        orderDirection: desc
      ) {
        id
        description
        timestamp
        status
      }
    }
  `,
  onChainVotesReq: gql`
    query Votes($address: String!) {
      votes(
        orderBy: timestamp
        orderDirection: desc
        where: { user: $address, organization: "optimism.eth" }
      ) {
        id
        proposal {
          id
          description
          timestamp
        }
        organization {
          id
        }
        solution
        timestamp
        support
      }
    }
  `,
};

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
export async function onChainOptimismVotesProvider(
  daoName: string | string[],
  address: string
) {
  if (!daoName || !address) return [];
  try {
    const onChainClient = new ApolloClient({
      uri: 'https://api.thegraph.com/subgraphs/name/show-karma/dao-onchain-voting-optimism',
      cache: new InMemoryCache(),
    });
    const { data: votes } = await onChainClient.query({
      query: VOTING_HISTORY.onChainVotesReq,
      variables: {
        address,
      },
    });

    if (votes && Array.isArray(votes.votes)) {
      const skipIds = votes.votes.map((vote: any) => vote.proposal.id);
      const { data: proposals } = await onChainClient.query({
        query: VOTING_HISTORY.onChainProposalsReq,
        variables: {
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
