import { Flex } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { OrderByFilters } from './OrderByFilters';
import { SearchFilter } from './SearchFilter';

export const Filters = () => {
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;
  return (
    <Flex
      bgColor={theme.card.background}
      boxShadow={theme.card.shadow}
      w={{ base: 'full', xl: 'max-content' }}
      flexDir={['row']}
      flexWrap="wrap"
      gap="8"
      align="center"
      p="6"
      borderRadius="xl"
    >
      <SearchFilter />
      <OrderByFilters />
    </Flex>
  );
};
