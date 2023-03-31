import { IDAOConfig, IDAOTheme } from 'types';
import { optimism } from 'wagmi/chains';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'Optimism',
  DAO_DESCRIPTION: `The Delegates of Optimism DAO play a vital role in driving the Optimism
  ecosystem forward through their work in governance.`,
  DAO_SUBDESCRIPTION: `This site helps token holders choose delegates and boost transparency by displaying delegate contribution to indicate their involvement in the DAO.`,
  DAO_URL: 'https://www.optimism.io',
  GOVERNANCE_FORUM: 'https://gov.optimism.io',
  DAO_KARMA_ID: 'optimism',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/optimism/logo.svg',
  METATAGS: {
    TITLE: `Delegates of Optimism DAO`,
    DESCRIPTION: `Find all the active delegates in Optimism DAO along with governance stats across on-chain/off-chain voting, forum and discord.`,
    IMAGE: '/daos/optimism/preview.png',
    FAVICON: '/daos/optimism/favicon.png',
    URL: `https://optimism.karmahq.xyz`,
  },
  DAO_CHAIN: optimism,
  DAO_DELEGATE_CONTRACT: '0x4200000000000000000000000000000000000042',
  DAO_DELEGATE_MODE: 'custom',
  DAO_FORUM_TYPE: 'discourse',
  DAO_GTAG: 'G-67LDHT697P',
  EXCLUDED_CARD_FIELDS: ['onChainVotesPct', 'healthScore', 'discordScore'],
};

const dark: IDAOTheme = {
  background: '#1C1D20',
  bodyBg: '#1C1D20',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: '#C80925',
  buttonText: '#FFFFFF',
  buttonTextSec: '#FFFFFF',
  headerBg: '#212328',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  collapse: { bg: '#2C2E32', text: '#FFFFFF', subtext: '#ADB8C0' },
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
    border: 'rgba(173, 184, 192, 0.2)',
    title: 'white',
    bg: '#222429',
    listBg: '#222429',
    listText: 'white',
    activeBg: '#2C2E32',
  },
  card: {
    icon: '#ADB8C0',
    background: '#222429',
    statBg: '#2C2E32',
    divider: 'rgba(173, 184, 192, 0.2)',
    text: { primary: '#FFFFFF', secondary: '#ADB8C0' },
    border: 'rgba(87, 93, 104, 0.25)',
    common: '#727B81',
    interests: { bg: 'rgba(255, 255, 255, 0.05)', text: '#ADB8C0' },
    workstream: { bg: '#FFFFFF', text: '#222429' },
    socialMedia: '#FFFFFF',
  },
  loginModal: {
    background: '#222429',
    text: '#FFFFFF',
    footer: { bg: '#2C2E32', text: '#FFFFFF' },
    button: {
      bg: '#C80925',
      text: 'white',
    },
  },
  modal: {
    background: '#222429',
    header: {
      border: '#ADB8C0',
      title: '#FFFFFF',
      subtitle: '#ADB8C0',
      twitter: '#ADB8C0',
      divider: 'rgba(173, 184, 192, 0.2)',
    },
    buttons: {
      selectBg: '#C80925',
      selectText: '#FFFFFF',
      navBg: '#34383f',
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
        bg: '#34383f',
      },
      modules: {
        chart: {
          point: '#FFFFFF',
          openGradient: '#666e7a',
          endGradient: '#34383f',
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
          selectedText: '#222429',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
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
        datasetColor: '#C80925BF',
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
  background: '#F2F4F9',
  bodyBg: '#F2F4F9',
  title: '#222429',
  subtitle: '#666666',
  text: '#222429',
  branding: '#C80925',
  buttonText: '#FFFFFF',
  buttonTextSec: '#222429',
  headerBg: '#FFFFFF',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  collapse: { bg: '#FFFFFF', text: '#2C2E32', subtext: '#212328' },
  hat: {
    text: {
      primary: '#212328',
      secondary: '#595A5E',
      madeBy: '#595A5E',
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
      bg: '#C80925',
      text: 'white',
    },
  },
  modal: {
    background: '#222429',
    header: {
      border: '#ADB8C0',
      title: '#FFFFFF',
      subtitle: '#ADB8C0',
      twitter: '#ADB8C0',
      divider: 'rgba(173, 184, 192, 0.2)',
    },
    buttons: {
      selectBg: '#C80925',
      selectText: '#FFFFFF',
      navBg: '#34383f',
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
        bg: '#34383f',
      },
      modules: {
        chart: {
          point: '#FFFFFF',
          openGradient: '#666e7a',
          endGradient: '#34383f',
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
          selectedText: '#222429',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
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

const dao = { dark, light, config, ABI };

export default dao;
