import { BaseContract } from 'ethers';

const VERSION_ABI = [
  {
    inputs: [],
    name: 'VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const getEASVersion = async (
  contract: BaseContract,
  address: string
): Promise<string | undefined> => {
  const { provider } = contract;
  if (!provider) {
    throw new Error("provider wasn't set");
  }

  const legacyContract = new BaseContract(address, VERSION_ABI, provider);

  try {
    return await legacyContract.callStatic.VERSION();
  } catch {
    return undefined;
  }
};
