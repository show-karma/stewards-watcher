import { ethers } from 'ethers';

export const formatEther = (wei: ethers.BigNumberish) =>
  ethers.utils.formatEther(wei);
