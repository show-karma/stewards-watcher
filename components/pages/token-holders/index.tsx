import { Flex } from '@chakra-ui/react';
import { TokenHolderDelegation } from './TokenHolderDelegations';

export const TokenHolders = () => (
  <Flex flexDir="row" pb="20" w="full" maxW="1180px">
    <TokenHolderDelegation />
  </Flex>
);
