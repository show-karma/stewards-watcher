import { IDAOInfo } from 'types';
import optimism from './optimism';
import pooltogether from './pooltogether';
import yamfinance from './yamfinance';
import ssvnetwork from './ssvnetwork';

interface ISupportedDAOs {
  [key: string]: IDAOInfo;
}

export const supportedDAOs: ISupportedDAOs = {
  optimism: {
    config: optimism.config,
    light: optimism.light,
    dark: optimism.dark,
    ABI: optimism.ABI,
  },
  pooltogether: {
    config: pooltogether.config,
    dark: pooltogether.dark,
    light: pooltogether.light,
    ABI: pooltogether.ABI,
  },
  yamfinance: {
    config: yamfinance.config,
    dark: yamfinance.dark,
    light: yamfinance.light,
    ABI: yamfinance.ABI,
  },
  ssvnetwork: {
    config: ssvnetwork.config,
    dark: ssvnetwork.dark,
    light: ssvnetwork.light,
    ABI: null,
  },
};
