import { Flex } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { OrderByFilters } from './OrderBy';
import { SearchFilter } from './Search';

export const Filters = () => {
  const { theme } = useDAO();
  return (
    <Flex
      bg={theme.card.background}
      boxShadow={theme.card.shadow}
      borderRadius="xl"
      w="full"
      flexDir={{ base: 'column', xl: 'row' }}
      flexWrap="wrap"
      gap="8"
      align={{ base: 'flex-start', xl: 'center' }}
      py="5"
      px="4"
      justify="space-between"
      mt="1.5rem"
    >
      <SearchFilter />
      <OrderByFilters />
    </Flex>
  );
};
