import { Button, Flex, Spinner } from '@chakra-ui/react';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { GENERAL, THEME } from 'configs';
import { useWallet } from 'contexts';
import { useDelegate } from 'hooks';
import { FC } from 'react';

interface IDelegateButton {
  delegated: string;
}

export const DelegateButton: FC<IDelegateButton> = ({ delegated }) => {
  const { openConnectModal, openChainModal, isConnected, chain } = useWallet();

  const { isLoading, write } = useDelegate(delegated);

  //   const { openAccountModal } = useAccountModal();

  const getButtonText = () => {
    if (!isConnected) {
      return 'Connect wallet';
    }
    if (chain && chain.id !== GENERAL.DAO_CHAIN.id) return 'Change network';
    return 'Delegate';
  };

  const handleCase = () => {
    if (!isConnected) {
      return openConnectModal && openConnectModal();
    }
    if (chain && chain.id !== GENERAL.DAO_CHAIN.id)
      return openChainModal && openChainModal();
    return write && write();
  };

  return (
    <Button
      bgColor={THEME.branding}
      fontSize="xl"
      px="6"
      py="6"
      fontWeight="medium"
      onClick={handleCase}
      _hover={{}}
      _focus={{}}
      _active={{}}
      disabled={isLoading}
    >
      <Flex gap="2">
        {isLoading && <Spinner />}
        {getButtonText()}
      </Flex>
    </Button>
  );
};
