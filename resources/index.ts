import { IDAOInfo } from 'types';
import aave from './aave';
import op from './op';
import optimism from './optimism';
import pooltogether from './pooltogether';
import yamfinance from './yamfinance';
import ssvnetwork from './ssvnetwork';
import dydx from './dydx';
import dimo from './dimo';
import compound from './compound';
import gitcoin from './gitcoin';
import elementFinance from './element-finance';
import starknet from './starknet';
import developer from './developer';
import apecoin from './apecoin';
import safe from './safe';
import rocketpool from './rocketpool';
import moonriver from './moonriver';
import moonbeam from './moonbeam';
import moonbase from './moonbase';
import everclear from './everclear';
import arbitrum from './arbitrum';
import cowswap from './cowswap';
import snapshotABI from './contracts/snapshotABI.json';
import ERC20ABI from './contracts/ERC20_ABI.json';

interface ISupportedDAOs {
  [key: string]: IDAOInfo;
}

export const supportedDAOs: ISupportedDAOs = {
  gitcoin: {
    config: gitcoin.config,
    // switched light and dark because gitcoin have main theme as light
    light: gitcoin.dark,
    dark: gitcoin.light,
    DELEGATE_ABI: gitcoin.ABI,
    TOKEN_ABI: gitcoin.ABI,
  },
  safe: {
    config: safe.config,
    light: safe.light,
    dark: safe.dark,
    DELEGATE_ABI: snapshotABI,
    TOKEN_ABI: ERC20ABI,
  },
  dimo: {
    config: dimo.config,
    light: dimo.light,
    dark: dimo.dark,
    DELEGATE_ABI: dimo.ABI,
    TOKEN_ABI: dimo.ABI,
  },

  dydx: {
    config: dydx.config,
    light: dydx.light,
    dark: dydx.dark,
    DELEGATE_ABI: dydx.ABI,
    TOKEN_ABI: dydx.ABI,
  },
  everclear: {
    config: everclear.config,
    light: everclear.light,
    dark: everclear.dark,
    DELEGATE_ABI: everclear.ABI,
    TOKEN_ABI: everclear.ABI,
  },
  aave: {
    config: aave.config,
    light: aave.light,
    dark: aave.dark,
    DELEGATE_ABI: aave.ABI,
    TOKEN_ABI: aave.ABI,
  },
  op: {
    config: op.config,
    light: op.light,
    dark: op.dark,
    DELEGATE_ABI: op.ABI,
    TOKEN_ABI: op.ABI,
  },
  optimism: {
    config: optimism.config,
    light: optimism.light,
    dark: optimism.dark,
    DELEGATE_ABI: optimism.ABI,
    TOKEN_ABI: optimism.ABI,
  },
  pooltogether: {
    config: pooltogether.config,
    dark: pooltogether.dark,
    light: pooltogether.light,
    DELEGATE_ABI: pooltogether.ABI,
    TOKEN_ABI: pooltogether.ABI,
  },
  yamfinance: {
    config: yamfinance.config,
    dark: yamfinance.dark,
    light: yamfinance.light,
    DELEGATE_ABI: yamfinance.ABI,
    TOKEN_ABI: yamfinance.ABI,
  },
  ssvnetwork: {
    config: ssvnetwork.config,
    dark: ssvnetwork.dark,
    light: ssvnetwork.light,
    DELEGATE_ABI: snapshotABI,
    TOKEN_ABI: ERC20ABI,
  },
  apecoin: {
    config: apecoin.config,
    dark: apecoin.dark,
    light: apecoin.light,
    DELEGATE_ABI: snapshotABI,
    TOKEN_ABI: ERC20ABI,
  },
  element: {
    config: elementFinance.config,
    dark: elementFinance.dark,
    light: elementFinance.light,
    TOKEN_ABI: ERC20ABI,
  },
  starknet: {
    config: starknet.config,
    dark: starknet.dark,
    light: starknet.light,
    DELEGATE_ABI: snapshotABI,
    TOKEN_ABI: ERC20ABI,
  },
  developerdao: {
    config: developer.config,
    dark: developer.dark,
    light: developer.light,
    TOKEN_ABI: ERC20ABI,
  },
  rocketpool: {
    config: rocketpool.config,
    dark: rocketpool.dark,
    light: rocketpool.light,
    DELEGATE_ABI: snapshotABI,
    TOKEN_ABI: ERC20ABI,
  },
  moonriver: {
    config: moonriver.config,
    dark: moonriver.dark,
    light: moonriver.light,
    DELEGATE_ABI: [],
    TOKEN_ABI: ERC20ABI,
  },
  moonbeam: {
    config: moonbeam.config,
    dark: moonbeam.dark,
    light: moonbeam.light,
    DELEGATE_ABI: [],
    TOKEN_ABI: ERC20ABI,
  },
  moonbase: {
    config: moonbase.config,
    dark: moonbase.dark,
    light: moonbase.light,
    DELEGATE_ABI: [],
    TOKEN_ABI: ERC20ABI,
  },
  compound: {
    config: compound.config,
    light: compound.light,
    dark: compound.dark,
    DELEGATE_ABI: compound.ABI,
    TOKEN_ABI: compound.ABI,
  },
  arbitrum: {
    config: arbitrum.config,
    light: arbitrum.light,
    dark: arbitrum.dark,
    DELEGATE_ABI: arbitrum.ABI,
    TOKEN_ABI: arbitrum.ABI,
  },
  cowswap: {
    config: cowswap.config,
    dark: cowswap.dark,
    light: cowswap.light,
    TOKEN_ABI: ERC20ABI,
  },
};
