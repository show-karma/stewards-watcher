import { IStats, IStatsID } from 'types/resources';

export type IFilterOrder = 'asc' | 'desc';
export type IFilterPeriod = 'lifetime' | '30d' | '90d' | '180d';

export interface IStatOptions {
  title: string;
  id: IStatsID;
  stat: IStats;
}

export interface IVoteInfo {
  snapshotIds: string | string[];
  onChainId: string;
}

export type IStatusOptions = string;

export type IWorkstream = {
  id: number;
  userId: number;
  name: string;
  daoName: string;
  description: string;
  treasuryBalance: number;
  interestForm: string;
  score: number;
  discord: string;
  daoDocument: string;
  createdAt: string;
  updatedAt: string;
  email: string;
};

export type ITracks = {
  id: number;
  name: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};
