import { Button, ButtonProps, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import { useDAO, useWallet, useGovernanceVotes } from 'contexts';
import { useDelegation, useMixpanel } from 'hooks';
import { convertHexToRGBA } from 'utils';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface IDelegateButton extends ButtonProps {
  delegated: string;
  text?: string;
  successEmitter?: () => void;
  tooltipText?: string;
  beforeOnClick?: () => void;
}

export const DelegateButton: FC<IDelegateButton> = ({
  delegated,
  text = 'Delegate',
  successEmitter,
  tooltipText,

  beforeOnClick,
  ...props
}) => {
  const { openConnectModal, openChainModal, chain, connectIsOpen } =
    useWallet();
  const { isConnected } = useAccount();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { mixpanel } = useMixpanel();
  const { votes } = useGovernanceVotes();
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

    if (config.DAO_DELEGATE_MODE === 'custom' && config.DAO_DELEGATE_ACTION) {
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

  const buttonDefaultStyles: ButtonProps = {
    bgColor: theme.branding,
    px: ['4', '6'],
    py: ['3', '6'],
    height: '10',
    fontSize: ['md'],
    fontWeight: 'medium',
    onClick: handleCase,
    _hover: {
      backgroundColor: convertHexToRGBA(theme.branding, 0.8),
    },
    _focus: {},
    _active: {},
    disabled: isLoading,
    color: theme.buttonText,
  };

  if (config.DAO_DELEGATE_MODE === 'hidden') {
    return null;
  }

  return tooltipText && (props.disabled || props.isDisabled) ? (
    <Tooltip
      label="This delegate has indicated that they are no longer accepting delegations."
      bgColor={theme.collapse.bg || theme.card.background}
      color={theme.collapse.text}
    >
      <Flex>
        <Button isLoading={isLoading} {...buttonDefaultStyles} {...props}>
          <Flex gap="2">{text}</Flex>
        </Button>
      </Flex>
    </Tooltip>
  ) : (
    <Button isLoading={isLoading} {...buttonDefaultStyles} {...props}>
      <Flex gap="2">{text}</Flex>
    </Button>
  );
};
