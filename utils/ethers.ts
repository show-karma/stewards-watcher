import { ethers } from 'ethers';

export const formatEther = (wei: ethers.BigNumberish) =>
  ethers.utils.formatEther(wei);

export const mainnetProvider = new ethers.providers.AlchemyProvider(
  'homestead',
  process.env.NEXT_PUBLIC_ALCHEMY_KEY
);
