import { Flex, Switch } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';

export const ToSFilter = () => {
  const { theme } = useDAO();
  const { acceptedTermsOnly, handleAcceptedTermsOnly, setupFilteringUrl } =
    useDelegates();
  return (
    <Flex
      bgColor="transparent"
      boxShadow={theme.filters.shadow}
      gap="1"
      fontFamily="heading"
      fontWeight="normal"
      textAlign="left"
      fontSize="md"
      minW="min-content"
      w={{ base: 'full', md: 'max-content' }}
      maxW="full"
      px="4"
      borderRadius="4px"
      _focus={{}}
      _focusWithin={{}}
      align="center"
      justify="center"
    >
      <Switch
        color={theme.filters.title}
        colorScheme="green"
        defaultChecked={acceptedTermsOnly}
        onChange={event => {
          handleAcceptedTermsOnly(event.target.checked);
          setupFilteringUrl('tos', event.target.checked.toString());
        }}
        display="flex"
        alignItems="center"
        sx={{
          '.chakra-switch__track': {
            bg: acceptedTermsOnly ? '#0FAC85' : '#C8C8C8',
          },
          '.chakra-switch__label': {
            opacity: acceptedTermsOnly ? 1 : 0.5,
          },
        }}
      >
        Accepted Code of Conduct
      </Switch>
    </Flex>
  );
};
