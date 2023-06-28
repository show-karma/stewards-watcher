export type DelegateProfile = {
  name: string; // name of the delegate
  profilePictureUrl: string; // URL of the delegate's profile picture
  status: 'Active' | 'Withdrawn' | 'Pending'; // status of the delegate
  ipfsMetadata: string; // IPFS hash of delegate's metadata
  statement: string; // Delegate's statement for this DAO
};

export type Delegate = {
  tokenAddress: string; // address of the DAO's token
  tokenChainId: number; // chain ID of this DAO's network
};

export type DelegateWithProfile = Delegate & {
  profile: DelegateProfile; // metadata this delegate's profile
};

export type DelegateWithAddress = Delegate & {
  delegateAddress: string; // address of this delegate's account
};
