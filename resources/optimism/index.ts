import { IDAOConfig, IDAOTheme } from 'types';
import { chain } from 'wagmi';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'Optimism',
  DAO_DESCRIPTION: `The Delegates of Optimism DAO play a vital role in driving the Optimism
  ecosystem forward through their work in governance.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency by displaying delegate contribution to indicate their involvement and engagement in the DAO.`,
  DAO_URL: 'https://www.optimism.io',
  GOVERNANCE_FORUM: 'https://gov.optimism.io',
  DAO_KARMA_ID: 'optimism',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/optimism/logo.svg',
  METATAGS: {
    TITLE: `Delegates of Optimism DAO`,
    DESCRIPTION: `Find all the active delegates in PoolTogether DAO along with governance stats across off-chain, forum and discord.`,
    IMAGE: '/daos/optimism/meta.png',
    FAVICON: '/daos/optimism/favicon.png',
    URL: `https://optimism.showkarma.xyz`,
  },
  DAO_CHAIN: chain.optimism,
  DAO_DELEGATE_CONTRACT: '0x4200000000000000000000000000000000000042',
  EXCLUDED_CARD_FIELDS: ['onChainVotesPct'],
};

const theme: IDAOTheme = {
  background: '#14171A',
  card: '#1a1e23',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#ff0420',
  buttonText: '#FFFFFF',
};

const dao = { theme, config, ABI };

export default dao;
