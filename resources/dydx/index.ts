import { IDAOConfig, IDAOTheme } from 'types';
import { onChainDyDxVotesProvider } from 'utils/onChainDyDxVotesProvider';
import { mainnet } from 'wagmi/chains';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'dYdX',
  DAO_DESCRIPTION: `dYdX delegates and members play a vital role in driving the ecosystem forward through their contributions to the community.`,
  DAO_SUBDESCRIPTION: `This dashboard will help scoring and tracking contributors by displaying community member engagements across the dYdX DAO.`,
  DAO_URL: 'https://dydx.foundation/',
  GOVERNANCE_FORUM: 'https://forums.dydx.community',
  DAO_KARMA_ID: 'dydx',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/dydx/logo.svg',
  METATAGS: {
    TITLE: `Delegates of dYdX DAO`,
    DESCRIPTION: `Find all the active delegates in dYdX DAO along with governance stats across on-chain/off-chain voting, forum and discord.`,
    IMAGE: '/daos/dydx/preview.png',
    FAVICON: '/daos/dydx/favicon.png',
    URL: `https://dydx.karmahq.xyz`,
  },
  DAO_CHAIN: mainnet,
  DAO_DELEGATE_CONTRACT: '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
  DAO_DELEGATE_MODE: 'custom',
  DAO_DELEGATE_ACTION: () =>
    typeof window !== 'undefined' &&
    window.open('https://dydx.vote/delegate', '_blank'),
  DAO_FORUM_TYPE: 'commonwealth',
  DAO_FORUM_URL: 'https://forums.dydx.community/',
  DAO_GTAG: 'G-67LDHT697P',
  EXCLUDED_CARD_FIELDS: ['healthScore'],
  DAO_DEFAULT_SETTINGS: {
    FAQ: true,
    STATUS_FILTER: {
      SHOW: true,
      DEFAULT_STATUSES: ['active', 'recognized'],
    },
    ORDERSTAT: 'karmaScore',
  },
  DAO_EXT_VOTES_PROVIDER: {
    onChain: onChainDyDxVotesProvider,
  },
};

const dark: IDAOTheme = {
  background: '#141424',
  bodyBg: '#141424',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#6966FF',
  buttonText: '#FFFFFF',
  buttonTextSec: '#FFFFFF',
  headerBg: '#232334',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  collapse: { text: '#FFFFFF', subtext: '#ADB8C0' },
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
    bg: '#232334',
    listBg: '#232334',
    listText: 'white',
    activeBg: '#141424',
  },
  card: {
    icon: '#ADB8C0',
    background: '#232334',
    statBg: 'rgba(102, 102, 102, 0.15)',
    divider: 'rgba(173, 184, 192, 0.2)',
    text: { primary: '#FFFFFF', secondary: '#ADB8C0' },
    border: 'rgba(87, 93, 104, 0.25)',
    common: '#727B81',
    interests: { bg: 'rgba(255, 255, 255, 0.05)', text: '#ADB8C0' },
    workstream: { bg: '#FFFFFF', text: '#222429' },
    socialMedia: '#FFFFFF',
  },
  loginModal: {
    background: '#232334',
    text: '#FFFFFF',
    footer: { bg: 'rgba(102, 102, 102, 0.15)', text: '#FFFFFF' },
    button: {
      bg: '#6966FF',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#232334',
    delegateTo: {
      bg: '#FFFFFF',
      userBg: '#FFFFFF',
      userShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      topBg: '#EBEDEF',
      text: '#212328',
      subtext: '#595A5E',
      input: {
        placeholder: '#595A5E',
        text: '#212328',
        dirtyBorder: '#212328',
        border: '#E6E6E6',
        error: '#C80925',
        bg: '#FFFFFF',
      },
      button: {
        disabled: {
          bg: '#F2F4F9',
          text: 'rgba(89, 90, 94, 0.5)',
        },
        normal: {
          bg: '#C80925',
          text: '#FFFFFF',
        },
        alternative: {
          bg: 'transparent',
          text: '#212328',
          border: '#595A5E',
        },
      },
    },
    header: {
      border: '#ADB8C0',
      title: '#FFFFFF',
      subtitle: '#ADB8C0',
      twitter: '#ADB8C0',
      divider: 'rgba(173, 184, 192, 0.2)',
    },
    buttons: {
      selectBg: '#6966FF',
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
          selectedText: '#232334',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
};

const light: IDAOTheme = {
  logo: 'daos/dydx/logo_black.svg',
  background: '#F2F4F9',
  bodyBg: '#F2F4F9',
  title: '#232334',
  subtitle: '#666666',
  text: '#232334',
  branding: '#6966FF',
  buttonText: '#FFFFFF',
  buttonTextSec: '#232334',
  headerBg: '#212328',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  collapse: { text: '#212328', subtext: '#212328', bg: '#FFFFFF' },
  hat: {
    text: {
      primary: '#FFFFFF',
      secondary: '#ADB8C0',
      madeBy: '#ADB8C0',
      lastUpdated: '#666666',
    },
  },
  filters: {
    head: '#666666',
    border: '#ADB8C033',
    title: '#666666',
    bg: '#FFFFFF',
    listBg: '#FFFFFF',
    listText: '#666666',
    activeBg: '#EBEDEF',
    shadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
  },
  card: {
    icon: '#ADB8C0',
    background: '#FFFFFF',
    statBg: '#EBEDEF',
    divider: 'rgba(102, 102, 102, 0.5)',
    text: { primary: '#212328', secondary: '#666666' },
    border: 'none',
    shadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    common: '#727B81',
    interests: { bg: '#EBEDEF', text: '#2C2E32' },
    workstream: { bg: '#595A5E', text: '#FFFFFF' },
    socialMedia: '#595A5E',
  },
  loginModal: {
    background: '#FFFFFF',
    text: '#212328',
    footer: { bg: '#EBEDEF', text: '#212328' },
    button: {
      bg: '#6966FF',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#232334',
    header: {
      border: '#ADB8C0',
      title: '#FFFFFF',
      subtitle: '#ADB8C0',
      twitter: '#ADB8C0',
      divider: 'rgba(173, 184, 192, 0.2)',
    },
    delegateTo: {
      bg: '#FFFFFF',
      userBg: '#FFFFFF',
      userShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      topBg: '#EBEDEF',
      text: '#212328',
      subtext: '#595A5E',
      input: {
        placeholder: '#595A5E',
        text: '#212328',
        dirtyBorder: '#212328',
        border: '#E6E6E6',
        error: '#C80925',
        bg: '#FFFFFF',
      },
      button: {
        disabled: {
          bg: '#F2F4F9',
          text: 'rgba(89, 90, 94, 0.5)',
        },
        normal: {
          bg: '#C80925',
          text: '#FFFFFF',
        },
        alternative: {
          bg: 'transparent',
          text: '#212328',
          border: '#595A5E',
        },
      },
    },
    buttons: {
      selectBg: '#6966FF',
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
          selectedText: '#232334',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
};

const dao = { dark, light, config, ABI };

export default dao;
