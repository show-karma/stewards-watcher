/* eslint-disable no-useless-catch */
import { IChainRow, MoonbeamProposal, NumberIsh } from 'types';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { VOTING_HISTORY } from 'utils/GraphQL';
import moment from 'moment';
import { providers } from 'ethers';
import { RPCS } from 'helpers';
import { fetchBlockTimestamp } from 'utils';
import { MoonbeamWSC } from './moonbeamwsc';
import { polkassembly, Post } from './polkassembly';

/**
 * Concat proposal and votes into a common interface
 * @param proposals
 * @param votes
 */
function concatOnChainProposals(proposals: any[], votes: any[]) {
  const array: IChainRow[] = [];

  votes.forEach((vote: any) => {
    const { proposal, timestamp } = vote;
    const proposalString = parseInt(proposal, 16).toString();
    array.push({
      voteMethod: 'On-chain',
      proposal: proposalString,
      choice: vote?.support,
      solution: vote?.solution,
      reason: vote?.reason,
      executed: moment.unix(timestamp).format('MMMM D, YYYY'),
      voteId: proposalString,
    });
  });

  proposals.forEach(proposal => {
    array.push({
      voteMethod: 'On-chain',
      proposal: proposal?.description || proposal?.id,
      choice: -1,
      solution: null,
      executed: moment.unix(proposal.timestamp).format('MMMM D, YYYY'),
      voteId: proposal?.id,
    });
  });

  // removing duplicate items on array that have same proposal id
  const filteredArray = array.filter(
    (item, index, self) =>
      index === self.findIndex(current => current.voteId === item.voteId)
  );

  return filteredArray;
}

interface IProposal {
  id: string;
  timestamp: number;
}

async function proposalsWithMetadata(): Promise<
  (MoonbeamProposal & { proposal: string; trackId: NumberIsh })[]
> {
  const client = await MoonbeamWSC.createClient();

  const proposals = await client.getProposals();
  const tracks = client.getTracks(true);
  const postWithTrackId: (Post & { trackId: NumberIsh })[] = [];

  const promises = tracks.map(async track => {
    const posts = await polkassembly.fetchOnChainPosts(track.id, 'moonriver');
    postWithTrackId.push(
      ...posts.map(post => ({ ...post, trackId: track.id }))
    );
  });

  await Promise.all(promises);
  const result: (MoonbeamProposal & {
    proposal: string;
    trackId: NumberIsh;
  })[] = [];

  postWithTrackId.forEach(post => {
    const currentProposal = proposals.find(
      proposal => +proposal.proposalId === +post.post_id
    );

    if (currentProposal) {
      result.push({
        ...currentProposal,
        proposal: post.title,
        trackId: post.trackId,
      });
    }
  });
  return result;
}

async function getDaoProposals(): Promise<IProposal[]> {
  const proposals = await proposalsWithMetadata();

  const provider = new providers.JsonRpcProvider(RPCS.moonriver);

  const proposalsMap = await Promise.all(
    proposals.map(async proposal => {
      const status = Object.entries(proposal.information)[0] as any;
      let blockNumber = 0;
      if (status[1].submitted) {
        blockNumber = status?.submitted as number;
      } else {
        blockNumber = status.flat()[1] as number;
      }
      const proposalTimestamp = await fetchBlockTimestamp(
        provider,
        blockNumber
      );

      return {
        id: proposal.proposal || `Proposal ${proposal.proposalId.toString()}`,
        timestamp: proposalTimestamp,
        trackId: proposal.trackId,
      };
    })
  );
  return proposalsMap;
}

const providerUrl =
  'https://api.thegraph.com/subgraphs/name/show-karma/moonriver-dao-delegate-voting';

async function fetchOnChainVotes(daoName: string | string[], address: string) {
  if (!daoName || !address) return [];
  try {
    const onChainClient = new ApolloClient({
      uri: providerUrl,
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
      const proposals = await getDaoProposals();
      return concatOnChainProposals(proposals, votes.votes);
    }
  } catch (error) {
    return [];
  }
  return [];
}

export async function moonriverOnChainProvider(
  daoName: string | string[],
  address: string
): Promise<IChainRow[]> {
  try {
    const votes = await fetchOnChainVotes(daoName, address);
    return votes;
  } catch {
    return [];
  }
}
