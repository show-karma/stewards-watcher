import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { GasfreeButton } from 'components/HeaderHat/GasfreeButton';
import { useDAO } from 'contexts';
import { useState } from 'react';
import { convertHexToRGBA } from 'utils';

interface SelectSavingMethodProps {
  onSubmit: (method: 'on-chain' | 'off-chain') => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const SelectSavingMethod: React.FC<SelectSavingMethodProps> = ({
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { theme } = useDAO();
  const [method, setMethod] = useState<'on-chain' | 'off-chain'>('on-chain');

  return (
    <Flex>
      <Box cursor="pointer" onClick={() => setMethod('on-chain')}>
        {method === 'on-chain' && '->'} Method1
      </Box>
      <Box cursor="pointer" onClick={() => setMethod('off-chain')}>
        {method === 'off-chain' && '->'} Method2
      </Box>
      <Button variant="link" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        background={theme.branding}
        px={['4', '6']}
        py={['3', '6']}
        h="10"
        fontSize={['md']}
        fontWeight="medium"
        onClick={() => () => onSubmit(method)}
        _hover={{
          backgroundColor: convertHexToRGBA(theme.branding, 0.8),
        }}
        _focus={{}}
        _active={{}}
        color={theme.buttonText}
      >
        <Flex gap="2" align="center">
          {isLoading && <Spinner />}
          {method === 'on-chain' ? <GasfreeButton title="Save" /> : 'Save'}
        </Flex>
      </Button>
    </Flex>
  );
};
