import { IDAOConfig, IDAOTheme } from 'types';
import { mainnet } from 'wagmi/chains';
import ABI from './ABI.json';

const config: IDAOConfig = {
  DAO: 'Connext',
  DAO_DESCRIPTION: `Connext delegates and members play a vital role in driving the ecosystem forward through their contributions to the community.`,
  DAO_SUBDESCRIPTION: `This dashboard will help scoring and tracking contributors by displaying community member engagements across the Connext DAO.`,
  DAO_URL: 'https://connext.network/',
  GOVERNANCE_FORUM: 'https://forum.connext.network/',
  DAO_KARMA_ID: 'connext',
  IMAGE_PREFIX_URL: 'https://cdn.stamp.fyi/avatar/eth:',
  DAO_LOGO: '/daos/connext/logo.png',
  METATAGS: {
    TITLE: `Delegates of Connext DAO`,
    DESCRIPTION: `Find all the active delegates in Connext DAO along with governance stats across on-chain/off-chain voting, forum and discord.`,
    IMAGE_DISCORD:
      'https://connext.karmahq.xyz/daos/connext/preview-discord.png',
    IMAGE_TWITTER:
      'https://connext.karmahq.xyz/daos/connext/preview-twitter.png',
    FAVICON: '/daos/connext/favicon.png',
    URL: `https://connext.karmahq.xyz`,
  },
  DAO_CHAIN: mainnet,
  DAO_TOKEN_CONTRACT: [
    {
      contractAddress: '0xFE67A4450907459c3e1FFf623aA927dD4e28c67a',
      method: 'balanceOf',
    },
  ],
  DAO_DELEGATE_CONTRACT: undefined,
  DAO_FORUM_TYPE: 'discourse',
  DAO_FORUM_URL: 'https://forum.connext.network/',
  DAO_GTAG: 'G-67LDHT697P',
  DAO_DEFAULT_SETTINGS: {
    FAQ: true,
    STATUS_FILTER: {
      DEFAULT_STATUS_SELECTED: ['active'],
      CUSTOM_STATUS: ['endorsed', 'active', 'inactive', 'withdrawn'],
    },
    ORDERSTAT: 'delegatedVotes',
    SORT_ORDER: [
      'delegatedVotes',
      'offChainVotesPct',
      'onChainVotesPct',
      'delegatorCount',
      'votingWeight',
      'forumScore',
      'karmaScore',
      'discordScore',
    ],
  },
  EXCLUDED_VOTING_HISTORY_COLUMN: [],
  EXCLUDED_CARD_FIELDS: ['healthScore'],
  ENABLE_DELEGATE_TRACKER: true,
  DAO_CATEGORIES_TYPE: 'workstreams',
  ENABLE_ONCHAIN_REGISTRY: true,
  DELEGATE_REGISTRY_CONTRACT: {
    ADDRESS: '0xd17206EC4D268D0E55bb08A369b6864f1178B81d',
    NETWORK: 10,
  },
};

const dark: IDAOTheme = {
  background: '#07080A',
  bodyBg: '#07080A',
  title: '#FFFFFF',
  subtitle: '#a0aec0',
  text: '#FFFFFF',
  branding:
    'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
  buttonText: '#FFFFFF',
  buttonTextSec: '#FFFFFF',
  headerBg: '#18191E',
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
    bg: '#18191E',
    listBg: '#18191E',
    listText: 'white',
    activeBg: '#07080A',
  },
  card: {
    icon: '#ADB8C0',
    background: '#18191E',
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
    background: '#18191E',
    text: '#FFFFFF',
    footer: { bg: 'rgba(102, 102, 102, 0.15)', text: '#FFFFFF' },
    button: {
      bg: 'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#18191E',
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
      selectBg:
        'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
      selectText: '#FFFFFF',
      navBg: '#34344c',
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
        bg: '#34344c',
      },
      modules: {
        chart: {
          point: '#FFFFFF',
          openGradient: '#5c5c84',
          endGradient: '#34344c',
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
          selectedText: '#18191E',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
  tokenHolders: {
    border: '#34383f',
    bg: '#07080A',
    stepsColor: '#59D6E0',
    list: {
      text: {
        primary: '#FFFFFF',
        secondary: '#ADB8C0',
      },
      bg: {
        primary: '#FFFFFF',
        secondary: '#34383f',
      },
    },
    delegations: {
      accordion: {
        button: {
          border: '#FFFFFF',
          text: '#FFFFFF',
          icon: '#FFFFFF',
        },
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#ADB8C0',
        input: {
          placeholder: '#88939F',
          text: '#FFFFFF',
        },
        button: '#FFFFFF',
      },
      border: {
        input: '#88939F',
      },
      input: {
        pillText: '#FFFFFFCC',
        pillBg: '#88939F33',
      },
      card: {
        header: {
          text: '#FFFFFFCC',
          pillText: '#FFFFFFCC',
          pillBg: '#88939F33',
        },
        legend: {
          text: '#F5F5F5',
          bg: '#07080A',
          pillText: '#F5F5F5',
          pillBg: '#18191E',
        },
        columns: {
          text: '#F5F5F5',
          icon: {
            bg: '#F0EBFA',
            text: '#34383f',
          },
          stats: {
            primary: '#F5F5F5',
            secondary: '#ADB8C0',
            leftBorder: '#59D6E0',
            border: '#DBDFE3',
          },
          voting: {
            total: '#ADB8C0',
            totalNumber: '#88939F',
            proposals: {
              title: '#F5F5F5',
              hyperlink: '#b3a1dd',
              description: '#ADB8C0',
              sort: {
                bg: '#18191E',
                border: '#FFFFFF',
                text: '#F5F5F5',
                label: '#ADB8C0',
              },
              vote: {
                iconBg: '#E1F7EA',
                text: '#F5F5F5',
                divider: '#88939F1A',
                reason: {
                  title: '#FFFFFF',
                  text: '#FFFFFF',
                },
              },
              navigation: {
                color: '#FFFFFF',
                buttons: {
                  selectedBg: '#FFFFFF',
                  selectedText: '#080A0E',
                  unSelectedBg: 'transparent',
                  unSelectedText: '#FFFFFF',
                },
              },
            },
            input: {
              placeholder: '#88939F',
              icon: '#4F5D6C',
              border: '#88939F',
              text: '#FFFFFF',
            },
          },
        },
      },
      bg: {
        primary: '#18191E',
        secondary: '#1B2030',
        tertiary:
          'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
      },
    },
  },
};

const light: IDAOTheme = {
  background: '#F2F4F9',
  bodyBg: '#F2F4F9',
  title: '#18191E',
  subtitle: '#666666',
  text: '#18191E',
  branding:
    'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
  buttonText: '#FFFFFF',
  buttonTextSec: '#18191E',
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
    logo: 'daos/connext/logo_black.svg',
    background: '#FFFFFF',
    text: '#212328',
    footer: { bg: '#EBEDEF', text: '#212328' },
    button: {
      bg: 'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#18191E',
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
      selectBg:
        'linear-gradient(90deg,#d86292,#ab00ff 50%,#29c1fc 100%,#d86292 100%,#d86292 100%,rgba(216,98,146,0))',
      selectText: '#FFFFFF',
      navBg: '#34344c',
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
        bg: '#34344c',
      },
      modules: {
        chart: {
          point: '#FFFFFF',
          openGradient: '#5c5c84',
          endGradient: '#34344c',
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
          selectedText: '#18191E',
          unSelectedBg: 'transparent',
          unSelectedText: '#ADB8C0',
        },
      },
    },
  },
  tokenHolders: {
    border: '#34383f',
    bg: '#F2F4F9',
    stepsColor: '#34383f',
    list: {
      text: {
        primary: '#FFFFFF',
        secondary: '#78828c',
      },
      bg: {
        primary: '#FFFFFF',
        secondary: '#34383f',
      },
    },
    delegations: {
      accordion: {
        button: {
          border: '#000000',
          text: '#000000',
          icon: '#000000',
        },
      },
      text: {
        primary: '#000000',
        secondary: '#78828c',

        input: {
          placeholder: '#88939F',
          text: '#080A0E',
        },
        button: '#FFFFFF',
      },
      border: {
        input: '#88939F',
      },
      input: {
        pillText: '#000000CC',
        pillBg: '#88939F33',
      },
      card: {
        header: {
          text: '#000000CC',
          pillText: '#000000CC',
          pillBg: '#88939F33',
        },
        legend: {
          text: '#4F5D6C',
          bg: '#F5F5F5',
          pillText: '#000000CC',
          pillBg: '#88939F33',
        },
        columns: {
          text: '#34383f',
          icon: {
            bg: '#F0EBFA',
            text: '#34383f',
          },
          stats: {
            primary: '#212328',
            secondary: '#4F5D6C',
            leftBorder: '#34383f',
            border: '#DBDFE3',
          },
          voting: {
            total: '#080A0E',
            totalNumber: '#88939F',
            proposals: {
              title: '#080A0E',
              hyperlink: '#4A269B',
              description: '#4F5D6C',
              sort: {
                bg: '#FFFFFF',
                border: '#88939F',
                text: '#88939F',
                label: '#4F5D6C',
              },
              vote: {
                iconBg: '#E1F7EA',
                text: '#4F5D6C',
                divider: '#88939F1A',
                reason: {
                  title: '#080A0E',
                  text: '#080A0E',
                },
              },
              navigation: {
                color: '#222429',
                buttons: {
                  selectedBg: '#222429',
                  selectedText: '#FFFFFF',
                  unSelectedBg: 'transparent',
                  unSelectedText: '#222429',
                },
              },
            },
            input: {
              placeholder: '#88939F',
              icon: '#4F5D6C',
              border: '#88939F',
              text: '#000000',
            },
          },
        },
      },
      bg: {
        primary: '#FFFFFF',
        secondary: '#222429',
        tertiary: '#222429',
      },
    },
  },
};

const dao = { dark, light, config, ABI };

export default dao;
