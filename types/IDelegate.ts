import { ICustomFields } from './ICustomFields';

export interface IDelegate {
  address: string;
  ensName?: string;
  delegateSince?: string;
  forumActivity: number;
  votingWeight?: number;
  delegatedVotes?: number;
  delegatorCount?: number;
  karmaScore: number;
  discordScore: number;
  gitcoinHealthScore?: number;
  voteParticipation: {
    onChain: number;
    offChain: number;
  };
  twitterHandle?: string;
  discordHandle?: string;
  discordUsername?: string;
  discourseHandle?: string;
  updatedAt?: string;
  aboutMe?: string;
  realName?: string;
  profilePicture?: string;
  status: string;
  userCreatedAt?: string;
  delegatePitch?: {
    threadId: number;
    customFields: ICustomFields[];
    postId: number;
  };
  workstreams?: { id: number; name: string; description: string }[];
  acceptedTOS?: boolean;
}
