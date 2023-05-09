import { mainnetProvider } from './ethers';

// This is a function that takes an address and returns the ENS name associated with it.
/*
	Example:
		addressToENSName('0x5a98fcbea516cf06857215779fd812ca3bef1b32')
		.then((ensName) => console.log(ensName));
		// 'vitalik.eth'
*/
export const addressToENSName = async (address: string) => {
  if (!address) return null;
  try {
    const provider = mainnetProvider;
    const ensName = await provider.lookupAddress(address);
    return ensName;
  } catch {
    return null;
  }
};
