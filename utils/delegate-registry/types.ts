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
