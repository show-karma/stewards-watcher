import { attest } from 'utils/eas/attest';
import { api } from 'helpers';
import { VotingReasonSchema } from './votign-reason-schema';

interface VotingReasonPayload {
  daoName: string;
  source: 'snapshot' | 'onchain' | 'tally' | 'offchain'; // find sources
  proposalId: string;
  title: string;
  votingReason: string;
  delegateAddress: string;
  [key: string]: string;
}

class AssertError extends Error {
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

  if (errors.length > 0) throw new AssertError(errors, 'VotingReasonPayload');
}

export async function saveVotingReason(
  payload: VotingReasonPayload,
  signer: any,
  address: string
) {
  assert(payload, VotingReasonSchema);

  const { uid } = VotingReasonSchema;
  if (typeof uid !== 'undefined') throw new Error('Missing schema UID');

  try {
    const attestation = await attest(
      VotingReasonSchema,
      payload,
      signer,
      address
    );

    await api.post('/delegates/voting-reason', attestation);
  } catch (error) {
    throw new Error("Couldn't save voting reason");
  }
}
