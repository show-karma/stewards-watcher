import { IDAOConfig, IDAOTheme } from 'types';
import { chain } from 'wagmi';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'Aave',
  DAO_DESCRIPTION: `The Delegates of Aave DAO play a vital role in driving the Aave ecosystem forward through their work in governance.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency by displaying delegate contribution to indicate their involvement and engagement in the DAO.`,
  DAO_URL: 'https://www.aave.com',
  GOVERNANCE_FORUM: 'https://governance.aave.com',
  DAO_KARMA_ID: 'aave',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/aave/logo.svg',
  METATAGS: {
    TITLE: `Delegates of Aave DAO`,
    DESCRIPTION: `Find all the active delegates in Aave DAO along with governance stats across on-chain, off-chain, forum and discord.`,
    IMAGE: '/daos/aave/preview.png',
    FAVICON: '/daos/aave/favicon.png',
    URL: `https://aave.showkarma.xyz`,
  },
  DAO_CHAIN: chain.mainnet,
  DAO_DELEGATE_CONTRACT: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  DAO_DELEGATE_MODE: 'custom',
  DAO_FORUM_TYPE: 'discourse',
  DAO_GTAG: 'G-67LDHT697P',
  EXCLUDED_CARD_FIELDS: [],
  FEATURED_CARD_FIELDS: ['delegatedVotes', 'offChainVotesPct'],
};

const dark: IDAOTheme = {
  background: '#1B2030',
  bodyBg: '#1B2030',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#6C1E6D',
  buttonText: '#FFFFFF',
  buttonTextSec: '#FFFFFF',
  headerBg: '#212328',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  hat: {
    text: {
      primary: '#FFFFFF',
      secondary: '#ADB8C0',
      madeBy: '#FFFFFF',
      lastUpdated: '#ADB8C0',
    },
  },
  filters: {
    head: '#ADB8C0',
    border: '#ADB8C033',
    title: 'white',
    bg: 'transparent',
    listBg: '#292E41',
    listText: 'white',
  },
  card: {
    icon: '#ADB8C0',
    background: '#292E41',
    featureStatBg: 'rgba(102, 102, 102, 0.15)',
    divider: 'rgba(173, 184, 192, 0.2)',
    text: { primary: '#FFFFFF', secondary: '#ADB8C0' },
    border: 'rgba(87, 93, 104, 0.25)',
    common: '#727B81',
  },
  modal: {
    background: '#292E41',
    header: {
      border: '#ADB8C0',
      title: '#FFFFFF',
      subtitle: '#ADB8C0',
      twitter: '#ADB8C0',
      divider: 'rgba(173, 184, 192, 0.2)',
    },
    buttons: {
      selectBg: '#6C1E6D',
      selectText: '#FFFFFF',
      navBg: 'transparent',
      navText: '#FFFFFF',
      navUnselectedText: '#ADB8C0',
      navBorder: '#FFFFFF',
    },
    statement: {
      headline: '#FFFFFF',
      text: '#ADB8C0',
      sidebar: {
        section: '#FFFFFF',
        subsection: '#FFFFFF',
        text: '#ADB8C0',
        item: {
          bg: 'transparent',
          text: '#FFFFFF',
          border: '#ADB8C0',
        },
      },
    },
    votingHistory: {
      headline: '#FFFFFF',
      divider: '#E6E6E6',
      proposal: {
        title: '#FFFFFF',
        type: '#ADB8C0',
        date: '#ADB8C0',
        result: '#FFFFFF',
        verticalDivider: 'rgba(173, 184, 192, 0.5)',
        divider: 'rgba(173, 184, 192, 0.2)',
        icons: {
          for: 'green.300',
          against: 'red.500',
          abstain: 'gray.300',
          notVoted: 'gray.300',
          multiple: 'green.300',
        },
      },
      reason: {
        title: '#FFFFFF',
        text: '#ADB8C0',
        divider: 'rgba(173, 184, 192, 0.2)',
      },
      navigation: {
        color: '#ADB8C0',
        buttons: {
          selectedBg: '#ADB8C0',
          selectedText: '#292E41',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
};

const light: IDAOTheme = {
  background: '#F2F4F9',
  bodyBg: '#F2F4F9',
  title: '#292E41',
  subtitle: '#666666',
  text: '#292E41',
  branding: '#6C1E6D',
  buttonText: '#FFFFFF',
  buttonTextSec: '#292E41',
  headerBg: '#212328',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  hat: {
    text: {
      primary: '#FFFFFF',
      secondary: '#ADB8C0',
      madeBy: '#292E41',
      lastUpdated: '#666666',
    },
  },
  filters: {
    head: '#666666',
    border: '#ADB8C033',
    title: '#666666',
    bg: 'transparent',
    listBg: '#FFFFFF',
    listText: '#666666',
  },
  card: {
    icon: '#ADB8C0',
    background: '#FFFFFF',
    featureStatBg: 'transparent',
    divider: 'rgba(102, 102, 102, 0.5)',
    text: { primary: '#212328', secondary: '#666666' },
    border: 'rgba(102, 102, 102, 0.5)',
    shadow: '-1px 1px 5px 0px rgba(87,93,104,0.75);',
    common: '#727B81',
  },
  modal: {
    background: '#292E41',
    header: {
      border: '#ADB8C0',
      title: '#FFFFFF',
      subtitle: '#ADB8C0',
      twitter: '#ADB8C0',
      divider: 'rgba(173, 184, 192, 0.2)',
    },
    buttons: {
      selectBg: '#6C1E6D',
      selectText: '#FFFFFF',
      navBg: 'transparent',
      navText: '#FFFFFF',
      navUnselectedText: '#ADB8C0',
      navBorder: '#FFFFFF',
    },
    statement: {
      headline: '#FFFFFF',
      text: '#ADB8C0',
      sidebar: {
        section: '#FFFFFF',
        subsection: '#FFFFFF',
        text: '#ADB8C0',
        item: {
          bg: 'transparent',
          text: '#FFFFFF',
          border: '#ADB8C0',
        },
      },
    },
    votingHistory: {
      headline: '#FFFFFF',
      divider: '#E6E6E6',
      proposal: {
        title: '#FFFFFF',
        type: '#ADB8C0',
        date: '#ADB8C0',
        result: '#FFFFFF',
        verticalDivider: 'rgba(173, 184, 192, 0.5)',
        divider: 'rgba(173, 184, 192, 0.2)',
        icons: {
          for: 'green.300',
          against: 'red.500',
          abstain: 'gray.300',
          notVoted: 'gray.300',
          multiple: 'green.300',
        },
      },
      reason: {
        title: '#FFFFFF',
        text: '#ADB8C0',
        divider: 'rgba(173, 184, 192, 0.2)',
      },
      navigation: {
        color: '#ADB8C0',
        buttons: {
          selectedBg: '#ADB8C0',
          selectedText: '#292E41',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
};

const dao = { dark, light, config, ABI };

export default dao;
