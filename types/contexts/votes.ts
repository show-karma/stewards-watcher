import { Chain } from 'wagmi';

export type IVoteBreakdown = {
  positiveCount: number;
  negativeCount: number;
  abstainCount: number;
  multiple: number;
  other: number;
  totalVotes: number;
  contrarionIndex: number;
};

export type MultiChainResult = { chain: Chain; value: any };
