import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { SearchIcon } from 'components/Icons';
import { useDAO, useVotes } from 'contexts';
import { FC } from 'react';

export const SearchProposalInput: FC = () => {
  const { searchProposal } = useVotes();
  const { theme } = useDAO();
  return (
    <Flex
      flexDir="column"
      maxW={{ base: 'full', md: '270px' }}
      flex="1"
      align="center"
    >
      <InputGroup alignItems="center" display="flex">
        <Input
          type="text"
          placeholder="Find a proposal"
          w="full"
          bg="transparent"
          onChange={event => searchProposal(event.target.value)}
          boxShadow={theme.card.shadow}
          color={theme.tokenHolders.delegations.card.columns.voting.input.text}
          borderRadius="4px"
          borderWidth="1px"
          borderStyle="solid"
          px="3"
          borderColor={
            theme.tokenHolders.delegations.card.columns.voting.input.border
          }
          _placeholder={{
            color:
              theme.tokenHolders.delegations.card.columns.voting.input
                .placeholder,
          }}
          _focusVisible={{
            borderColor:
              theme.tokenHolders.delegations.card.columns.voting.input.border,
          }}
          _hover={{}}
          fontSize="sm"
        />
        <InputRightElement pointerEvents="none">
          <SearchIcon
            boxSize="4"
            color={
              theme.tokenHolders.delegations.card.columns.voting.input.icon
            }
          />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
