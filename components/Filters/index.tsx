import { Flex } from '@chakra-ui/react';
import { THEME } from 'configs';
import { OrderByFilters } from './OrderByFilters';
import { SearchFilter } from './SearchFilter';

export const Filters = () => (
  <Flex
    bgColor={THEME.card}
    w="full"
    flexDir="row"
    gap="8"
    align="center"
    p="6"
    borderRadius="xl"
  >
    <SearchFilter />
    <OrderByFilters />
  </Flex>
);
