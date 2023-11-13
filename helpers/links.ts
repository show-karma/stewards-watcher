export const LINKS = {
  PROFILE: (rootPathname: string, address: string, hash?: string) =>
    `${rootPathname}/profile/${address}${hash ? `#${hash}` : ''}`,
};
