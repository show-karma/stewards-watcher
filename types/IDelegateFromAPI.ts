export interface IDelegateFromAPI {
  daoCount: number;
  daoName: string;
  daos: string;
  delegatedVotes: number;
  delegatorCount: number;
  ensName: string;
  isForumVerified: boolean;
  isNominee: boolean;
  joinDateAt: string;
  firstTokenDelegatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pitch: any;
  poap: number;
  publicAddress: string;
  score: number;
  twitterHandle: string;
  discourseHandle: string;
  userType: string;
  scoreBreakdown: {
    name: string;
    pct: number;
    score: number;
  }[];
  stats: {
    createdAt: string;
    forumActivityScore: number;
    forumLikesReceived: number;
    forumPostCount: number;
    forumPostsReadCount: number;
    forumTopicCount: number;
    gitcoinHealthScore: number;
    karmaRank: number;
    karmaScore: number;
    offChainVotesPct: number;
    onChainVotesPct: number;
    percentile: number;
    period: string;
    proposalsDiscussed: number;
    proposalsInitiated: number;
    updatedAt: string;
  }[];
  workstreams: {
    id: number;
    name: string;
  }[];
}
