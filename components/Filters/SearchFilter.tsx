/* eslint-disable react/no-children-prop */
import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import { useDAO, useDelegates } from 'contexts';

export const SearchFilter = () => {
  const { theme } = useDAO();
  const { handleSearch } = useDelegates();

  return (
    <Flex flexDir="column" maxW="740">
      <Text fontFamily="heading" color={theme.filters.head}>
        Search
      </Text>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={BiSearch} color={theme.title} />}
        />
        <Input
          type="text"
          placeholder="Find delegate by ENS name or address..."
          w={{ base: 'full', xl: '36.25rem' }}
          onChange={event => handleSearch(event.target.value)}
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
