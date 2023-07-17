import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';

export const ResetFiltersButton: FC = () => {
  const { theme } = useDAO();
  const { clearFilters } = useDelegates();
  return (
    <Button
      bg="transparent"
      color={theme.filters.title}
      fontWeight="normal"
      _hover={{
        opacity: 0.8,
      }}
      _active={{}}
      _focus={{}}
      _focusVisible={{}}
      _focusWithin={{}}
      px="1"
      onClick={() => clearFilters()}
    >
      Reset filters
    </Button>
  );
};
