import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';

export const ClearButton: FC = () => {
  const { theme } = useDAO();
  const { clearFilters, isFiltersDirty } = useDelegates();
  const filterDirty = isFiltersDirty();
  return (
    <Button
      bg={filterDirty ? theme.branding : 'transparent'}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={filterDirty ? 'transparent' : theme.filters.title}
      color={filterDirty ? theme.buttonText : theme.filters.title}
      fontWeight="normal"
      _hover={{
        opacity: 0.8,
      }}
      _active={{}}
      _focus={{}}
      _focusVisible={{}}
      _focusWithin={{}}
      px="4"
      borderRadius="full"
      onClick={() => clearFilters()}
    >
      Clear filters
    </Button>
  );
};
