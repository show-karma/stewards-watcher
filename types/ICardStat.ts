import { IconType } from 'react-icons';

export interface ICardStat {
  title: string;
  icon: IconType;
  pct?: string;
  value: string;
  id: string;
  tooltipText?: string;
}
