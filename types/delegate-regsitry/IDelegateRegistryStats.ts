export interface ICustomScore {
  name: string;
  value: bigint;
}

export interface IDelegateRegistryStats {
  daoName: string;
  customScore: ICustomScore[];
  karmaScore: bigint;
  forumActivityScore: bigint;
  forumPostsReadCount: bigint;
  forumLikesReceived: bigint;
  forumPostCount: bigint;
  forumTopicCount: bigint;
  forumPostCountPercentile: bigint;
  forumTopicCountPercentile: bigint;
  forumLikesReceivedPercentile: bigint;
  forumPostsReadCountPercentile: bigint;
  proposalsInitiated: bigint;
  proposalsDiscussed: bigint;
  proposalsOnAragon: bigint;
  proposalsOnSnapshot: bigint;
  proposalsInitiatedPercentile: bigint;
  proposalsDiscussedPercentile: bigint;
  delegatedVotes: bigint;
  onChainVotesPct: bigint;
  offChainVotesPct: bigint;
  aragonVotesPct: bigint;
  avgPostLikes: bigint;
  avgPostLength: bigint;
  avgTopicPostCount: bigint;
  discordMessagesCount: bigint;
  discordMessagesPercentile: bigint;
  percentile: bigint;
  [key: string]: bigint | string | ICustomScore[];
}
