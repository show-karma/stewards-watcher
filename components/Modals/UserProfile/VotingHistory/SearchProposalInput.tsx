import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useDAO, useVotes } from 'contexts';
import { FC } from 'react';
import { BiSearch } from 'react-icons/bi';

export const SearchProposalInput: FC = () => {
  const { searchProposal } = useVotes();
  const { theme } = useDAO();
  return (
    <Flex flexDir="column" maxW="300" flex="1" minW="max-content">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={BiSearch} color={theme.title} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Find a vote by proposal..."
          w="full"
          onChange={event => searchProposal(event.target.value)}
          boxShadow={theme.card.shadow}
          _placeholder={{
            color: theme.subtitle,
          }}
          _focusVisible={{
            borderColor: theme.title,
            boxShadow: `0 0 0 1px ${theme.title}`,
          }}
        />
      </InputGroup>
    </Flex>
  );
};
