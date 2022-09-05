export interface ISteward {
  address: string;
  ensName?: string;
  stewardSince: string;
  forumActivity: number;
  votingWeight: number;
  delegators: number;
  voteParticipation: {
    onChain: number;
    offChain: number;
  };
  twitterHandle?: string;
}
