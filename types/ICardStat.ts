import { IconType } from 'react-icons';
import { IStats } from './resources';

export interface ICardStat {
  title: string;
  icon: IconType;
  pct?: string;
  value: string;
  id: IStats;
  tooltipText?: string;
  statAction?: () => void;
}
