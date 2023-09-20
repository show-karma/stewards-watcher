/* eslint-disable no-useless-catch */
import { Hex, IChainRow, MoonbeamProposal, NumberIsh } from 'types';
import moment from 'moment';
import { ethers } from 'ethers';
import { api } from 'helpers';
import axios from 'axios';
import { ISubscanSearchResponse } from 'types/ISubscanSearchResponse';
import { MoonbeamWSC } from './moonbeamwsc';
import { IActiveDelegatedTracks } from './moonriverOnChainProvider';

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
  version?: string;
}

const getVoteReason = (vote: any) => {
  if (!vote?.reason) return 'Did not vote';
  if (vote.reason.toLowerCase() === 'for') return 1;
  if (vote.reason.toLowerCase() === 'abstain') return 'ABSTAIN';
  return 0;
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
      version: original?.version,
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
        version: proposal?.version,
      });
  });

  return array;
}

async function proposalsWithMetadata(): Promise<
  (MoonbeamProposal & { proposal: string; trackId: NumberIsh })[]
> {
  const { data } = await axios.get(
    '/api/proposals?dao=moonbeam&source=on-chain'
  );
  return data;
}

async function getDaoProposals(
  cachedProposals: VoteResponse['proposals'] = []
): Promise<IProposal[]> {
  const proposals = await proposalsWithMetadata();
  const proposalsMap = proposals.map(proposal => {
    const status = Object.entries(proposal.information)[0] as any;
    const matchedProposal = cachedProposals.find(
      pr =>
        +pr.id === +proposal.proposalId &&
        (proposal.trackId === null) === (pr.version === 'V1')
    );
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
      version: matchedProposal?.version,
    };
  });

  // eslint-disable-next-line id-length
  return proposalsMap.sort((a, b) => b.timestamp - a.timestamp);
}

const providerUrl = 'https://moonbase.api.subscan.io/api/v2/scan/search';

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

/**
 * Fetches the active delegated tracks for a given address
 *
 * @param address
 * @returns array of track ids that is currently delegated
 */
export async function moonriverActiveDelegatedTracks(
  address: string
): Promise<IActiveDelegatedTracks[]> {
  const subscanKey = process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
  if (!subscanKey) throw new Error('Subscan API key not found');

  const { data } = await axios.post<ISubscanSearchResponse>(
    providerUrl,
    {
      key: address,
    },
    {
      headers: {
        'x-api-key': subscanKey,
      },
    }
  );

  const delegations = data.data.account.delegate.conviction_delegate.map(
    (item): IActiveDelegatedTracks => ({
      trackId: item.origins,
      locked: +item.conviction > 0 ? 1 : 0,
      amount: ethers.utils.formatEther(item.amount),
      active: true,
      toDelegate: item.delegate_account.address,
      conviction: +item.conviction,
      timestamp: moment().unix(),
    })
  );

  const unique = delegations.reduce((acc, cur) => {
    if (!acc[cur.trackId]) acc[cur.trackId] = cur;
    return acc;
  }, {} as Record<NumberIsh, IActiveDelegatedTracks>);

  return Object.values(unique);
}

export async function moonbeamGetLockedTokensAction(address: Hex) {
  const client = await MoonbeamWSC.createClient(
    'wss://moonbeam.public.blastapi.io'
  );
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
