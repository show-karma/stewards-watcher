export interface ITokenHoldersAPI {
  publicAddress: string;
  ensName: string;
  daoName: string;
  wallets: string[];
  profilePicture?: string;
}

export interface IDelegatingHistories {
  id: string;
  toDelegate: string;
  delegator: string;
  timestamp: number;
  trackId: number;
}

export interface IDelegationHistoryAPI {
  publicAddress: string;
  ensName?: string;
  daoName: string;
  delegatingHistories: IDelegatingHistories[];
  profilePicture?: string;
  totalDelegatedVotes?: number;
}
