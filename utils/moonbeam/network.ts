export declare const moonbeam: {
  readonly id: 1284;
  readonly name: 'Moonbeam';
  readonly network: 'moonbeam';
  readonly nativeCurrency: {
    readonly decimals: 18;
    readonly name: 'GLMR';
    readonly symbol: 'GLMR';
  };
  readonly rpcUrls: {
    readonly public: {
      readonly http: readonly ['https://rpc.api.moonbeam.network'];
      readonly webSocket: readonly ['wss://wss.api.moonbeam.network'];
    };
    readonly default: {
      readonly http: readonly ['https://rpc.api.moonbeam.network'];
      readonly webSocket: readonly ['wss://wss.api.moonbeam.network'];
    };
  };
  readonly blockExplorers: {
    readonly default: {
      readonly name: 'Moonscan';
      readonly url: 'https://moonscan.io';
    };
    readonly etherscan: {
      readonly name: 'Moonscan';
      readonly url: 'https://moonscan.io';
    };
  };
  readonly contracts: {
    readonly multicall3: {
      readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11';
      readonly blockCreated: 609002;
    };
  };
  readonly testnet: false;
};
