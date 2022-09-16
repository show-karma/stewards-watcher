import { chain } from 'wagmi';
import ABI from './ABI.json';

const config = {
  DAO: 'Pool Together',
  DAO_DESCRIPTION: `The Delegates of DAO play a vital role in driving the PoolTogether
  ecosystem forward through their work in governance and workstreams.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency with health cards for each Delegate that display metrics and links on their involvement and engagement in the DAO.`,
  DAO_URL: 'https://www.pooltogether.com',
  GOVERNANCE_FORUM: 'https://gov.pooltogether.com',
  DAO_KARMA_ID: 'pooltogether',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: 'https://pooltogether.com/_next/static/media/pooltogether-logo.81dff880.svg',
  METATAGS: {
    TITLE: `Delegates of PoolTogether DAO`,
    DESCRIPTION: `Find all the active delegates in PoolTogether DAO along with governance stats across on-chain, off-chain, forum and discord.`,
    IMAGE: '/daos/optimism/meta.png',
    FAVICON: '/daos/optimism/favicon.ico',
    URL: `https://watcher.optimism.io`,
  },
  DAO_CHAIN: chain.mainnet,
  DAO_DELEGATE_CONTRACT: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
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
