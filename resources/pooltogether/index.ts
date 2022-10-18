import { IDAOConfig, IDAOTheme } from 'types';
import { chain } from 'wagmi';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'Pool Together',
  DAO_DESCRIPTION: `The Delegates of DAO play a vital role in driving the PoolTogether
  ecosystem forward through their work in governance and workstreams.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency with health cards for each Delegate that display metrics and links on their involvement and engagement in the DAO.`,
  DAO_URL: 'https://www.pooltogether.com',
  GOVERNANCE_FORUM: 'https://gov.pooltogether.com',
  DAO_KARMA_ID: 'pooltogether',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/pooltogether/logo.svg',
  METATAGS: {
    TITLE: `Delegates of PoolTogether DAO`,
    DESCRIPTION: `Find all the active delegates in PoolTogether DAO along with governance stats across on-chain, off-chain, forum and discord.`,
    IMAGE: '/daos/pooltogether/meta.png',
    FAVICON: '/daos/pooltogether/favicon.png',
    URL: `https://pooltogether.showkarma.xyz`,
  },
  DAO_CHAIN: chain.mainnet,
  DAO_DELEGATE_CONTRACT: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
  EXCLUDED_CARD_FIELDS: [],
  FEATURED_CARD_FIELDS: ['delegatedVotes', 'offChainVotesPct'],
};

// const theme: IDAOTheme = {
//   background: '#2D0B5A',
//   card: '#4C249F',
//   title: '#FFFFFF',
//   subtitle: '#a0aec0',
//   text: '#FFFFFF',
//   branding: '#3EF3D4',
//   buttonText: '#4C249F',
// };

const theme: IDAOTheme = {
  background: '#14171A',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#C80925',
  buttonText: '#FFFFFF',
  headerBg: '#212328',
  card: {
    icon: '#ADB8C0',
    background: '#222429',
    featureStatBg: 'rgba(102, 102, 102, 0.15)',
    divider: 'rgba(173, 184, 192, 0.2)',
    text: { primary: '#FFFFFF', secondary: '#ADB8C0' },
    border: '#403E4F',
  },
};

const dao = { theme, config, ABI };

export default dao;
