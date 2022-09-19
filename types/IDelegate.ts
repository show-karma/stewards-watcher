export interface IDelegate {
  address: string;
  ensName?: string;
  delegateSince?: string;
  forumActivity: number;
  votingWeight: number;
  delegators: number;
  voteParticipation: {
    onChain: number;
    offChain: number;
  };
  twitterHandle?: string;
  updatedAt?: string;
}
