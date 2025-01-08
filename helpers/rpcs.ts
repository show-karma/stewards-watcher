export const RPCS = {
  moonriver: 'https://moonriver.unitedbloc.com',
  moonbeam: 'https://rpc.api.moonbeam.network',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
  zksync: 'https://mainnet.era.zksync.io',
};

export const RPCS_WS: Record<string, `wss://${string}`> = {
  moonriver: 'wss://wss.api.moonriver.moonbeam.network',
  moonbeam: 'wss://wss.api.moonbeam.network',
  moonbase: 'wss://wss.api.moonbase.moonbeam.network',
  zksync: 'wss://zksync.drpc.org',
};
