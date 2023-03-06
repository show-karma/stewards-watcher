import { IFilterPeriod, IStatusOptions } from 'types/contexts';
import { Chain } from 'wagmi';
import { IChainRow } from 'types/IChainRow';
import { IForumType } from './forum';
import { IStats } from './stats';

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
  DAO_DELEGATE_CONTRACT: string;
  DAO_DELEGATE_MODE: 'custom' | 'snapshot' | 'hidden';
  DAO_DELEGATE_ACTION?: () => void;
  DAO_FORUM_TYPE?: IForumType;
  DAO_FORUM_URL?: string;
  DAO_GTAG?: string;
  DAO_DEFAULT_SETTINGS?: {
    FAQ?: boolean;
    TIMEPERIOD?: IFilterPeriod;
    ORDERSTAT?: IStats;
    DISABLE_LOGIN?: boolean;
    STATUS_FILTER?: {
      SHOW: boolean;
      DEFAULT_STATUSES?: IStatusOptions[];
    };
  };
  SHOULD_NOT_SHOW?: 'statement' | 'stats';
  SORT_OPTIONS?: IStats[];
  EXCLUDED_CARD_FIELDS: IStats[];
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
