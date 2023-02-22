import { Button, ButtonProps, Flex, Spinner } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { useDelegation, useMixpanel } from 'hooks';
import { convertHexToRGBA } from 'utils';
import { FC, useEffect, useState } from 'react';

interface IDelegateButton extends ButtonProps {
  delegated: string;
  text?: string;
  successEmitter?: () => void;
}

export const DelegateButton: FC<IDelegateButton> = ({
  delegated,
  text = 'Delegate',
  successEmitter,
  ...props
}) => {
  const { openConnectModal, openChainModal, isConnected, chain } = useWallet();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { mixpanel } = useMixpanel();

  const [writeAfterAction, setWriteAfterAction] = useState(false);

  const { isLoading, write } = useDelegation({
    delegatee: delegated,
    onSuccessFunction: successEmitter,
  });

  useEffect(() => {
    if (write && isConnected && writeAfterAction) {
      setWriteAfterAction(false);
      write();
    }
  }, [write && isConnected && chain?.id === config.DAO_CHAIN.id]);

  const handleCase = () => {
    mixpanel.reportEvent({
      event: 'delegateButtonClick',
    });

    if (config.DAO_DELEGATE_MODE === 'custom' && config.DAO_DELEGATE_ACTION) {
      return config.DAO_DELEGATE_ACTION();
    }

    if (!isConnected) {
      setWriteAfterAction(true);
      return openConnectModal && openConnectModal();
    }

    if (chain && chain.id !== config.DAO_CHAIN.id) {
      setWriteAfterAction(true);
      return openChainModal && openChainModal();
    }
    return write && write();
  };

  return config.DAO_DELEGATE_MODE !== 'hidden' ? (
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
  ) : null;
};
