import { chain } from 'wagmi';
import ABI from './ABI.json';

const config = {
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
    TITLE: `Optimism's Delegates Watcher`,
    DESCRIPTION: `Delegates Watcher made by Optimism`,
    IMAGE: '/daos/optimism/meta.png',
    FAVICON: '/daos/optimism/favicon.png',
    URL: `https://watcher.optimism.io`,
  },
  DAO_CHAIN: chain.optimism,
  DAO_DELEGATE_CONTRACT: '0x4200000000000000000000000000000000000042',
};

const theme = {
  background: '#14171A',
  card: '#1a1e23',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#ff0420',
  buttonText: '#FFFFFF',
};

const optimism = { theme, config, ABI };

export default optimism;
