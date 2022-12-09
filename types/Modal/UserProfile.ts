export type IActiveTab = 'statement' | 'votinghistory' | 'aboutMe';

export type IProfile = {
  address: string;
  ensName?: string;
  twitter?: string;
  avatar?: string;
  aboutMe?: string;
  realName?: string;
};
