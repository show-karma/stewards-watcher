import { IDAOConfig, IDAOTheme } from 'types';
import { mainnet } from 'wagmi/chains';

const config: IDAOConfig = {
  DAO: 'Developer DAO',
  DAO_DESCRIPTION: `The Stewards of Developer DAO play a vital role in driving the Developer ecosystem forward through their work in governance and workstreams.`,
  DAO_SUBDESCRIPTION: `This site will help boost transparency with health cards for each Steward that display metrics and links on their involvement and engagement in the DAO.`,
  DAO_URL: 'https://www.developerdao.com',
  GOVERNANCE_FORUM: 'https://forum.developerdao.com/',
  DAO_KARMA_ID: 'developerdao',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/developerdao/logo.svg',
  METATAGS: {
    TITLE: `Delegates of Developer DAO`,
    DESCRIPTION: `Find all the active delegates in Developer DAO along with governance stats across on-chain/off-chain voting, forum and discord.`,
    IMAGE: '/daos/developerdao/meta.png',
    FAVICON: '/daos/developerdao/favicon.png',
    URL: `https://developerdao.karmahq.xyz`,
  },
  DAO_CHAIN: mainnet,
  DAO_DELEGATE_CONTRACT: undefined,
  DAO_DELEGATE_MODE: 'hidden',
  DAO_FORUM_TYPE: 'discourse',
  DAO_GTAG: 'G-67LDHT697P',
  SHOULD_NOT_SHOW: 'statement',
  EXCLUDED_CARD_FIELDS: [
    'delegatorCount',
    'onChainVotesPct',
    'healthScore',
    'delegatedVotes',
    'votingWeight',
    'discordScore',
  ],
  DAO_DEFAULT_SETTINGS: {
    STATUS_FILTER: {
      DEFAULT_STATUSES: ['recognized'],
    },
  },
};

const dark: IDAOTheme = {
  background: 'black',
  bodyBg: 'black',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding: 'white',
  buttonText: 'black',
  buttonTextSec: '#FFFFFF',
  headerBg: 'rgba(255,255,255,0.06)',
  gradientBall: '#ADB8C0',
  themeIcon: '#ADB8C0',
  collapse: {
    text: '#FFFFFF',
    subtext: '#ADB8C0',
    bg: 'rgba(255,255,255,0.06)',
  },
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
    border: 'white',
    title: 'white',
    bg: 'transparent',
    listBg: 'black',
    listText: 'white',
    activeBg: 'rgba(102, 102, 102, 0.15)',
  },
  card: {
    icon: '#ADB8C0',
    background: 'black',
    statBg: 'rgba(102, 102, 102, 0.15)',
    divider: 'rgba(173, 184, 192, 0.2)',
    text: { primary: '#FFFFFF', secondary: '#ADB8C0' },
    border: '#403E4F',
    common: '#727B81',
    interests: { bg: 'rgba(255, 255, 255, 0.05)', text: '#ADB8C0' },
    workstream: { bg: '#FFFFFF', text: '#222429' },
    socialMedia: '#FFFFFF',
  },
  loginModal: {
    background: '#000001',
    text: '#FFFFFF',
    footer: { bg: '#090B10', text: '#FFFFFF' },
    button: {
      bg: 'white',
      text: 'black',
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
          for: '#FFFFFF',
          against: '#FFFFFF',
          abstain: '#FFFFFF',
          notVoted: '#FFFFFF',
          multiple: '#FFFFFF',
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
        primary: 'rgba(102, 102, 102, 0.15)',
        secondary: '#090B1080',
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
        datasetColor: '#0F0F0FBF',
      },
      bg: {
        primary: '#090B10',
        secondary: '#ADB8C033',
        tertiary: '#FFFFFF20',
        quaternary: '#090B1080',
      },
    },
  },
};

const light: IDAOTheme = {
  logo: 'daos/developerdao/logo_black.svg',
  background: '#F2F4F9',
  bodyBg: '#F2F4F9',
  title: '#222429',
  subtitle: '#666666',
  text: '#222429',
  branding: 'black',
  buttonText: '#FFFFFF',
  buttonTextSec: '#222429',
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
    background: '#FFFFFF',
    text: '#212328',
    footer: { bg: '#EBEDEF', text: '#212328' },
    button: {
      bg: 'white',
      text: 'black',
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
          for: '#FFFFFF',
          against: '#FFFFFF',
          abstain: '#FFFFFF',
          notVoted: '#FFFFFF',
          multiple: '#FFFFFF',
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
  },
  tokenHolders: {
    border: '#21232833',
    bg: 'transparent',
    list: {
      text: {
        primary: '#212328',
        secondary: '#2123284D',
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
