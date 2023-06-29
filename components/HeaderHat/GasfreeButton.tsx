import { Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useDAO, useEditProfile, useWallet } from 'contexts';
import { useToasty } from 'hooks';
import { useMemo } from 'react';
import { Hex } from 'types';
import { DelegateRegistryContract } from 'utils/delegate-registry/DelegateRegistry';
import { DelegateProfile } from 'utils/delegate-registry/types';

interface GasfreeButtonProps {
  title?: string;
}

export const GasfreeButton: React.FC<GasfreeButtonProps> = ({
  title = 'Save',
}) => {
  const { address, isConnected, openConnectModal } = useWallet();
  const {
    daoInfo: { config },
  } = useDAO();

  const { newInterests, newName, newStatement, newProfilePicture } =
    useEditProfile();

  const { toast } = useToasty();

  const profile: DelegateProfile = useMemo(
    () => ({
      ipfsMetadata: '',
      name: newName || '',
      profilePictureUrl: newProfilePicture || '',
      statement: newStatement.value as string,
      interests: newInterests.value as string[],
      status: 'Active',
    }),
    []
  );

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
          profile,
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

  return (
    <Text as="span" onClick={sendSponoredTx}>
      {title}
    </Text>
  );
};
