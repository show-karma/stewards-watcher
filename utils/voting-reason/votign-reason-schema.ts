/* eslint-disable import/no-extraneous-dependencies */
import { SchemaItem } from '@ethereum-attestation-service/eas-sdk';
import { ISchema } from 'utils/eas/attest';

export const VotingReasonSchema: ISchema = {
  /**
   * Schema items
   * Used to set values and encode data
   */
  schema: <SchemaItem[]>[
    {
      type: 'string',
      name: 'daoName',
      value: '',
    },
    {
      type: 'string',
      name: 'source',
      value: '',
    },
    {
      type: 'string',
      name: 'proposalId',
      value: '',
    },
    {
      type: 'string',
      name: 'title',
      value: '',
    },
    {
      type: 'string',
      name: 'votingReason',
      value: '',
    },
    {
      type: 'address',
      name: 'delegateAddress',
      value: '',
    },
  ],
  /**
   * Schema signature
   */
  signature:
    'string daoName,string source,string proposalId,string title,string votingReason,address delegateAddress',
  /**
   * Schema UID
   */
  uid: process.env.NEXT_APP_VOTING_REASON_SCHEMA_UID || '',
};
