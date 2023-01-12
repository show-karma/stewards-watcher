import { Flex } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { OrderByFilters } from './OrderByFilters';
import { SearchFilter } from './SearchFilter';

export const Filters = () => {
  const { theme } = useDAO();
  return (
    <Flex
      bgColor={theme.card.background}
      boxShadow={theme.card.shadow}
      w="full"
      flexDir={{ base: 'column', xl: 'row' }}
      flexWrap="wrap"
      gap="8"
      align={{ base: 'flex-start', xl: 'center' }}
      p="6"
      borderRadius="xl"
      justify="flex-start"
    >
      <SearchFilter />
      <OrderByFilters />
    </Flex>
  );
};
