export type IFilterOrder = 'asc' | 'desc';
export type IFilterPeriod = 'lifetime' | '30d';
export type IFilterStat = string;
export interface IStatOptions {
  title: string;
  stat: IFilterStat;
}
