import { api } from 'helpers';
import { IDelegate } from 'types';

interface Profile {
  ensName: string;
  githubHandle: string;
  address: string;
  id: number;
  delegates: IDelegate[];
  accomplishments: any[];
  nfts: any[];
  githubStats: any[];
  createdAt: string | Date;
  realName: string;
  profilePictureUrl: string;
}

export const getProfile = async (
  address: string
): Promise<Profile | undefined> => {
  try {
    const userData = await api.get(`/user/${address}`);
    return userData.data.data;
  } catch {
    return undefined;
  }
};
