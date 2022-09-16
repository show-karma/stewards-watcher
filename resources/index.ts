import { IDAOInfo } from 'types';
import optimism from './optimism';
import pooltogether from './pooltogether';

interface ISupportedDAOs {
  [key: string]: IDAOInfo;
}

export const supportedDAOs: ISupportedDAOs = {
  optimism: {
    config: optimism.config,
    theme: optimism.theme,
    ABI: optimism.ABI,
  },
  pooltogether: {
    config: pooltogether.config,
    theme: pooltogether.theme,
    ABI: pooltogether.ABI,
  }
};
