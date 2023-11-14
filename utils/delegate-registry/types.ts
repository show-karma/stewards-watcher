import { Hex } from 'types';

export type DelegateProfile = {
  name?: string | null; // name of the delegate
  profilePictureUrl?: string | null; // URL of the delegate's profile picture
  status: 'Active' | 'Withdrawn' | 'Pending'; // status of the delegate
  ipfsMetadata?: string | null; // IPFS hash of delegate's metadata
  statement: string; // Delegate's statement for this DAO
  interests: string; // Delegate's interests
};

export type Delegate = {
  tokenAddress: Hex; // address of the DAO's token
  tokenChainId: number; // chain ID of this DAO's network
};

export type DelegateWithProfile = Delegate & {
  profile: DelegateProfile; // metadata this delegate's profile
};

export type DelegateWithAddress = Delegate & {
  delegateAddress: Hex; // address of this delegate's account
};

export interface DelegateRegistry {
  delegateAddress: Hex; // address of this delegate's account
  statement: string; // Delegate's statement for this DAO
  tokenAddress: Hex; // address of the DAO's token
  tokenChainId: number; // chain ID of this DAO's network
  status: 'Active' | 'Withdrawn' | 'Pending'; // status of the delegate
  blockTimestamp: number; // timestamp of the block when the delegate was registered
  name?: string | null; // name of the delegate
  ipfsMetadata?: string | null; // IPFS hash of delegate's metadata
  interests: string | string[]; // Delegate's interests
  acceptedCoC: boolean; // whether the delegate has accepted the CoC
}

export interface DelegateStatementRes {
  delegates: DelegateRegistry[];
}

export interface DelegateRegistryWithInterests extends DelegateRegistry {
  interests: string[]; // Delegate's interests
}

export interface ICustomScore {
  name: string;
  value: bigint;
}

export interface IStats {
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
}
