import { Flex, Switch } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';

export const TermsFilter = () => {
  const { theme } = useDAO();
  const { delegateOffersToA, handleDelegateOffersToA, setupFilteringUrl } =
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
        defaultChecked={delegateOffersToA}
        onChange={event => {
          handleDelegateOffersToA(event.target.checked);
          setupFilteringUrl('toa', event.target.checked.toString());
        }}
        display="flex"
        alignItems="center"
        sx={{
          '.chakra-switch__track': {
            bg: delegateOffersToA ? '#0FAC85' : '#C8C8C8',
          },
          '.chakra-switch__label': {
            opacity: delegateOffersToA ? 1 : 0.5,
          },
        }}
      >
        Offer Delegation Agreement
      </Switch>
    </Flex>
  );
};
