/* eslint-disable no-useless-catch */
import { IChainRow, MoonbeamProposal, NumberIsh } from 'types';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { VOTING_HISTORY } from 'utils/GraphQL';
import moment from 'moment';
import { ethers, providers } from 'ethers';
import { RPCS } from 'helpers';
import { fetchBlockTimestamp } from 'utils';
import { MoonbeamWSC } from './moonbeamwsc';
import { polkassembly, Post } from './polkassembly';

interface IProposal {
  id: string;
  timestamp: number;
  description: string;
  trackId: NumberIsh;
}

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
    console.log(proposalString);
    array.push({
      voteMethod: 'On-chain',
      proposal:
        proposals.find(item => item.id === proposalString)?.description ||
        `Proposal ${proposalString.toString()}`,
      choice: vote?.support,
      solution: vote?.solution,
      reason: vote?.reason,
      executed: moment.unix(timestamp).format('MMMM D, YYYY'),
      voteId: proposalString,
    });
  });

  proposals.forEach(proposal => {
    if (!array.find(item => item.voteId === proposal.id.toString()))
      array.push({
        voteMethod: 'On-chain',
        proposal: proposal.description,
        choice: -1,
        solution: null,
        executed: moment.unix(proposal.timestamp).format('MMMM D, YYYY'),
        voteId: proposal.id.toString(),
      });
  });
  console.log(array);
  // removing duplicate items on array that have same proposal id
  const filteredArray = array.filter(
    (item, index, self) =>
      index === self.findIndex(current => current.voteId === item.voteId)
  );

  return filteredArray;
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
        id: `${proposal.proposalId}`,
        description:
          proposal.proposal || `Proposal ${proposal.proposalId.toString()}`,
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

interface IDelegatingHistory {
  id: string;
  delegator: string;
  trackId: NumberIsh;
  amount: string;
  toDelegate: string;
}

interface IUndelegated {
  id: string;
  trackId: NumberIsh;
}

interface IDelegatingHistoryResponse {
  delegatingHistories: IDelegatingHistory[];
  undelegatedHistories: IUndelegated[];
  unlockeds: { trackId: NumberIsh }[];
}

const delegateHistoryQuery = (address: string, daoName: string) => gql`
{
	delegatingHistories(
    where:{
      delegator:"${address.toLowerCase()}",
      daoName:"${daoName}"
    }
    orderBy: timestamp
    orderDirection: asc
  ) {
	  id    
    delegator
    trackId
    amount
    toDelegate
	}
  undelegatedHistories (
  where:{
    delegator: "${address.toLowerCase()}",
  }
  orderBy: blockTimestamp
  orderDirection: asc
  ) {
    id
    trackId
  }
  unlockeds(
   where: {caller: "${address.toLowerCase()}"}
  orderBy: blockTimestamp
  orderDirection: asc
  ) {
    trackId
  }
}
`;

export interface IActiveDelegatedTracks {
  trackId: NumberIsh;
  locked: number;
  amount: string;
  active: boolean;
  toDelegate: string;
}

/**
 * Fetches the active delegated tracks for a given address
 *
 * @param address
 * @param daoName
 * @returns array of track ids that is currently delegated
 */
export async function moonriverActiveDelegatedTracks(
  address: string,
  daoName = 'moonriver'
): Promise<IActiveDelegatedTracks[]> {
  const onChainClient = new ApolloClient({
    uri: providerUrl,
    cache: new InMemoryCache(),
  });

  const { data } = await onChainClient.query<IDelegatingHistoryResponse>({
    query: delegateHistoryQuery(address, daoName),
  });

  const { delegatingHistories, undelegatedHistories, unlockeds } = data;

  // count trackId for delegatingHistory, undelegeted and unlocked

  const delegationCount = delegatingHistories.reduce(
    (acc, delegatingHistory) => {
      const { trackId } = delegatingHistory;
      if (acc[trackId]) {
        acc[trackId] += 1;
      } else {
        acc[trackId] = 1;
      }
      return acc;
    },
    {} as Record<NumberIsh, number>
  );

  const undelegationCount = undelegatedHistories.reduce((acc, undelegated) => {
    const { trackId } = undelegated;
    if (acc[trackId]) {
      acc[trackId] += 1;
    } else {
      acc[trackId] = 1;
    }
    return acc;
  }, {} as Record<NumberIsh, number>);

  const unlockedCount = unlockeds.reduce((acc, unlocked) => {
    const { trackId } = unlocked;
    if (acc[trackId]) {
      acc[trackId] += 1;
    } else {
      acc[trackId] = 1;
    }
    return acc;
  }, {} as Record<NumberIsh, number>);

  const delegations: IActiveDelegatedTracks[] = delegatingHistories
    .filter(
      delegatingHistory =>
        unlockedCount[delegatingHistory.trackId] <
          delegationCount[delegatingHistory.trackId] ||
        undelegationCount[delegatingHistory.trackId] <
          delegationCount[delegatingHistory.trackId]
    )
    .map(delegatingHistory => ({
      trackId: delegatingHistory.trackId,
      locked:
        delegationCount[delegatingHistory.trackId] -
        unlockedCount[delegatingHistory.trackId],
      amount: ethers.utils.formatEther(delegatingHistory.amount),
      active:
        undelegationCount[delegatingHistory.trackId] <
        delegationCount[delegatingHistory.trackId],
      toDelegate: delegatingHistory.toDelegate,
    }));

  const unique = delegations.reduce((acc, cur) => {
    if (!acc[cur.trackId]) acc[cur.trackId] = cur;
    return acc;
  }, {} as Record<NumberIsh, IActiveDelegatedTracks>);

  return Object.values(unique);
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
