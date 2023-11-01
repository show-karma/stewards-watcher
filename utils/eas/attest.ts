/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import {
  EAS,
  OffchainAttestationParams,
  SchemaEncoder,
  SchemaItem,
} from '@ethereum-attestation-service/eas-sdk';

const easContractAddr = '0x4200000000000000000000000000000000000021';

const mountSchemaItems = (schema: string): SchemaItem[] => {
  const schemaItems = schema.replace(/\s+/, ' ').split(',');
  return schemaItems.map(item => {
    const [type, name] = item.trim().split(' ');
    return {
      type,
      name,
      value: '',
    };
  });
};

const setSchemaValues = (
  schema: SchemaItem[],
  values: Record<string, number | string>
): SchemaItem[] =>
  Object.entries(schema).map(([key, item]) => {
    if (typeof item === 'object') {
      const { type } = item;
      if (type.includes('uint') && !Number.isNaN(+values[key])) {
        item.value = BigInt(+values[key]) || 0n;
      }
      item.value = values[key] || '';
    }
    return item;
  });

export interface ISchema {
  uid: string;
  signature: string;
  schema: SchemaItem[];
}

export async function attest(
  schema: ISchema,
  payload: Record<string, number | string>,
  signer: any,
  address: string
) {
  const encoder = new SchemaEncoder(schema.signature);
  const schemaData = setSchemaValues(
    mountSchemaItems(schema.signature),
    payload
  );
  const eas = new EAS(easContractAddr);
  const offChain = await eas.getOffchain();

  const attestation: OffchainAttestationParams = {
    data: encoder.encodeData(schemaData),
    recipient: address,
    expirationTime: 0n,
    revocable: true,
    refUID:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    schema: schema.uid,
    time: BigInt(Math.floor(Date.now() / 1000)),
    version: 1,
  };

  return offChain.signOffchainAttestation(attestation, signer);
}
