import { ButtonProps } from '@chakra-ui/react';
import { DelegateButton } from 'components/DelegateButton';
import { FC } from 'react';
import { useAccount } from 'wagmi';

interface IDelegateButtonProps extends ButtonProps {
  delegated: string;
  votes: string;
}

export const ModalDelegateButton: FC<IDelegateButtonProps> = props => {
  const { votes, delegated } = props;
  const { isConnected } = useAccount();

  return (
    <DelegateButton
      delegated={delegated}
      fontStyle="normal"
      fontWeight="700"
      fontSize="16px"
      color="#000000"
      bg="none"
      border="2px solid #000000"
      boxSizing="border-box"
      borderRadius="6px"
      width="100%"
      padding="12px 0"
      textTransform="none"
      disabled={isConnected && (votes === '0' || !votes)}
      isDisabled={isConnected && (votes === '0' || !votes)}
      _disabled={{
        border: '2px solid #adb8c0',
        backgroundColor: '#adb8c0',
        cursor: 'not-allowed',
        color: 'white',
      }}
      _hover={{}}
      _active={{}}
      _focus={{}}
      _focusVisible={{}}
      _focusWithin={{}}
    >
      Delegate
    </DelegateButton>
  );
};
