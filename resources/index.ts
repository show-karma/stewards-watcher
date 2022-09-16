import { IDAOInfo } from 'types';
import optimism from './optimism';

interface ISupportedDAOs {
  [key: string]: IDAOInfo;
}

export const supportedDAOs: ISupportedDAOs = {
  optimism: {
    config: optimism.config,
    theme: optimism.theme,
    ABI: optimism.ABI,
  },
};
