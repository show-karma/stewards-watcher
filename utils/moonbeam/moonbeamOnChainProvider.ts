/* eslint-disable no-useless-catch */
import {
  Hex,
  IChainRow,
  MoonbeamProposal,
  NumberIsh,
  OpenGovLockedBalanceResponse,
} from 'types';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { VOTING_HISTORY } from 'utils/GraphQL';
import moment from 'moment';
import { ethers, providers } from 'ethers';
import { RPCS } from 'helpers';
import { IActiveDelegatedTracks, fetchBlockTimestamp } from 'utils';
import axios from 'axios';
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
      trackId: Number(
        proposals.find(item => item.id === proposalString)?.trackId
      ),
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
        finished: proposal.finished,
        trackId: Number(proposal?.trackId),
      });
  });

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
  const { data } = await axios.get('/api/proposals?dao=moonbeam');
  return data;
}

async function getDaoProposals(): Promise<IProposal[]> {
  const proposals = await proposalsWithMetadata();

  const provider = new providers.JsonRpcProvider(RPCS.moonbeam);

  const currentBlock = await provider.getBlockNumber();
  const filteredProposals = proposals.filter(proposal => {
    const status = Object.entries(proposal.information)[0] as any;
    if (status[1].submitted) {
      return status?.submitted <= currentBlock;
    }
    return status.flat()[1] <= currentBlock;
  });

  const proposalsMap = await Promise.all(
    filteredProposals.map(async proposal => {
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
        finished: status[0] !== 'ongoing',
      };
    })
  );
  return proposalsMap;
}

const providerUrl =
  'https://api.thegraph.com/subgraphs/name/show-karma/moonbeam-dao-delegate-voting';

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
    console.log('error on proposals fetch', error);
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
  }
  `;

/**
 * Fetches the active delegated tracks for a given address
 *
 * @param address
 * @param daoName
 * @returns array of track ids that is currently delegated
 */
export async function moonbeamActiveDelegatedTracks(
  address: string,
  daoName = 'moonbeam'
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

export async function moonbeamGetLockedTokensAction(address: Hex) {
  const client = await MoonbeamWSC.createClient();
  const [, total] = await client.getLockedBalanceOf(address, true);

  return total;
}

export async function moonbeamOnChainProvider(
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
