import { Button, ButtonProps, Flex, Spinner } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { useDelegation } from 'hooks';
import { FC } from 'react';

interface IDelegateButton extends ButtonProps {
  delegated: string;
  text?: string;
}

export const DelegateButton: FC<IDelegateButton> = ({
  delegated,
  text = 'Delegate',
  ...props
}) => {
  const { openConnectModal, openChainModal, isConnected, chain } = useWallet();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;

  const { isLoading, write } = useDelegation({
    delegatee: delegated,
  });

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
      px={['4', '6']}
      py={['3', '6']}
      h="10"
      fontSize={['md']}
      fontWeight="medium"
      onClick={handleCase}
      _hover={{}}
      _focus={{}}
      _active={{}}
      disabled={isLoading}
      color={theme.buttonText}
      {...props}
    >
      <Flex gap="2">
        {isLoading && <Spinner />}
        {text}
      </Flex>
    </Button>
  );
};
