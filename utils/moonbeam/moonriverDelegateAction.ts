// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract } from '@wagmi/core';
import { ethers } from 'ethers';
import { IDelegate } from 'types';
import ABI from 'resources/moonriver/ABI.json';
import { ITrackBadgeProps } from 'components/DelegationPool/TrackBadge';
import { moonriverActiveDelegatedTracks } from 'utils';
import { moonriverDigestUndelegate } from './moonriverUndelegateAction';

export interface IBulkDelegatePayload {
  delegator: string;
  delegate: IDelegate;
  amount: string;
  tracks: ITrackBadgeProps['track'][];
  conviction: number;
}

function digest(payload: IBulkDelegatePayload[]) {
  const abiInterface = new ethers.utils.Interface(ABI);
  const calldatas = payload.flatMap(item =>
    item.tracks.map(track =>
      abiInterface.encodeFunctionData('delegate', [
        track.id,
        item.delegate.address,
        item.conviction,
        ethers.utils.parseEther(parseFloat(item.amount).toString()),
      ])
    )
  );
  return calldatas;
}

async function prepareUndelegation(payload: IBulkDelegatePayload[]) {
  const trackIds = payload.flatMap(item => item.tracks.map(track => track.id));
  const activeTracks = await moonriverActiveDelegatedTracks(
    payload[0].delegator,
    'moonriver'
  );
  // Create undelegaion data for tracks that needs to be undelegated and unlocked before
  // delegating again
  return moonriverDigestUndelegate({
    delegate: payload[0].delegate.address,
    tracks: activeTracks.filter(track => trackIds.includes(+track.trackId)),
  });
}

export const moonriverDelegateAction =
  (
    batchContractAddr: `0x${string}`,
    delegateContract: `0x${string}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    batchContractAbi: any[],
    shouldUndelegate = false
  ) =>
  async (payload: IBulkDelegatePayload[], write: typeof writeContract) => {
    const calldatas = [];
    console.log({ shouldUndelegate, payload });

    if (shouldUndelegate) {
      calldatas.push(...(await prepareUndelegation(payload)));
    }

    // Concat delegation data
    calldatas.push(...digest(payload.filter(item => item.delegator)));

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
      gas: 11250000n,
      args,
    });

    return hash;
  };
