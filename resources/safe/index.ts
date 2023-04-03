import { IDAOConfig, IDAOTheme } from 'types';
import { mainnet } from 'wagmi/chains';

const config: IDAOConfig = {
  DAO: 'Safe',
  DAO_DESCRIPTION: `The Delegates of Safe DAO play a vital role in driving the Safe ecosystem forward through their work in governance and workstreams.`,
  DAO_SUBDESCRIPTION: `This site helps token holders choose delegates and boost transparency by displaying delegate contribution to indicate their involvement in the DAO.`,
  DAO_URL: 'https://safe.global',
  GOVERNANCE_FORUM: 'https://forum.safe.global',
  DAO_KARMA_ID: 'safe',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/safe/logo.svg',
  METATAGS: {
    TITLE: `Delegates of Safe DAO`,
    DESCRIPTION: `Find all the active delegates in Safe DAO along with governance stats across on-chain/off-chain voting, forum and discord.`,
    IMAGE: '/daos/safe/meta.png',
    FAVICON: '/daos/safe/favicon.png',
    URL: `https://safe.karmahq.xyz`,
  },
  DAO_CHAIN: mainnet,
  DAO_DEFAULT_SETTINGS: {
    TIMEPERIOD: 'lifetime',
    ORDERSTAT: 'karmaScore',
  },
  DAO_DELEGATE_CONTRACT: undefined,
  DAO_DELEGATE_MODE: 'snapshot',
  DAO_FORUM_TYPE: 'discourse',
  DAO_GTAG: 'G-67LDHT697P',
  EXCLUDED_CARD_FIELDS: [],
};

const dark: IDAOTheme = {
  logo: '/daos/safe/logo.svg',
  background: '#131413',
  bodyBg: '#131413',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#12FF80',
  buttonText: 'rgba(0, 0, 0, 0.87)',
  buttonTextSec: '#FFFFFF',
  headerBg: '#151615',
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
    bg: 'transparent',
    listBg: '#131413',
    listText: 'white',
    activeBg: 'rgba(102, 102, 102, 0.15)',
  },
  card: {
    icon: '#ADB8C0',
    background: 'linear-gradient(45deg,#1d1f1d,#002e1e)',
    statBg: 'rgba(102, 102, 102, 0.15)',
    divider: 'rgba(173, 184, 192, 0.2)',
    text: { primary: '#FFFFFF', secondary: '#ADB8C0' },
    border: '#403E4F',
    common: '#727B81',
    interests: { bg: 'rgba(255, 255, 255, 0.05)', text: '#ADB8C0' },
    workstream: { bg: '#FFFFFF', text: '#090B10' },
    socialMedia: '#FFFFFF',
  },
  loginModal: {
    background: '#131413',
    text: '#FFFFFF',
    footer: { bg: '#090B10', text: '#FFFFFF' },
    button: {
      bg: '#183AC5',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#131413',
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
        error: '#183AC5',
        bg: '#FFFFFF',
      },
      button: {
        disabled: {
          bg: '#F2F4F9',
          text: 'rgba(89, 90, 94, 0.5)',
        },
        normal: {
          bg: '#183AC5',
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
      selectBg: '#183AC5',
      selectText: '#FFFFFF',
      navBg: '#131413',
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
        bg: '#181e2b',
        icons: {
          for: 'green.300',
          against: 'red.500',
          abstain: 'gray.300',
          notVoted: 'gray.300',
          multiple: 'green.300',
        },
      },
      modules: {
        chart: {
          point: '#181e2b',
          openGradient: '#090B10',
          endGradient: '#181e2b',
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
          selectedText: '#090B10',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
  tokenHolders: {
    border: '#FFFFFF4D',
    bg: 'transparent',
    list: {
      text: {
        primary: '#FFFFFF',
        secondary: '#FFFFFF80',
      },
      bg: {
        primary: '#222429',
        secondary: '#22242940',
      },
    },
    delegations: {
      text: {
        primary: '#FFFFFF',
        secondary: '#ADB8C0',
        placeholder: {
          main: '#ADB8C0',
          comma: '#ADB8C0',
        },
      },
      chart: {
        point: '#FFFFFF',
        datasetColor: '#12FF80BF',
      },
      bg: {
        primary: '#222429',
        secondary: '#2C2E32',
        tertiary: '#FFFFFF20',
        quaternary: '#22242980',
      },
    },
  },
};

const light: IDAOTheme = {
  logo: '/daos/safe/logo_black.svg',
  background: '#F2F4F9',
  bodyBg: '#F2F4F9',
  title: '#090B10',
  subtitle: '#666666',
  text: '#090B10',
  branding: '#12FF80',
  buttonText: 'rgba(0, 0, 0, 0.87)',
  buttonTextSec: '#090B10',
  headerBg: '#151615',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  collapse: { bg: '#FFFFFF', subtext: '#212328', text: '#212328' },
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
    bg: 'transparent',
    listBg: '#F2F4F9',
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
    text: '#212328',
    background: '#FFFFFF',
    footer: { bg: '#EBEDEF', text: '#292E41' },
    button: {
      bg: '#183AC5',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#131413',
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
        error: '#183AC5',
        bg: '#FFFFFF',
      },
      button: {
        disabled: {
          bg: '#F2F4F9',
          text: 'rgba(89, 90, 94, 0.5)',
        },
        normal: {
          bg: '#183AC5',
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
      selectBg: '#183AC5',
      selectText: '#FFFFFF',
      navBg: '#131413',
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
        bg: '#181e2b',
        icons: {
          for: 'green.300',
          against: 'red.500',
          abstain: 'gray.300',
          notVoted: 'gray.300',
          multiple: 'green.300',
        },
      },
      modules: {
        chart: {
          point: '#181e2b',
          openGradient: '#090B10',
          endGradient: '#181e2b',
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
          selectedText: '#090B10',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
  tokenHolders: {
    border: '#21232833',
    bg: 'transparent',
    list: {
      text: {
        primary: '#212328',
        secondary: '#21232880',
      },
      bg: {
        primary: '#FFFFFF',
        secondary: '#ededef',
      },
    },
    delegations: {
      text: {
        primary: '#212328',
        secondary: '#292E41',
        placeholder: {
          main: '#ADB8C0',
          comma: '#ADB8C0',
        },
      },
      chart: {
        point: '#000000',
        datasetColor: '#dadadaBF',
      },
      bg: {
        primary: '#FFFFFF',
        secondary: '#EBEDEF',
        tertiary: '#dadada',
        quaternary: '#292E4180',
      },
    },
  },
};

const dao = { dark, light, config };

export default dao;
