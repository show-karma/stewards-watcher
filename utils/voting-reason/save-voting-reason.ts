import { attest } from 'utils/eas/attest';
import { api } from 'helpers';
import { VotingReasonSchema } from './votign-reason-schema';

export interface VotingReasonPayload {
  daoName: string;
  source: 'snapshot' | 'onchain' | 'tally' | 'offchain'; // find sources
  proposalId: string;
  title: string;
  votingReason: string;
  delegateAddress: string;
  [key: string]: string;
}

export class AssertError extends Error {
  constructor(public readonly data: unknown, public readonly type?: string) {
    super('AssertError');
  }
}

function assert(
  payload: VotingReasonPayload,
  schema: typeof VotingReasonSchema
) {
  const errors = [];
  if (!payload.daoName) errors.push('Missing DAO name');
  if (!payload.source) errors.push('Missing source');
  if (!payload.proposalId) errors.push('Missing proposal ID');
  if (!payload.title) errors.push('Missing title');
  if (!payload.votingReason) errors.push('Missing voting reason');
  if (!payload.delegateAddress) errors.push('Missing delegate address');

  if (!schema.uid) errors.push('Missing schemaUID');

  if (errors.length > 0) throw new Error(errors.join(', '));
}

export async function saveVotingReason(
  payload: VotingReasonPayload,
  signer: any,
  address: string,
  daoName: string
) {
  if (typeof window === 'undefined')
    throw new Error('This function can only be called on the client side');
  // get cookies

  const cookie = document.cookie
    .split(';')
    .find(item => item.includes('karma_cookie-auth'));

  const token = cookie?.split('=')[1];
  if (!token) throw new Error('User not connected');

  assert(payload, VotingReasonSchema);

  try {
    const attestation = await attest(
      VotingReasonSchema,
      payload,
      signer,
      address
    );

    console.log({ attestation });

    await api.post(
      `/dao/${daoName}/delegates/voting-reason`,
      {
        ...payload,
        attestationUID: attestation.uid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log({ error });
    throw new Error("Couldn't save voting reason");
  }
}
