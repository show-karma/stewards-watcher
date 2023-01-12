import { IFilterPeriod, IFilterStat } from 'types/contexts';
import { Chain } from 'wagmi';
import { IChainRow } from 'types/IChainRow';
import { IForumType } from './forum';

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
  DAO_DELEGATE_MODE: 'custom' | 'snapshot';
  DAO_DELEGATE_ACTION?: () => void;
  DAO_FORUM_TYPE?: IForumType;
  DAO_GTAG?: string;
  DAO_DEFAULT_SETTINGS?: {
    TIMEPERIOD?: IFilterPeriod;
    KARMA_SCORE?: boolean;
    ORDERSTAT?: IFilterStat;
    STATUS_FILTER?: boolean;
  };
  EXCLUDED_CARD_FIELDS: string[];
  FEATURED_CARD_FIELDS: string[];
  /**
   * Defines a custom function to parse the votes with an external proposal provider.
   *
   *_initially used by DyDx_
   * @param votes
   */
  DAO_EXT_VOTES_PROVIDER?: {
    onChain?: (votes: IChainRow[]) => Promise<IChainRow[]>;
    offChain?: (votes: IChainRow[]) => Promise<IChainRow[]>;
  };
}
