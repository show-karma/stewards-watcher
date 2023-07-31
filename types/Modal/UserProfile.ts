export type IActiveTab =
  | 'statement'
  | 'votinghistory'
  | 'aboutme'
  | 'handles'
  | 'toa'
  | 'withdraw';

export type IProfile = {
  address: string;
  ensName?: string;
  twitter?: string;
  avatar?: string;
  aboutMe?: string;
  realName?: string;
  website?: string;
  forumHandle?: string;
  discordHandle?: string;
  discussionThread?: string;
  discordUsername?: string;
  status?: string;
  userCreatedAt?: string;
};
