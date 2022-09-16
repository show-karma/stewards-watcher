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
import debounce from 'lodash.debounce';
import { useDAO, useDelegates } from 'contexts';

export const SearchFilter = () => {
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;
  const { selectUserToFind } = useDelegates();
  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  return (
    <Flex flexDir="column">
      <Text fontFamily="heading">Search</Text>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={BiSearch} color={theme.title} />}
        />
        <Input
          type="text"
          placeholder="Type what you’re looking for..."
          w={{ base: 'full', xl: '36.25rem' }}
          onChange={event => handleSearch(event.target.value)}
          _focusVisible={{
            borderColor: theme.branding,
            boxShadow: `0 0 0 1px ${theme.branding}`,
          }}
        />
      </InputGroup>
    </Flex>
  );
};
