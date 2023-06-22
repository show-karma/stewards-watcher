import axios from 'axios';
import { fetchOnChainProposalVotes } from 'hooks';
import { IChainRow } from 'types';

interface DyDxProposal {
  DIP: number;
  title: string;
  status: string;
  author: string;
  shortDescription: string;
  discussions: string;
  created: string;
  preview: string;
  basename: string;
  description: string;
  ipsfHash: string;
  encodeIpfsHash: string;
}

const dydxProviderUrl =
  'https://raw.githubusercontent.com/dydxfoundation/dip/ff29e5eb4b9b5f2db7f71183ff7c1dbc647fa3c3/content/ipfs-dips/all-dips.json';

export async function onChainDyDxVotesProvider(
  daoName: string | string[],
  address: string
): Promise<IChainRow[]> {
  const votes = await fetchOnChainProposalVotes(daoName, address);

  const { data: proposals } = await axios.get<DyDxProposal[]>(dydxProviderUrl);
  if (!Array.isArray(proposals))
    throw new TypeError(
      `[dydxProposalProvider]: Expected proposals to be Array, received '${typeof proposals}' instead.`
    );

  const proposalById = proposals.reduce(
    (acc: Record<string, DyDxProposal>, cur) => {
      const proposalId = `dydx.eth-0x${Number(cur.DIP).toString(16)}`;
      acc[proposalId] = cur;
      return acc;
    },
    {}
  );

  return votes.map(vote => {
    const { voteId } = vote;
    if (voteId && proposalById[voteId]) {
      return {
        ...vote,
        proposal: proposalById[voteId].title,
      };
    }
    return vote;
  });
}
