export const customEverclear = {
  id: 25327, // Replace with actual Everclear chain ID
  name: 'Everclear',
  network: 'everclear',
  nativeCurrency: {
    decimals: 18,
    name: 'Everclear',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: {
      http: ['https://everclear.drpc.org'],
      webSocket: ['wss://everclear.drpc.org'],
    },
    default: {
      http: ['https://everclear.drpc.org'],
      webSocket: ['wss://everclear.drpc.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Everscout',
      url: 'https://scan.everclear.org/',
    },
    default: {
      name: 'Everscout',
      url: 'https://scan.everclear.org/',
    },
  },

  testnet: false,
};
