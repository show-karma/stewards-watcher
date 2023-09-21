/* eslint-disable react/no-children-prop */
import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import { useDAO, useDelegates } from 'contexts';
import { useMemo, useState } from 'react';

export const SearchFilter = () => {
  const { theme } = useDAO();
  const { handleSearch, userToFind } = useDelegates();
  const [input, setInput] = useState(userToFind);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (event: any) => {
    setInput(event.target.value);
    handleSearch(event.target.value.trim());
  };

  useMemo(() => {
    if (!userToFind) setInput('');
  }, [userToFind]);

  return (
    <Flex flexDir="column" maxW="27rem" width="full">
      <Text fontFamily="heading" color={theme.filters.head} pb="5px">
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
          value={input}
          onChange={handleInput}
          boxShadow={theme.card.shadow}
          _placeholder={{
            color: theme.subtitle,
          }}
          px="4"
          py="5"
          _focusVisible={{
            borderColor: useColorModeValue('gray.500', 'gray.500'),
          }}
        />
      </InputGroup>
    </Flex>
  );
};
