import { IDAOConfig } from './config';
import { IDAOTheme } from './theme';

export interface IDAOInfo {
  config: IDAOConfig;
  light: IDAOTheme;
  dark: IDAOTheme;
  ABI: any;
}
