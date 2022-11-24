export interface IDelegate {
  address: string;
  ensName?: string;
  delegateSince?: string;
  forumActivity: number;
  votingWeight: number;
  delegatedVotes: number;
  delegators: number;
  karmaScore: number;
  voteParticipation: {
    onChain: number;
    offChain: number;
  };
  twitterHandle?: string;
  updatedAt?: string;
}
