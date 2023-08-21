/* eslint-disable no-useless-catch */
import { Hex, IChainRow, MoonbeamProposal, NumberIsh } from 'types';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import moment from 'moment';
import { ethers } from 'ethers';
import { api } from 'helpers';
import axios from 'axios';
import { MoonbeamWSC } from './moonbeamwsc';

type VoteResponse = {
  proposals: {
    id: number;
    version: string;
    startDate: number;
    endDate: number;
  }[];
  votes: {
    proposalId: string;
    reason: boolean;
  }[];
};

interface IProposal {
  id: string;
  timestamp: number;
  description: string;
  trackId: NumberIsh;
}

const getVoteReason = (vote: any) => {
  if (!vote.reason || typeof vote.reason === 'boolean') return 'Did not vote';
  const reason = vote.reason.toLowerCase() === 'ayes' ? 1 : 0;
  return reason;
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
    const original = proposals.find(item => +item.id === +proposal);
    array.push({
      voteMethod: 'On-chain',
      proposal: original?.description || `Proposal ${proposal}`,
      choice: getVoteReason(vote),
      solution: vote?.solution,
      reason: vote?.reason,
      executed: moment
        .unix(original?.timestamp || Math.round(Date.now() / 1000))
        .format('MMMM D, YYYY'),
      voteId: proposal,
      trackId: Number(original?.trackId),
    });
  });

  proposals.forEach(proposal => {
    if (!array.find(item => item.voteId && +item.voteId === +proposal.id))
      array.push({
        voteMethod: 'On-chain',
        proposal: proposal.description,
        choice: -1,
        solution: null,
        executed: moment.unix(proposal.timestamp).format('MMMM D, YYYY'),
        voteId: proposal.id.toString(),
        finished: proposal.finished,
        trackId: Number(proposal?.trackId),
      });
  });

  // removing duplicate items on array that have same proposal id
  // const filteredArray = array.filter(
  //   (item, index, self) =>
  //     index === self.findIndex(current => current.voteId === item.voteId)
  // );
  return array;
}

async function proposalsWithMetadata(): Promise<
  (MoonbeamProposal & { proposal: string; trackId: NumberIsh })[]
> {
  const { data } = await axios.get('/api/proposals?dao=moonriver');
  return data;
}

async function getDaoProposals(
  cachedProposals: VoteResponse['proposals'] = []
): Promise<IProposal[]> {
  const proposals = await proposalsWithMetadata();
  console.log({ cachedProposals });
  const proposalsMap = proposals.map(proposal => {
    const status = Object.entries(proposal.information)[0] as any;
    const timestamp =
      (cachedProposals.find(
        pr =>
          +pr.id === +proposal.proposalId &&
          (proposal.trackId === null) === (pr.version === 'V1')
      )?.startDate || 0) / 1000;

    return {
      proposal: proposal.proposalId,
      id: `${proposal.proposalId}`,
      description:
        proposal.proposal || `Proposal ${proposal.proposalId.toString()}`,
      timestamp: Math.round(timestamp),
      trackId: proposal.trackId,
      finished: !status ? true : status[0] !== 'ongoing',
    };
  });

  // eslint-disable-next-line id-length
  return proposalsMap.sort((a, b) => b.timestamp - a.timestamp);
}

const providerUrl =
  'https://api.thegraph.com/subgraphs/name/show-karma/moonriver-dao-delegate-voting';

async function fetchOnChainVotes(daoName: string | string[], address: string) {
  if (!daoName || !address) return [];
  try {
    const {
      data: {
        data: { votes, proposals: cachedProposals },
      },
    } = await api.get<{ data: VoteResponse }>(
      `delegate/${[daoName].flat()[0]}/${address}/voting-history`
    );

    const voteList = votes.map(vote => ({
      proposal: vote.proposalId.split('-')[0],
      openGov: vote.proposalId.split('-')[1] === 'V2',
      reason: vote.reason,
    }));
    if (voteList && Array.isArray(voteList)) {
      const proposals = await getDaoProposals(cachedProposals);

      return concatOnChainProposals(proposals, voteList);
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
  conviction: number;
  timestamp: number;
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
    first: 1000,
    where:{
      delegator:"${address.toLowerCase()}",
      daoName:"${daoName}"
    }
    orderBy: timestamp
    orderDirection: desc
  ) {
	  id    
    delegator
    trackId
    amount
    toDelegate
    conviction
    timestamp
	}
  undelegatedHistories (
    first: 1000,
  where:{
    delegator: "${address.toLowerCase()}",
  }
  orderBy: blockTimestamp
  orderDirection: desc
  ) {
    id
    trackId
    blockTimestamp
  }
  unlockeds(
    first: 1000,
   where: {caller: "${address.toLowerCase()}"}
  orderBy: blockTimestamp
  orderDirection: desc
  ) {
    trackId
  }
}`;

export interface IActiveDelegatedTracks {
  trackId: NumberIsh;
  locked: number;
  amount: string;
  active: boolean;
  toDelegate: string;
  conviction: number;
  timestamp: number;
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

  // count trackId for delegatingHistory, undelegated and unlocked

  const [delegationCount, undelegationCount, unlockedCount] = [
    delegatingHistories,
    undelegatedHistories,
    unlockeds,
  ].map(item =>
    item.reduce((acc, history) => {
      const { trackId } = history;
      if (acc[trackId]) {
        acc[trackId] += 1;
      } else {
        acc[trackId] = 1;
      }
      return acc;
    }, {} as Record<NumberIsh, number>)
  );

  const delegations: IActiveDelegatedTracks[] = delegatingHistories
    .filter(
      delegatingHistory =>
        (unlockedCount[delegatingHistory.trackId] || 0) <
          (delegationCount[delegatingHistory.trackId] || 0) ||
        (undelegationCount[delegatingHistory.trackId] || 0) <
          (delegationCount[delegatingHistory.trackId] || 0)
    )
    .map(delegatingHistory => ({
      trackId: delegatingHistory.trackId,
      locked:
        (delegationCount[delegatingHistory.trackId] || 0) -
        (unlockedCount[delegatingHistory.trackId] || 0),
      amount: ethers.utils.formatEther(delegatingHistory.amount),
      active:
        (undelegationCount[delegatingHistory.trackId] || 0) <
        (delegationCount[delegatingHistory.trackId] || 0),
      toDelegate: delegatingHistory.toDelegate,
      timestamp: delegatingHistory.timestamp,
      conviction: delegatingHistory.conviction,
    }));

  const unique = delegations.reduce((acc, cur) => {
    if (!acc[cur.trackId]) acc[cur.trackId] = cur;
    return acc;
  }, {} as Record<NumberIsh, IActiveDelegatedTracks>);

  return Object.values(unique);
}

export async function moonriverGetLockedTokensAction(address: Hex) {
  const client = await MoonbeamWSC.createClient();
  const [, total] = await client.getLockedBalanceOf(address, true);

  return total;
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
