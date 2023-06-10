import { Button, ButtonProps, Flex } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { useDelegation, useMixpanel } from 'hooks';
import { convertHexToRGBA } from 'utils';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface IDelegateButton extends ButtonProps {
  delegated: string;
  text?: string;
  successEmitter?: () => void;
  beforeOnClick?: () => void;
}

export const DelegateButton: FC<IDelegateButton> = ({
  delegated,
  text = 'Delegate',
  successEmitter,
  beforeOnClick,
  ...props
}) => {
  const { openConnectModal, openChainModal, chain, connectIsOpen } =
    useWallet();
  const { isConnected } = useAccount();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { mixpanel } = useMixpanel();
  const { delegateOnToggle, delegateIsOpen } = useWallet();

  const [writeAfterAction, setWriteAfterAction] = useState(false);

  const { isLoading, write } = useDelegation({
    delegatee: delegated,
    onSuccessFunction: successEmitter,
  });
  const sameNetwork = chain?.id === config.DAO_CHAIN.id;

  useEffect(() => {
    if (isConnected && writeAfterAction && sameNetwork && !connectIsOpen) {
      setWriteAfterAction(false);
      delegateOnToggle();
    }
  }, [isConnected && writeAfterAction && sameNetwork && !connectIsOpen]);

  const handleCase = () => {
    mixpanel.reportEvent({
      event: 'delegateButtonClick',
    });
    beforeOnClick?.();

    if (config.DAO_DELEGATE_ACTION) {
      return config.DAO_DELEGATE_ACTION();
    }
    if (!isConnected) {
      setWriteAfterAction(true);
      return openConnectModal?.();
    }

    if (chain && !sameNetwork) {
      setWriteAfterAction(true);
      return openChainModal && openChainModal();
    }

    if (!delegateIsOpen) return delegateOnToggle();

    return write?.();
  };

  return config.DAO_DELEGATE_CONTRACT ? (
    <Button
      background={theme.branding}
      px={{ base: '3', sm: '4', md: '6' }}
      py={['3', '6']}
      h="10"
      fontSize={['sm', 'md']}
      fontWeight="medium"
      onClick={handleCase}
      _hover={{
        backgroundColor: convertHexToRGBA(theme.branding, 0.8),
      }}
      _focus={{}}
      _active={{}}
      disabled={isLoading}
      color={theme.buttonText}
      isLoading={isLoading}
      {...props}
    >
      <Flex gap="2">{text}</Flex>
    </Button>
  ) : null;
};
