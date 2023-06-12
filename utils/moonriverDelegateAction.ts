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
// delegateInterface = new ethers.utils.Interface(delegate_contract_abi)
// calldata = delegateInterface.encodeFunctionData("delegate", ['<track id'>, '<delegate address>', <conviction id>, amount])

function digest(payload: IBulkDelegatePayload[]) {
  const abiInterface = new ethers.utils.Interface(ABI);
  console.log('delegateContract', abiInterface);
  console.log('payload', payload);
  const calldatas = payload.flatMap(item =>
    item.tracks.map(track => {
      console.log('trackid', track.id);
      return abiInterface.encodeFunctionData('delegate', [
        track.id,
        item.delegate.address,
        0,
        ethers.utils.parseEther('1'),
      ]);
    })
  );
  return calldatas;
}

export const moonriverDelegateAction =
  (batchContractAddr: `0x${string}`, abi: any) =>
  async (payload: IBulkDelegatePayload[], write: typeof writeContract) => {
    console.log('payload', payload);
    console.log('batchContract', new ethers.utils.Interface(abi));
    const calldatas = digest(payload);
    console.log('calldatas', calldatas);

    // batchAll(['0x0000000000000000000000000000000000000812, '0x0000000000000000000000000000000000000812'], [], [calldata1, calldata2], [])

    const args = [
      new Array(calldatas.length).fill(
        '0x0000000000000000000000000000000000000812'
      ),
      [],
      calldatas,
      [],
    ];

    const { hash } = await write({
      address: batchContractAddr,
      abi,
      functionName: 'batchAll',
      args,
      mode: 'recklesslyUnprepared',
    });

    console.log(hash);
  };
