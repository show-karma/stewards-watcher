// eslint-disable-next-line import/no-extraneous-dependencies
import {
  EAS,
  SchemaEncoder,
  SchemaItem,
} from '@ethereum-attestation-service/eas-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SignerOrProvider } from '@ethereum-attestation-service/eas-sdk/dist/transaction';
import { Chain, arbitrum, optimism, optimismGoerli } from 'wagmi/chains';

//	'0xd1cae051a9cefb91904d32e591279f6bbb641bdf70ebfa42effa2054d0e94588'; // Sepolia Schema

/**
 * Attest an address
 * @param signer - Signer or provider
 * @param schema - Schema data
 * @param recipient - Recipient address
 * @param schemaUID - Schema UID
 */
export const attest = async (
  signer: SignerOrProvider,
  schema: SchemaItem[],
  recipient: string,
  schemaUID: string,
  EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e' // Sepolia Testnet v0.26
) => {
  try {
    const eas = new EAS(EASContractAddress);

    eas.connect(signer);
    const schemaStr = schema.map(item => `${item.type} ${item.name}`).join(',');
    const schemaEncoder = new SchemaEncoder(schemaStr);
    const encodedData = schemaEncoder.encodeData(schema);

    const data = {
      recipient,
      expirationTime: 0n,
      revocable: true,
      data: encodedData,
    };

    const tx = await eas.attest({
      schema: schemaUID,
      data,
    });

    const newAttestationUID = await tx.wait();
    return newAttestationUID;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const easDelegateEndorseDictionary: {
  [key: string]: {
    [key: string]: {
      chainId: number;
      easContract: string;
      schemaId: string;
      easAPI: string;
      chain: Chain;
    };
  };
} = {
  dev: {
    arbitrum: {
      chainId: 42161,
      easContract: '0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458',
      schemaId: process.env
        .NEXT_PUBLIC_ARBITRUM_EAS_ENDORSE_DELEGATE_UID as string,
      easAPI: 'https://arbitrum.easscan.org/graphql',
      chain: arbitrum,
    },
    // ARBITRUM GOERLI IS NOT READY YET
    // arbitrum: {
    // 	chainId: 42161,
    // 	easContract: '0xaEF4103A04090071165F78D45D83A0C0782c2B2a',
    // 	schemaId: process.env
    // 		.NEXT_PUBLIC_ARBITRUM_GOERLI_EAS_ENDORSE_DELEGATE_UID as string,
    // 	easAPI: 'https://arbitrum.easscan.org/graphql',
    // },
    optimism: {
      chainId: 420,
      easContract: '0x4200000000000000000000000000000000000021',
      schemaId: process.env
        .NEXT_PUBLIC_OPTIMISM_GOERLI_EAS_ENDORSE_DELEGATE_UID as string,
      easAPI: 'https://optimism-goerli-bedrock.easscan.org/graphql',
      chain: optimismGoerli,
    },
  },
  prod: {
    arbitrum: {
      chainId: 42161,
      easContract: '0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458',
      schemaId: process.env
        .NEXT_PUBLIC_ARBITRUM_EAS_ENDORSE_DELEGATE_UID as string,
      easAPI: 'https://arbitrum.easscan.org/graphql',
      chain: arbitrum,
    },
    optimism: {
      chainId: 10,
      easContract: '0x4200000000000000000000000000000000000021',
      schemaId: process.env
        .NEXT_PUBLIC_OPTIMISM_EAS_ENDORSE_DELEGATE_UID as string,
      easAPI: 'https://optimism.easscan.org/graphql',
      chain: optimism,
    },
  },
};

export const getEASChainInfo = (daoName: string) => {
  const projectEnvironment = process.env.NEXT_PUBLIC_ENV || 'dev';
  const formattedDaoName = daoName.toLowerCase().includes('arbitrum')
    ? 'arbitrum'
    : 'optimism';

  return easDelegateEndorseDictionary[projectEnvironment][formattedDaoName];
};
