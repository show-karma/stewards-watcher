export const customGnosis = {
  id: 100,
  name: 'Gnosis',
  network: 'gnosischain',
  nativeCurrency: {
    decimals: 18,
    name: 'Gnosis',
    symbol: 'xDAI',
  },
  rpcUrls: {
    public: {
      http: ['https://rpc.gnosis.gateway.fm'],
      webSocket: ['wss://rpc.gnosischain.com/wss'],
    },
    default: {
      http: ['https://rpc.gnosis.gateway.fm'],
      webSocket: ['wss://rpc.gnosischain.com/wss'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Gnosisscan',
      url: 'https://gnosisscan.io/',
    },
    default: {
      name: 'Gnosis Chain Explorer',
      url: 'https://blockscout.com/xdai/mainnet/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
      blockCreated: 21022491,
    },
  },

  testnet: false,
};
