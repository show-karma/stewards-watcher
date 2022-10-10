import { IDAOConfig, IDAOTheme } from 'types';
import { chain } from 'wagmi';

const config: IDAOConfig = {
  DAO: 'SSV Network',
  DAO_DESCRIPTION: `The Delegates of DAO play a vital role in driving the SSV Network ecosystem forward through their work in governance and workstreams.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency with health cards for each Delegate that display metrics and links on their involvement and engagement in the DAO.`,
  DAO_URL: 'https://ssv.network',
  GOVERNANCE_FORUM: 'https://forum.ssv.network',
  DAO_KARMA_ID: 'ssvnetwork',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/ssvnetwork/logo.svg',
  METATAGS: {
    TITLE: `Delegates of SSV Network DAO`,
    DESCRIPTION: `Find all the active delegates in SSV Network DAO along with governance stats across on-chain, off-chain, forum and discord.`,
    IMAGE: '/daos/ssvnetwork/meta.png',
    FAVICON: '/daos/ssvnetwork/favicon.png',
    URL: `https://ssvnetwork.showkarma.xyz`,
  },
  DAO_CHAIN: chain.mainnet,
  DAO_DELEGATE_CONTRACT: '',
  EXCLUDED_CARD_FIELDS: ['onChainVotesPct'],
};

const theme: IDAOTheme = {
  background: '#011627',
  card: '#0b2a3c',
  title: '#FFFFFF',
  subtitle: '#FFFFFF',
  text: '#FFFFFF',
  buttonText: '#FFFFFF',
  branding: '#1ba5f8',
};

const dao = { theme, config };

export default dao;
