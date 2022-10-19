import { Button, Flex, Spinner } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { useDelegate } from 'hooks';
import { FC } from 'react';

interface IDelegateButton {
  delegated: string;
}

export const DelegateButton: FC<IDelegateButton> = ({ delegated }) => {
  const { openConnectModal, openChainModal, isConnected, chain } = useWallet();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;

  const { isLoading, write } = useDelegate(delegated);

  const handleCase = () => {
    if (!isConnected) {
      return openConnectModal && openConnectModal();
    }
    if (chain && chain.id !== config.DAO_CHAIN.id)
      return openChainModal && openChainModal();
    return write && write();
  };

  return (
    <Button
      bgColor={theme.branding}
      px={['2', '6']}
      py={['2', '6']}
      h="10"
      fontSize={['sm', 'md']}
      fontWeight="medium"
      onClick={handleCase}
      _hover={{}}
      _focus={{}}
      _active={{}}
      disabled={isLoading}
      color={theme.buttonText}
    >
      <Flex gap="2">
        {isLoading && <Spinner />}
        Delegate
      </Flex>
    </Button>
  );
};
