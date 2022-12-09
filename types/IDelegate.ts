export interface IDelegate {
  address: string;
  ensName?: string;
  delegateSince?: string;
  forumActivity: number;
  votingWeight?: number;
  delegatedVotes?: number;
  delegators: number;
  karmaScore: number;
  voteParticipation: {
    onChain: number;
    offChain: number;
  };
  twitterHandle?: string;
  discourseHandle?: string;
  updatedAt?: string;
  aboutMe?: string;
  realName?: string;
  profilePicture?: string;
}
