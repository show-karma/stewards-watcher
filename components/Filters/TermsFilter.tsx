import { Checkbox, Flex } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';

export const TermsFilter = () => {
  const { theme } = useDAO();
  const { acceptedTermsOnly, handleAcceptedTermsOnly } = useDelegates();
  return (
    <Flex
      bgColor={theme.filters.bg}
      borderWidth="1px"
      borderColor={theme.filters.border}
      borderStyle="solid"
      boxShadow={theme.filters.shadow}
      color={theme.filters.title}
      gap="1"
      fontFamily="heading"
      fontWeight="normal"
      textAlign="left"
      fontSize="md"
      minW="min-content"
      w={{ base: 'full', md: 'max-content' }}
      maxW="full"
      _hover={{
        bg: theme.filters.activeBg,
      }}
      _active={{
        bg: theme.filters.activeBg,
      }}
      px="4"
      borderRadius="4px"
      _focus={{}}
      _focusWithin={{}}
    >
      <Checkbox
        checked={acceptedTermsOnly}
        onChange={event => handleAcceptedTermsOnly(event.target.checked)}
      >
        Accepted terms
      </Checkbox>
    </Flex>
  );
};
