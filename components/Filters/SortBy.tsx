import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { OrderFilter } from './OrderFilter';
import { StatFilter } from './StatFilter';

export const SortBy: FC = () => {
  const { theme } = useDAO();
  return (
    <Flex
      align={{ base: 'flex-start', md: 'center' }}
      gap="4"
      flexDir={{ base: 'column', md: 'row' }}
      w={{ base: 'full', md: 'max-content' }}
    >
      <Text
        fontFamily="heading"
        color={theme.filters.head}
        w="max-content"
        h="min-content"
      >
        Sort by:
      </Text>
      <StatFilter />
      <OrderFilter />
    </Flex>
  );
};
