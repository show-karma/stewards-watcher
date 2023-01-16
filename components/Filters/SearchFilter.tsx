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
    <Flex flexDir="column" maxW="27rem" width="full">
      <Text fontFamily="heading" color={theme.filters.head}>
        Search
      </Text>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={BiSearch} color={theme.title} boxSize="5" />}
        />
        <Input
          type="text"
          placeholder="Find delegate by Name, ENS name or address"
          w="full"
          onChange={event => handleSearch(event.target.value)}
          boxShadow={theme.card.shadow}
          _placeholder={{
            color: theme.subtitle,
          }}
          px="4"
          py="5"
          _focusVisible={{
            borderColor: theme.title,
            boxShadow: `0 0 0 1px ${theme.title}`,
          }}
        />
      </InputGroup>
    </Flex>
  );
};
