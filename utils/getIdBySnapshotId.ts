import { ethers } from 'ethers';

export const getIdBySnapshotId = (snapshotId: string) =>
  ethers.utils.formatBytes32String(snapshotId);
