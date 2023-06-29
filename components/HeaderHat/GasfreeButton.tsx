import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { useDAO, useWallet } from 'contexts';
import { useToasty } from 'hooks';
import { Hex } from 'types';
import { DelegateRegistryContract } from 'utils/delegate-registry/DelegateRegistry';

interface GasfreeButtonProps {
  profile: {
    name: string;
    statement: string;
    profilePictureUrl: string;
    status: 'Active' | 'Withdrawn' | 'Pending';
    ipfsMetadata: string;
  };
}

export const GasfreeButton: React.FC<GasfreeButtonProps> = ({ profile }) => {
  const { name, statement, profilePictureUrl, status, ipfsMetadata } = profile;
  const { address, isConnected, openConnectModal } = useWallet();
  const {
    daoInfo: { config },
  } = useDAO();

  const { toast } = useToasty();

  const sendSponoredTx = async () => {
    if (!isConnected || !address) {
      openConnectModal?.();
    }

    const { DELEGATE_REGISTRY_CONTRACT, DAO_DELEGATE_CONTRACT } = config;

    if (!(DELEGATE_REGISTRY_CONTRACT && DAO_DELEGATE_CONTRACT)) return;

    const { ADDRESS: REGISTRY_CONTRACT, NETWORK } = DELEGATE_REGISTRY_CONTRACT;

    if (isConnected && address) {
      const contract = new DelegateRegistryContract(REGISTRY_CONTRACT);

      try {
        const res = await contract.registerDelegate(address as Hex, {
          profile: {
            name,
            statement,
            profilePictureUrl,
            status,
            ipfsMetadata,
          },
          tokenAddress: DAO_DELEGATE_CONTRACT,
          tokenChainId: NETWORK,
        });

        if (!res) throw new Error('Something went wrong');

        const { data } = await axios.post<{ txId: string }>(
          '/api/sponsor',
          res
        );
        toast({
          title: 'Transaction sent',
          description: `Transaction sent successfully. TxId: ${data.txId}`,
          status: 'success',
        });
      } catch (err: any) {
        toast({
          title: 'Transaction failed',
          description: err.response?.data || err.message,
          status: 'error',
        });
      }
    }
  };

  return <Button onClick={sendSponoredTx}>Gasfree Txn</Button>;
};
