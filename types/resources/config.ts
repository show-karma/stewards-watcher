import { IFilterPeriod, IStatusOptions } from 'types/contexts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract } from '@wagmi/core';
import { Chain } from 'wagmi';
import { IChainRow } from 'types/IChainRow';
import { IConvictionOption, Hex } from 'types/votes';
import { jsonRpcProvider } from 'wagmi/dist/providers/jsonRpc';
import { IForumType } from './forum';
import { IStats, IStatsID } from './stats';
import { IVotingHistoryColumn } from './modal';
import { IForDelegates } from './header';
import { IActiveDelegatedTracks } from 'utils';

type JsonRpcProviderConfig = {
  rpc: (chain: Chain) => {
    http: string;
    webSocket?: string;
  } | null;
};

export interface IDAOConfig {
  DAO: string;
  DAO_DESCRIPTION: string;
  DAO_SUBDESCRIPTION: string;
  DAO_URL: string;
  GOVERNANCE_FORUM: string;
  DAO_KARMA_ID: string;
  DAO_LOGO: string;
  IMAGE_PREFIX_URL: string;
  METATAGS: {
    TITLE: string;
    DESCRIPTION: string;
    IMAGE_DISCORD?: string;
    IMAGE_TWITTER?: string;
    FAVICON: string;
    URL: string;
  };
  DAO_CHAIN: Chain;
  DAO_DELEGATE_CONTRACT?: `0x${string}`;
  DAO_TOKEN_CONTRACT?: {
    contractAddress: `0x${string}`;
    method: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ABI?: any;
  }[];
  DAO_DELEGATE_ACTION?: () => void;
  DAO_FORUM_TYPE?: IForumType;
  DAO_FORUM_URL?: string;
  DAO_DELEGATE_FUNCTION_ARGS?: string[];
  DAO_DELEGATE_FUNCTION?: string;
  DAO_GTAG?: string;
  HEADER_MARGIN?: boolean;
  DAO_DISCORD_CHANNEL?: string;
  DAO_DEFAULT_SETTINGS?: {
    FAQ?: boolean;
    TIMEPERIOD?: IFilterPeriod;
    ORDERSTAT?: IStats;
    DISABLE_LOGIN?: boolean;
    SORT?: IStatsID;
    STATUS_FILTER?: {
      CUSTOM_STATUS?: IStatusOptions[];
      DEFAULT_STATUS_SELECTED?: IStatusOptions[];
    };
    SORT_ORDER?: string[];
  };
  DAO_RESOURCES?: {
    title: string;
    url: string;
  }[];
  TOS_URL?: string;
  SHOULD_NOT_SHOW?: 'statement' | 'stats' | 'handles';
  DAO_SUPPORTS_TOA?: boolean;
  DAO_SUPPORTS_TOS?: boolean;
  DAO_STATUSES?: string[];
  DAO_CATEGORIES_TYPE: 'workstreams' | 'tracks';
  DEFAULT_TOA?: string;
  SORT_OPTIONS?: IStats[];
  EXCLUDED_CARD_FIELDS: IStats[];
  EXCLUDED_VOTING_HISTORY_COLUMN: IVotingHistoryColumn[];
  ENABLE_DELEGATE_TRACKER?: boolean;
  DELEGATION_ERRORS_DICTIONARY?: {
    [key: string]: string;
  };
  ALLOW_UNDELEGATE?: boolean;
  ALLOW_BULK_DELEGATE?: boolean;
  BULK_DELEGATE_MAXSIZE?: number;
  DISABLE_EMAIL_INPUT?: boolean;
  HIDE_FOR_DELEGATES?: IForDelegates[];
  PROPOSAL_LINK?: {
    onChain?: (proposalId: number | string, version?: string) => string;
    offChain?: (proposalId: number | string, version?: string) => string;
  };
  DELEGATION_CUSTOM_AMOUNT?: boolean;
  DELEGATION_CUSTOM_CONVICTION?: boolean;
  DELEGATION_CONVICTION_OPTIONS?: IConvictionOption[];
  ENABLE_ONCHAIN_REGISTRY?: boolean;
  ENABLE_PROXY_SUPPORT?: boolean;

  DELEGATE_REGISTRY_CONTRACT?: {
    NETWORK: number;
    ADDRESS: Hex;
  };
  TRACKS_DICTIONARY?: { [key: string]: { emoji: string; description: string } };
  // TODO: type anys
  GET_ACTIVE_DELEGATIONS_ACTION?: (
    address: string,
    daoName: string
  ) => Promise<IActiveDelegatedTracks[]>;
  /**
   * Defines a function to bulk delegate
   * @param payload
   * @param write
   * @returns tx hash
   */
  UNDELEGATE_ACTION?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
    write: typeof writeContract
  ) => Promise<`0x${string}`>;
  /**
   * Defines a function to bulk delegate
   * @param payload
   * @param write
   * @returns tx hash
   */
  BULK_DELEGATE_ACTION?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
    write: typeof writeContract
  ) => Promise<`0x${string}`>;
  GET_LOCKED_TOKENS_ACTION?: (address: Hex) => Promise<number>;
  /**
   * Defines a custom function to parse the votes with an external proposal provider.
   *
   *_initially used by DyDx_
   * @param votes
   */
  DAO_EXT_VOTES_PROVIDER?: {
    onChain?: (
      daoName: string | string[],
      address: string
    ) => Promise<IChainRow[]>;
    offChain?: (
      daoName: string | string[],
      address: string
    ) => Promise<IChainRow[]>;
  };
  // TODO change it from any
  // Had few issues w/ types, for now we'll leave it as any
  CUSTOM_RPC?: any;
}
