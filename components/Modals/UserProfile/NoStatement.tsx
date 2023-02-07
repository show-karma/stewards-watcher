import { Button, Flex, Text } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { FC } from 'react';

export const NoStatement: FC = () => {
  const { theme } = useDAO();
  const { openConnectModal, isConnected } = useWallet();
  const connectAndAuthenticate = () => openConnectModal && openConnectModal();
  return (
    <Flex flexDir="column" w="full">
      <Text color="white" fontWeight="medium" fontSize="lg">
        No contributor statement
      </Text>
      <Text color="gray.400" fontWeight="normal" fontSize="md" w="full">
        Are you the owner of this address? To edit details and claim ownership
        you must hook up your wallet.
      </Text>

      {!isConnected && (
        <Button
          w="min-content"
          py="3"
          px="6"
          bgColor="white"
          color="black"
          mt="6"
          fontSize="md"
          fontWeight="semibold"
          _hover={{}}
          _active={{}}
          _focus={{}}
          _focusVisible={{}}
          _focusWithin={{}}
          onClick={connectAndAuthenticate}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};
