import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { OrderFilter } from './OrderFilter';
import { StatFilter } from './StatFilter';

export const SortBy: FC = () => {
  const { theme } = useDAO();
  return (
    <Flex
      align="flex-end"
      justify="center"
      gap={{ base: '1', sm: '2' }}
      w={{ base: 'full', md: 'max-content' }}
    >
      <Flex
        flexDir={{ base: 'column' }}
        w={{ base: 'full', md: 'max-content' }}
      >
        <Text fontFamily="heading" color={theme.filters.head}>
          Order by
        </Text>
        <Flex
          flexDir="row"
          gap={{ base: '1', sm: '2' }}
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
        >
          <StatFilter />
          <Flex gap={{ base: '1', sm: '2' }} w="full">
            <OrderFilter />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
