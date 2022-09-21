import { IDAOConfig, IDAOTheme } from 'types';
import { chain } from 'wagmi';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'Yam Finance',
  DAO_DESCRIPTION: `The Delegates of DAO play a vital role in driving the Yam Finance
  ecosystem forward through their work in governance and workstreams.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency with health cards for each Delegate that display metrics and links on their involvement and engagement in the DAO.`,
  DAO_URL: 'https://yam.finance/',
  GOVERNANCE_FORUM: 'https://forum.yam.finance',
  DAO_KARMA_ID: 'yamfinance',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/yamfinance/logo.png',
  METATAGS: {
    TITLE: `Delegates of Yam Finance DAO`,
    DESCRIPTION: `Find all the active delegates in Yam Finance DAO along with governance stats across on-chain, off-chain, forum and discord.`,
    IMAGE: '/daos/yamfinance/meta.png',
    FAVICON: '/daos/yamfinance/favicon.ico',
    URL: `https://yamfinance.showkarma.xyz`,
  },
  DAO_CHAIN: chain.mainnet,
  DAO_DELEGATE_CONTRACT: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
  EXCLUDED_CARD_FIELDS: [],
};

const theme: IDAOTheme = {
  background: '#F5F0F2',
  card: '#FFFFFF',
  cardShadow:
    'rgb(20 1 8 / 15%) -2px 2px 4px inset, rgb(255 255 255) 2px -2px 4px inset',
  title: '#140108',
  subtitle: '#615358',
  text: '#140108',
  branding: '#D1004D',
  buttonText: '#F5F0F2',
};

const dao = { theme, config, ABI };

export default dao;
