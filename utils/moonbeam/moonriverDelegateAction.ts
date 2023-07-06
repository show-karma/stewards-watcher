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
        ethers.utils.parseEther((parseFloat(item.amount) - 0.1).toString()),
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
    const activeTracks = await moonriverActiveDelegatedTracks(
      payload[0].delegator,
      'moonriver'
    );

    const trackIds = payload.flatMap(item =>
      item.tracks.map(track => track.id)
    );
    console.log({
      activeTracks,
      trackIds,
    });

    // Create undelegaion data for tracks that needs to be undelegated and unlocked before
    // delegating again
    const calldatas = moonriverDigestUndelegate({
      delegate: payload[0].delegate.address,
      tracks: activeTracks.filter(track => trackIds.includes(+track.trackId)),
    })
      // Concat delegation data
      .concat(digest(payload.filter(item => item.delegator)));

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
