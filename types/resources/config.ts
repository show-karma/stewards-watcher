import { IFilterPeriod, IStatusOptions } from 'types/contexts';
import { Chain } from 'wagmi';
import { IChainRow } from 'types/IChainRow';
import { IForumType } from './forum';
import { IStats, IStatsID } from './stats';

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
    IMAGE: string;
    FAVICON: string;
    URL: string;
  };
  DAO_CHAIN: Chain;
  DAO_DELEGATE_CONTRACT?: `0x${string}`;
  DAO_TOKEN_CONTRACT?: {
    contractAddress: `0x${string}`;
    method: string;
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
      DEFAULT_STATUSES?: IStatusOptions[];
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
  DEFAULT_TOA?: string;
  SORT_OPTIONS?: IStats[];
  EXCLUDED_CARD_FIELDS: IStats[];
  ENABLE_DELEGATE_TRACKER?: boolean;
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
}
