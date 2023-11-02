/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import {
  EAS,
  OffChainAttestationVersion,
  Offchain,
  OffchainAttestationParams,
  SchemaEncoder,
  SchemaItem,
} from '@ethereum-attestation-service/eas-sdk';
import ethers from 'ethers';
import { getEASVersion } from './get-eas-version';

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
  Object.entries(schema).map(([, item]) => {
    if (typeof item === 'object') {
      const key = item.name;
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

const getOffchain = async (
  signer: ethers.providers.JsonRpcSigner
): Promise<Offchain> => {
  const eas = new EAS(easContractAddr);
  eas.connect(signer as any);

  return new Offchain(
    {
      address: easContractAddr,
      version:
        (await getEASVersion(eas.contract as any, easContractAddr)) || '1',
      chainId: BigInt(await signer.getChainId()),
    },
    OffChainAttestationVersion.Version1,
    eas
  );
};

export async function attest(
  schema: ISchema,
  payload: Record<string, number | string>,
  signer: ethers.providers.JsonRpcSigner & {
    signTypedData: typeof ethers.providers.JsonRpcSigner.prototype._signTypedData;
  },
  address: string
) {
  const encoder = new SchemaEncoder(schema.signature);
  const schemaData = setSchemaValues(
    mountSchemaItems(schema.signature),
    payload
  );
  signer.signTypedData = signer._signTypedData;

  const offChain = await getOffchain(signer);

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

  return offChain.signOffchainAttestation(attestation, signer as any);
}
