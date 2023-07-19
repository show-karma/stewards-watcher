import { ethers } from 'ethers';
import ABI from 'resources/moonriver/ABI.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract } from '@wagmi/core';
import { IActiveDelegatedTracks } from './moonriverOnChainProvider';

export interface IBulkUndelegatePayload {
  delegate: string;
  tracks: IActiveDelegatedTracks[];
}

function digest(payload: IBulkUndelegatePayload) {
  const abiInterface = new ethers.utils.Interface(ABI);
  const calldatas = payload.tracks.flatMap(track => {
    const array = [];
    if (track.active)
      array.push(
        abiInterface.encodeFunctionData('undelegate', [track.trackId])
      );

    // If is locked, unlock
    if (track.locked)
      array.push(
        // Create unlocks to match the difference between undelegate and unlocks
        ...new Array(track.locked)
          .fill(0)
          .map(() =>
            abiInterface.encodeFunctionData('unlock', [
              track.trackId,
              payload.delegate,
            ])
          )
      );

    return array;
  });
  return calldatas;
}

export function moonriverUndelegateAction(
  batchContractAddr: `0x${string}`,
  delegateContract: `0x${string}`,
  batchContractAbi: any[]
) {
  return async (
    payload: IBulkUndelegatePayload,
    write: typeof writeContract
  ) => {
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
      gas: BigInt(28250000),
      args,
    });

    return hash;
  };
}

export const moonriverDigestUndelegate = digest;
