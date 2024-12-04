import { Button, Flex } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { FC } from 'react';

export const ClearButton: FC = () => {
  const { theme } = useDAO();
  const { clearFilters, isFiltersDirty } = useDelegates();
  const filterDirty = isFiltersDirty();
  return (
    <Flex
      {...(theme.brandingImageColor && {
        style: {
          backgroundImage: filterDirty ? theme.brandingImageColor : 'none',
          padding: '2px',
          borderRadius: '600px',
        },
      })}
    >
      <Button
        bg={theme.branding}
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
    </Flex>
  );
};
