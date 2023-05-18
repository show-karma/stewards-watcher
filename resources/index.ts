import { IDAOInfo } from 'types';
import aave from './aave';
import op from './op';
import optimism from './optimism';
import pooltogether from './pooltogether';
import yamfinance from './yamfinance';
import ssvnetwork from './ssvnetwork';
import dydx from './dydx';
import dimo from './dimo';
import gitcoin from './gitcoin';
import elementFinance from './element-finance';
import starknet from './starknet';
import developer from './developer';
import apecoin from './apecoin';
import safe from './safe';

interface ISupportedDAOs {
  [key: string]: IDAOInfo;
}

export const supportedDAOs: ISupportedDAOs = {
  gitcoin: {
    config: gitcoin.config,
    light: gitcoin.light,
    dark: gitcoin.dark,
    ABI: gitcoin.ABI,
  },
  safe: {
    config: safe.config,
    light: safe.light,
    dark: safe.dark,
    ABI: null,
    TOKENABI: safe.TOKENABI,
  },
  dimo: {
    config: dimo.config,
    light: dimo.light,
    dark: dimo.dark,
    ABI: dimo.ABI,
  },
  dydx: {
    config: dydx.config,
    light: dydx.light,
    dark: dydx.dark,
    ABI: dydx.ABI,
  },
  aave: {
    config: aave.config,
    light: aave.light,
    dark: aave.dark,
    ABI: aave.ABI,
  },
  op: {
    config: op.config,
    light: op.light,
    dark: op.dark,
    ABI: op.ABI,
  },
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
    TOKENABI: ssvnetwork.TOKENABI,
  },
  apecoin: {
    config: apecoin.config,
    dark: apecoin.dark,
    light: apecoin.light,
    ABI: null,
    TOKENABI: apecoin.TOKENABI,
  },
  element: {
    config: elementFinance.config,
    dark: elementFinance.dark,
    light: elementFinance.light,
    ABI: null,
  },
  starknet: {
    config: starknet.config,
    dark: starknet.dark,
    light: starknet.light,
    ABI: null,
    TOKENABI: starknet.TOKENABI,
  },
  developerdao: {
    config: developer.config,
    dark: developer.dark,
    light: developer.light,
    ABI: null,
  },
};
