/* eslint-disable no-shadow */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable id-length */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/no-extraneous-dependencies */

import {
  writeContract as writeFn,
  waitForTransaction,
  readContract as readFn,
  signMessage,
} from '@wagmi/core';
import { Hex } from 'types';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import { ethers } from 'ethers';
import ABI from './ABI.json';
import type { DelegateWithProfile, DelegateWithAddress } from './types';

enum TaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  WaitingForConfirmation = 'WaitingForConfirmation',
  Blacklisted = 'Blacklisted',
  Cancelled = 'Cancelled',
  NotFound = 'NotFound',
}

export class DelegateRegistryContract extends GelatoRelay {
  contract: ethers.Contract;

  constructor(readonly contractAddress: Hex) {
    super();
    this.contract = new ethers.Contract(contractAddress, ABI);
  }

  /**
   * Returns the r, s, v values of a signature
   * @param signature
   * @returns
   */
  private getRSV(signature: string) {
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    const v = `0x${signature.slice(130, 132)}`;
    return { r, s, v };
  }

  /**
   * Returns the nonce of a delegate
   * @param address
   * @returns
   */
  async getNonce(address: Hex) {
    const nonce = <bigint>await readFn({
      abi: ABI,
      address: this.contractAddress,
      functionName: 'nonces',
      args: [address],
    });

    return {
      nonce: Number(nonce),
      next: Number(nonce + 1n),
    };
  }

  /**
   * Waits for a transaction to be mined at Gelato Network
   * @param taskId
   * @returns
   */
  wait(taskId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const loop = async () => {
        while (1) {
          const status = await this.getTaskStatus(taskId);
          // print status :D so we can debug this for now
          console.log(status);
          if (!status) {
            reject(new Error('Transaction goes wrong.'));
            break;
          }
          if (status && status.taskState === TaskState.ExecSuccess) {
            resolve(status.transactionHash || '');
            break;
          } else if (
            [
              TaskState.Cancelled,
              TaskState.ExecReverted,
              TaskState.Blacklisted,
            ].includes(status?.taskState)
          ) {
            reject(new Error(status.lastCheckMessage));
            break;
          }

          await new Promise(r => setTimeout(r, 500));
        }
      };
      loop();
    });
  }

  /**
   * Executes a transaction on the DelegateRegistry contract
   * @param fn the function to call
   * @param args the arguments to pass to the function
   * @returns the transaction hash and a wait function to wait for the transaction to be mined
   */
  public async transaction(fn: string, args: unknown[]) {
    const { hash } = await writeFn({
      abi: ABI,
      address: this.contractAddress,
      functionName: fn,
      args,
    });
    return {
      hash,
      wait: () => waitForTransaction({ hash }),
    };
  }

  /**
   * Creates the payload for register delegate by signature
   * returning the payload
   * @param data
   * @returns
   */
  public async registerDelegate(
    address: Hex,
    data: DelegateWithProfile
  ): Promise<Parameters<GelatoRelay['sponsoredCall']>> {
    const signature = await signMessage({
      message: JSON.stringify(data),
    });

    const { r, s, v } = this.getRSV(signature);
    const { nonce } = await this.getNonce(address);

    const { data: payload } =
      await this.contract.populateTransaction.registerDelegateBySig(
        data.tokenAddress,
        data.tokenChainId,
        JSON.stringify(data.profile),
        nonce,
        Date.now(),
        v,
        r,
        s
      );

    if (!payload) throw new Error('Payload is undefined');

    return [
      {
        data: payload,
        chainId: 10,
        target: this.contractAddress,
      },
      '{apiKey}',
      {
        retries: 3,
      },
    ];
  }

  /**
   * Sends a sponsored call to the DelegateRegistry contract using GelatoRelay
   * @param payload
   * @returns
   */
  static async sendGelato(...params: Parameters<GelatoRelay['sponsoredCall']>) {
    const client = new this(params[0].target as Hex);
    const relayResponse = await client.sponsoredCall(...params);

    return {
      taskId: relayResponse.taskId,
      wait: () => client.wait(relayResponse.taskId),
    };
  }

  /**
   * Deregisters a delegate on the DelegateRegistry contract
   * @param tokenAddress
   * @param tokenChainId
   * @returns
   */
  public deregisterDelegate(tokenAddress: string, tokenChainId: number) {
    return this.transaction('deregisterDelegate', [tokenAddress, tokenChainId]);
  }

  /**
   * Returns a delegate from the DelegateRegistry contract
   * @param delegateAddress
   * @param tokenAddress
   * @param tokenChainId
   * @returns
   */
  public async getDelegate(
    delegateAddress: string,
    tokenAddress: string,
    tokenChainId: number
  ): Promise<DelegateWithAddress> {
    return <DelegateWithAddress>await readFn({
      abi: ABI,
      address: this.contractAddress,
      functionName: 'getDelegate',
      args: [delegateAddress, tokenAddress, tokenChainId],
    });
  }
}
