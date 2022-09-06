/* eslint-disable react/no-children-prop */
import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { THEME } from 'configs';
import { BiSearch } from 'react-icons/bi';
import debounce from 'lodash.debounce';
import { useStewards } from 'contexts';

export const SearchFilter = () => {
  const { selectUserToFind } = useStewards();
  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  return (
    <Flex flexDir="column">
      <Text fontFamily="heading">Search</Text>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={BiSearch} color={THEME.title} />}
        />
        <Input
          type="text"
          placeholder="Type what you’re loking for..."
          w={['full', '36.25rem']}
          onChange={event => handleSearch(event.target.value)}
          _focusVisible={{
            borderColor: THEME.branding,
            boxShadow: `0 0 0 1px ${THEME.branding}`,
          }}
        />
      </InputGroup>
    </Flex>
  );
};
