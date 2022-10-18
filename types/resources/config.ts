import { Chain } from 'wagmi';

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
  EXCLUDED_CARD_FIELDS: string[];
  FEATURED_CARD_FIELDS: string[];
}
