import { Button, ButtonProps, Flex, Spinner } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { useDelegation, useMixpanel } from 'hooks';
import { FC } from 'react';
import { convertHexToRGBA } from 'utils';

interface IDelegateButton extends ButtonProps {
  delegated: string;
  text?: string;
  successEmitter?: () => void;
}

export const DelegateButton: FC<IDelegateButton> = ({
  delegated,
  text = 'Delegate',
  ...props
}) => {
  const { openConnectModal, openChainModal, isConnected, chain } = useWallet();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { mixpanel } = useMixpanel();

  const { isLoading, write } = useDelegation({
    delegatee: delegated,
  });

  const handleCase = () => {
    mixpanel.reportEvent({
      event: 'delegateButtonClick',
    });

    if (!isConnected) {
      return openConnectModal && openConnectModal();
    }
    if (chain && chain.id !== config.DAO_CHAIN.id) {
      return openChainModal && openChainModal();
    }
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
      _hover={{
        backgroundColor: convertHexToRGBA(theme.branding, 0.8),
      }}
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
