import { Button } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { Hex } from 'types';
import { DelegateRegistryContract } from 'utils/delegate-registry/DelegateRegistry';

export const GasfreeButton: React.FC = () => {
  const { address, isConnected, openConnectModal } = useWallet();
  const {
    daoInfo: { config },
  } = useDAO();

  const sendSponoredTx = async () => {
    if (!isConnected || !address) {
      openConnectModal?.();
    }

    const { DELEGATE_REGISTRY_CONTRACT, DAO_DELEGATE_CONTRACT } = config;

    console.log({ DELEGATE_REGISTRY_CONTRACT, DAO_DELEGATE_CONTRACT });

    if (!(DELEGATE_REGISTRY_CONTRACT && DAO_DELEGATE_CONTRACT)) return;

    const { ADDRESS: REGISTRY_CONTRACT, NETWORK } = DELEGATE_REGISTRY_CONTRACT;

    if (isConnected && address) {
      const contract = new DelegateRegistryContract(REGISTRY_CONTRACT);

      try {
        const res = await contract.registerDelegate(address as Hex, {
          profile: {
            name: 'Gasfree',
            statement:
              '### Gasfree txn\n *No gas fee* with conditions: \n\t1 - Must be in our DB\n\t2 - Must be a delegate\n\t3 - Must sign this fancy message 😎',
            profilePictureUrl: 'https://www.reddit.com/user/NFT-GasFree/',
            status: 'Active',
            ipfsMetadata: '',
          },
          tokenAddress: DAO_DELEGATE_CONTRACT,
          tokenChainId: NETWORK,
        });

        await res.wait();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return <Button onClick={sendSponoredTx}>Gasfree Txn</Button>;
};
