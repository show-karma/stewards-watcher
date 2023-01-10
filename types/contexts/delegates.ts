export type IFilterOrder = 'asc' | 'desc';
export type IFilterPeriod = 'lifetime' | '30d' | '180d';
export type IFilterStat = string;
export interface IStatOptions {
  title: string;
  stat: IFilterStat;
}

export interface IVoteInfo {
  snapshotIds: string | string[];
  onChainId: string;
}

export type IStatusOptions = 'active' | 'inactive' | 'withdrawn' | 'recognized';
