export type IActiveTab = 'statement' | 'votinghistory' | 'aboutme' | 'handles';

export type IProfile = {
  address: string;
  ensName?: string;
  twitter?: string;
  avatar?: string;
  aboutMe?: string;
  realName?: string;
  forumHandle?: string;
  discordHandle?: string;
};
