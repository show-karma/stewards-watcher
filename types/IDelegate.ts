export interface IDelegate {
  daoCount: number;
  daoName: string;
  daos: string;
  delegatedVotes: number;
  delegatorCount: number;
  ensName: string;
  isForumVerified: boolean;
  isNominee: boolean;
  joinDateAt: null;
  pitch: null;
  poap: number;
  publicAddress: string;
  score: number;
  twitterHandle: string;
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
    gitcoinHealthScore: null;
    karmaRank: number;
    karmaScore: number;
    offChainVotesPct: number;
    onChainVotesPct: null;
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
