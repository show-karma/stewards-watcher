// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract } from '@wagmi/core';
import { ethers } from 'ethers';
import { IDelegate } from 'types';
import ABI from 'resources/moonriver/ABI.json';
import { ITrackBadgeProps } from 'components/DelegationPool/TrackBadge';

export interface IBulkDelegatePayload {
  delegate: IDelegate;
  amount: string;
  tracks: ITrackBadgeProps['track'][];
}

function digest(payload: IBulkDelegatePayload[]) {
  const abiInterface = new ethers.utils.Interface(ABI);
  const calldatas = payload.flatMap(item =>
    item.tracks.map(track =>
      abiInterface.encodeFunctionData('delegate', [
        track.id,
        item.delegate.address,
        0,
        ethers.utils.parseEther(item.amount),
      ])
    )
  );
  return calldatas;
}

export const moonriverDelegateAction =
  (
    batchContractAddr: `0x${string}`,
    delegateContract: `0x${string}`,
    batchContractAbi: any[]
  ) =>
  async (payload: IBulkDelegatePayload[], write: typeof writeContract) => {
    const calldatas = digest(payload);

    const args = [
      new Array(calldatas.length).fill(delegateContract),
      [],
      calldatas,
      [],
    ];

    const { hash } = await write({
      address: batchContractAddr,
      abi: batchContractAbi,
      functionName: 'batchAll',
      gas: BigInt(11250000),
      args,
    });

    return hash;
  };
