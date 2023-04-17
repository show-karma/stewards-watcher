export type IActiveTab =
  | 'statement'
  | 'votinghistory'
  | 'aboutme'
  | 'handles'
  | 'withdraw';

export type IProfile = {
  address: string;
  ensName?: string;
  twitter?: string;
  avatar?: string;
  aboutMe?: string;
  realName?: string;
  forumHandle?: string;
  discordHandle?: string;
  status?: string;
  userCreatedAt?: string;
};
