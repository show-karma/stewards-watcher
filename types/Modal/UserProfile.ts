export type IActiveTab = 'statement' | 'votinghistory' | 'aboutme';

export type IProfile = {
  address: string;
  ensName?: string;
  twitter?: string;
  avatar?: string;
  aboutMe?: string;
  realName?: string;
};
