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
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;
  const { handleSearch } = useDelegates();

  return (
    <Flex flexDir="column">
      <Text fontFamily="heading" color={theme.title}>
        Search
      </Text>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={BiSearch} color={theme.title} />}
        />
        <Input
          type="text"
          placeholder="Find delegate by address or ens name..."
          w={{ base: 'full', xl: '36.25rem' }}
          onChange={event => handleSearch(event.target.value)}
          boxShadow={theme.cardShadow}
          _placeholder={{
            color: theme.subtitle,
          }}
          _focusVisible={{
            borderColor: theme.branding,
            boxShadow: `0 0 0 1px ${theme.branding}`,
          }}
        />
      </InputGroup>
    </Flex>
  );
};
