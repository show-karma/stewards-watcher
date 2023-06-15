export const KARMA_API = {
  base_url: process.env.NEXT_PUBLIC_KARMA_API || '',
};

export const KARMA_LINKS = {
  discord: 'https://discord.com/invite/hnZm3MffqQ',
  twitter: 'https://twitter.com/karmahq_',
  mirror: 'https://mirror.xyz/showkarma.eth',
  linkedin: 'https://www.linkedin.com/company/karmaxyz/',
};

export const API_ROUTES = {
  DELEGATE: {
    TERMS_OF_SERVICE: (daoName: string) =>
      `${KARMA_API.base_url}/delegate/${daoName}/terms-of-service`,
    TERMS_OF_AGREEMENT: (daoName: string) =>
      `${KARMA_API.base_url}/delegate/${daoName}/terms-of-agreement`,
    GET_TERMS_OF_SERVICE: (daoName: string, address: string) =>
      `${KARMA_API.base_url}/delegate/${daoName}/terms-of-agreement/${address}`,
    CHANGE_TRACKS: (daoName: string, address: string) =>
      `${KARMA_API.base_url}/delegate/${daoName}/${address}/assign-tracks`,
  },
};

export const YOUTUBE_LINKS = {
  DISCORD_LINKING: 'https://www.youtube.com/watch?v=UXDmZ8bN4Sg',
};
