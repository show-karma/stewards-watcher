import { Wallet } from '@rainbow-me/rainbowkit';
import { TalismanConnector } from '@talismn/wagmi-connector';
import { Chain } from 'wagmi';

export interface TalismanWalletOptions {
  chains: Chain[];
  shimDisconnect?: boolean;
}

export const talismanWallet = ({
  chains,
  shimDisconnect,
}: TalismanWalletOptions): Wallet => ({
  id: 'talisman',
  name: 'Talisman',
  iconUrl: '/wallets/talisman.png',
  iconBackground: '#D5FF5C',
  downloadUrls: {
    browserExtension: 'https://talisman.xyz/download',
  },
  createConnector: () => {
    const connector = new TalismanConnector({
      chains,
      options: {
        shimDisconnect,
      },
    });

    return {
      connector,
    };
  },
});
