import { useDAO, useDelegates } from 'contexts';

import { Text } from '@chakra-ui/react';

const EmptyState = () => {
  const { theme } = useDAO();
  const { isSearchDirty, isFiltering } = useDelegates();

  const isSearchingOrFiltering = isSearchDirty || isFiltering;

  return (
    <Text as="p" color={theme.title} w="full" align="center">
      {isSearchingOrFiltering
        ? `We couldn't find any contributors matching that criteria`
        : `We couldn't find any contributor info`}
    </Text>
  );
};

export { EmptyState };
