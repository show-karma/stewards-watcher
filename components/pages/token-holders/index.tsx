import { Flex } from '@chakra-ui/react';
import { TokenHolderDelegation } from './TokenHolderDelegations';
import { TopHoldersList } from './TopHoldersList';

export const TokenHolders = () => (
  <Flex flexDir="row" pb="20" w="full" maxW="1360px">
    <TopHoldersList />
    <TokenHolderDelegation />
  </Flex>
);
