import { Text } from '@chakra-ui/react';
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

  const {
    newInterests,
    newName,
    newStatement,
    newProfilePicture,
    setEditSaving,
    setIsEditing,
    saveEdit,
  } = useEditProfile();

  const { toast } = useToasty();

  const profile: DelegateProfile = useMemo(
    () => ({
      ipfsMetadata: null,
      name: newName || null,
      profilePictureUrl: newProfilePicture || '',
      statement: newStatement.value as string,
      interests: (newInterests.value as string[])?.join(',') || '',
      status: 'Active',
    }),
    [newInterests, newName, newProfilePicture, newStatement]
  );

  const sendSponoredTx = async () => {
    if (!isConnected || !address) {
      openConnectModal?.();
    }

    const {
      DELEGATE_REGISTRY_CONTRACT,
      DAO_DELEGATE_CONTRACT,
      ENABLE_ONCHAIN_REGISTRY,
    } = config;

    if (
      !(
        ENABLE_ONCHAIN_REGISTRY &&
        DELEGATE_REGISTRY_CONTRACT &&
        DAO_DELEGATE_CONTRACT
      )
    )
      return;

    const { ADDRESS: REGISTRY_CONTRACT, NETWORK } = DELEGATE_REGISTRY_CONTRACT;

    if (isConnected && address) {
      const contract = new DelegateRegistryContract(REGISTRY_CONTRACT);

      try {
        setEditSaving(true);
        const payload = await contract.registerDelegateBySig(address as Hex, {
          profile,
          tokenAddress: DAO_DELEGATE_CONTRACT,
          tokenChainId: NETWORK,
        });

        if (!payload) throw new Error('Something went wrong');

        const { data } = await axios.post<{ txId: string }>(
          '/api/sponsor',
          payload
        );

        const { txId } = data;
        // I'll let it here for confirmation (and debug) resaons
        // because we don't show the toast
        console.info('Transaction hash', { txId });
        saveEdit();
      } catch (err: any) {
        toast({
          title: 'Transaction failed',
          description: err.response?.data || err.message,
          status: 'error',
        });
        setEditSaving(false);
      }
    }
  };

  const handleOnClick = () => {
    sendSponoredTx();
  };

  return (
    <Text as="span" onClick={handleOnClick}>
      {title}
    </Text>
  );
};
