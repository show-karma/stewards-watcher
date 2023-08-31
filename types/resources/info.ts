import { IDAOConfig } from './config';
import { IDAOTheme } from './theme';

export interface IDAOInfo {
  config: IDAOConfig;
  light: IDAOTheme;
  dark: IDAOTheme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DELEGATE_ABI?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TOKEN_ABI: any;
}
