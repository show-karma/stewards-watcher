import { Button, Icon } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { MdClose } from 'react-icons/md';

export const ClearButton = () => {
  const { clearFilters } = useDelegates();
  const { theme } = useDAO();
  return (
    <Button
      bg="transparent"
      color={theme.text}
      fontSize="md"
      fontFamily="body"
      onClick={clearFilters}
      _hover={{}}
      _active={{}}
      _focus={{}}
      _focusWithin={{}}
      fontWeight="semibold"
      gap="1"
    >
      <Icon as={MdClose} h="4" w="4" />
      Clear
    </Button>
  );
};
